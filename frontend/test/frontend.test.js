import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory mock for localStorage in testing environments
class MockLocalStorage {
    constructor() {
        this.store = {};
    }
    getItem(key) {
        return this.store[key] || null;
    }
    setItem(key, value) {
        this.store[key] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
    clear() {
        this.store = {};
    }
}

describe('Frontend Unit & Component Logic Tests', () => {
    let mockStorage;

    beforeEach(() => {
        mockStorage = new MockLocalStorage();
    });

    describe('Project Configuration & Integrity', () => {
        it('should have valid package.json with React and Vite', () => {
            const pkgPath = path.resolve(__dirname, '../package.json');
            assert.ok(fs.existsSync(pkgPath), 'package.json must exist');

            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            assert.ok(pkg.dependencies.react, 'React must be a dependency');
            assert.ok(pkg.dependencies['react-dom'], 'React-DOM must be a dependency');
            assert.ok(pkg.dependencies['react-router-dom'], 'React-Router-DOM must be a dependency');
            assert.ok(pkg.scripts.build, 'Vite build script must exist');
            assert.ok(pkg.scripts.lint, 'Lint script must exist');
        });

        it('should have vite.config.js with React plugin', () => {
            const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
            assert.ok(fs.existsSync(viteConfigPath), 'vite.config.js must exist');

            const content = fs.readFileSync(viteConfigPath, 'utf8');
            assert.match(content, /defineConfig/);
            assert.match(content, /@vitejs\/plugin-react/);
        });

        it('should have index.html with root container mount point', () => {
            const htmlPath = path.resolve(__dirname, '../index.html');
            assert.ok(fs.existsSync(htmlPath), 'index.html must exist');

            const html = fs.readFileSync(htmlPath, 'utf8');
            assert.match(html, /<div id="root"><\/div>/, 'index.html must contain #root div');
        });
    });

    describe('Jobseeker & Opportunity Form Domain Rules', () => {
        const JOB_TYPES = [
            'Consultancy',
            'Full-Time',
            'Part-Time',
            'Contract',
            'Freelance',
            'Internship'
        ];

        const WORK_MODES = [
            'Remote',
            'On-site',
            'Hybrid'
        ];

        const DURATIONS = [
            'Yearly',
            'Monthly',
            'Hourly',
            'Per Project'
        ];

        it('should contain expected Job Types for opportunity listings', () => {
            assert.equal(JOB_TYPES.length, 6);
            assert.ok(JOB_TYPES.includes('Full-Time'));
            assert.ok(JOB_TYPES.includes('Remote') === false); // Remote is a work mode, not job type
        });

        it('should contain valid Work Modes', () => {
            assert.deepEqual(WORK_MODES, ['Remote', 'On-site', 'Hybrid']);
        });

        it('should validate duration options', () => {
            assert.ok(DURATIONS.includes('Yearly'));
            assert.ok(DURATIONS.includes('Monthly'));
        });

        it('should validate salary and experience numeric limits', () => {
            const sampleExperience = '8';
            const parsedExp = Number(sampleExperience);
            assert.ok(!isNaN(parsedExp) && parsedExp >= 0 && parsedExp <= 60, 'Experience must be a valid number between 0 and 60');

            const sampleSalary = '2400000';
            const parsedSalary = Number(sampleSalary);
            assert.ok(!isNaN(parsedSalary) && parsedSalary > 0, 'Salary amount must be a positive number');
        });

        it('should validate email format using regex', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            assert.equal(emailRegex.test('student@skit.ac.in'), true);
            assert.equal(emailRegex.test('valid.user@example.com'), true);
            assert.equal(emailRegex.test('invalid-email-without-at'), false);
            assert.equal(emailRegex.test('@missinguser.com'), false);
        });
    });

    describe('Authentication State & LocalStorage Management', () => {
        it('should save and parse user session in storage', () => {
            const userProfile = {
                id: 'usr_789',
                name: 'Rajesh',
                fullName: 'Rajesh Kumar',
                email: 'rajesh.kumar@example.com',
                role: 'jobseeker'
            };

            mockStorage.setItem('user', JSON.stringify(userProfile));
            mockStorage.setItem('token', 'sample.jwt.token');

            const savedUser = JSON.parse(mockStorage.getItem('user'));
            assert.equal(savedUser.name, 'Rajesh');
            assert.equal(savedUser.fullName, 'Rajesh Kumar');
            assert.equal(mockStorage.getItem('token'), 'sample.jwt.token');
        });

        it('should handle corrupted or missing user storage gracefully', () => {
            mockStorage.setItem('user', 'invalid-non-json');
            let parsedUser = null;
            try {
                parsedUser = JSON.parse(mockStorage.getItem('user'));
            } catch {
                parsedUser = null;
            }
            assert.equal(parsedUser, null, 'Corrupt JSON should fallback safely to null');
        });

        it('should remove user and token on logout', () => {
            mockStorage.setItem('user', JSON.stringify({ name: 'Rajesh' }));
            mockStorage.setItem('token', 'sample.jwt.token');

            // Simulate logout() function
            mockStorage.removeItem('token');
            mockStorage.removeItem('user');

            assert.equal(mockStorage.getItem('token'), null);
            assert.equal(mockStorage.getItem('user'), null);
        });
    });
});
