const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const deriveKey = promisify(scrypt);
const branches = new Set(['CSE', 'CSE(AI)', 'CSE(DS)', 'EE', 'ME']);
const sessionLifetime = 8 * 60 * 60 * 1000;
const publicStudent = ({ id, username, email, phone, branch }) => ({ id, username, email, phone, branch });

async function createApp({ dataDir = process.env.DATA_DIR || path.join(__dirname, 'data'), secureCookies = process.env.COOKIE_SECURE === 'true' } = {}) {
    await fs.mkdir(dataDir, { recursive: true });
    const dataFile = path.join(dataDir, 'student.json');
    try {
        await fs.writeFile(dataFile, '[]\n', { flag: 'wx', mode: 0o600 });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
    const readStudents = async () => {
        const students = JSON.parse(await fs.readFile(dataFile, 'utf8'));
        if (!Array.isArray(students)) throw new Error('Student storage must contain a JSON array.');
        return students;
    };
    await readStudents();
    let writeQueue = Promise.resolve();
    const sessions = new Map();
    const loginAttempts = new Map();
    const cleanup = setInterval(() => {
        for (const [key, value] of sessions) if (value.expires <= Date.now()) sessions.delete(key);
        for (const [key, value] of loginAttempts) if (value.expires <= Date.now()) loginAttempts.delete(key);
    }, 60_000);
    cleanup.unref();

    const cookie = (token, maxAge) => `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secureCookies ? '; Secure' : ''}`;
    const reply = (res, status, body) => {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(body));
    };
    const readBody = async (req) => {
        if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
            throw Object.assign(new Error('Send JSON data.'), { status: 415 });
        }
        let size = 0;
        const chunks = [];
        for await (const chunk of req) {
            size += chunk.length;
            if (size > 16_384) throw Object.assign(new Error('Request is too large.'), { status: 413 });
            chunks.push(chunk);
        }
        try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
            return body;
        } catch {
            throw Object.assign(new Error('Invalid JSON request.'), { status: 400 });
        }
    };
    const getSession = (req) => {
        const token = /(?:^|;\s*)session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
        const session = sessions.get(token);
        if (!session || session.expires <= Date.now()) {
            sessions.delete(token);
            return null;
        }
        return { token, ...session };
    };
    const files = {
        '/': ['index.html', 'text/html'],
        '/index.html': ['index.html', 'text/html'],
        '/register': ['index.html', 'text/html'],
        '/login': ['login.html', 'text/html'],
        '/login.html': ['login.html', 'text/html'],
        '/welcome': ['welcome.html', 'text/html'],
        '/welcome.html': ['welcome.html', 'text/html'],
        '/styles.css': ['styles.css', 'text/css'],
        '/registration.js': ['registration.js', 'text/javascript'],
        '/login.js': ['login.js', 'text/javascript'],
        '/welcome.js': ['welcome.js', 'text/javascript'],
    };

    const server = http.createServer(async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
        try {
            const url = new URL(req.url, 'http://localhost');
            if (req.method === 'POST' && req.headers.origin) {
                if (new URL(req.headers.origin).host !== req.headers.host) return reply(res, 403, { error: 'Request origin is not allowed.' });
            }
            if (req.method === 'GET' && url.pathname === '/health') return reply(res, 200, { status: 'ok' });
            if (req.method === 'POST' && url.pathname === '/api/register') {
                const body = await readBody(req);
                const username = typeof body.username === 'string' ? body.username.trim() : '';
                const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
                const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
                if (!username || username.length > 100 || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !/^\d{10}$/.test(phone) || !branches.has(body.branch) || typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 128 || !body.password.trim()) {
                    return reply(res, 400, { error: 'Enter a name, valid email, 10-digit phone number, branch, and password of 8–128 characters.' });
                }
                const salt = randomBytes(16).toString('hex');
                const passwordHash = (await deriveKey(body.password, salt, 64)).toString('hex');
                const operation = writeQueue.then(async () => {
                    const students = await readStudents();
                    if (students.some(student => student.email.toLowerCase() === email)) {
                        throw Object.assign(new Error('An account with this email already exists. Please log in.'), { status: 409 });
                    }
                    const student = { id: randomBytes(16).toString('hex'), username, email, phone, branch: body.branch, salt, passwordHash, createdAt: new Date().toISOString() };
                    students.push(student);
                    await fs.writeFile(`${dataFile}.tmp`, `${JSON.stringify(students, null, 2)}\n`, { mode: 0o600 });
                    await fs.rename(`${dataFile}.tmp`, dataFile);
                    return student;
                });
                writeQueue = operation.catch(() => {});
                const student = await operation;
                return reply(res, 201, { message: 'Registration successful. Please log in.', student: publicStudent(student) });
            }
            if (req.method === 'POST' && url.pathname === '/api/login') {
                const body = await readBody(req);
                const address = req.socket.remoteAddress;
                let attempt = loginAttempts.get(address);
                if (!attempt || attempt.expires <= Date.now()) {
                    attempt = { count: 0, expires: Date.now() + 15 * 60_000 };
                    loginAttempts.set(address, attempt);
                }
                if (++attempt.count > 20) return reply(res, 429, { error: 'Too many login attempts. Try again in 15 minutes.' });
                const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
                if (!email || typeof body.password !== 'string' || body.password.length > 128) return reply(res, 400, { error: 'Enter your email and password.' });
                const student = (await readStudents()).find(entry => entry.email === email);
                const hash = await deriveKey(body.password, student?.salt || 'missing-account', 64);
                const expected = student ? Buffer.from(student.passwordHash, 'hex') : Buffer.alloc(64);
                if (!student || expected.length !== hash.length || !timingSafeEqual(hash, expected)) return reply(res, 401, { error: 'Invalid email or password.' });
                const previousSession = getSession(req);
                if (previousSession) sessions.delete(previousSession.token);
                const token = randomBytes(32).toString('hex');
                sessions.set(token, { studentId: student.id, expires: Date.now() + sessionLifetime });
                res.setHeader('Set-Cookie', cookie(token, sessionLifetime / 1000));
                return reply(res, 200, { student: publicStudent(student) });
            }
            if (req.method === 'POST' && url.pathname === '/api/logout') {
                const session = getSession(req);
                if (session) sessions.delete(session.token);
                res.setHeader('Set-Cookie', cookie('', 0));
                return reply(res, 200, { message: 'Logged out.' });
            }
            if (req.method === 'GET' && url.pathname === '/api/me') {
                const session = getSession(req);
                const student = session && (await readStudents()).find(entry => entry.id === session.studentId);
                if (!student) return reply(res, 401, { error: 'Please log in.' });
                return reply(res, 200, { student: publicStudent(student) });
            }
            if (req.method === 'GET' && Object.hasOwn(files, url.pathname)) {
                if (url.pathname.startsWith('/welcome') && !getSession(req)) {
                    res.writeHead(302, { Location: '/login' });
                    return res.end();
                }
                const [file, type] = files[url.pathname];
                const contents = await fs.readFile(path.join(__dirname, file));
                res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
                return res.end(contents);
            }
            return reply(res, 404, { error: 'Not found.' });
        } catch (error) {
            if (!error.status) console.error('Request failed:', error.message);
            if (!res.destroyed) reply(res, error.status || 500, { error: error.status ? error.message : 'Unable to complete the request. Please try again.' });
        }
    });
    server.on('close', () => clearInterval(cleanup));
    return server;
}

if (require.main === module) {
    createApp().then(server => {
        const port = process.env.PORT || 3000;
        server.listen(port, '0.0.0.0', () => console.log(`Student portal running at http://localhost:${port}`));
        for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
    }).catch(error => {
        console.error('Unable to start student portal:', error.message);
        process.exitCode = 1;
    });
}

module.exports = { createApp };
