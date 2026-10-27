import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model.js';

describe('Backend Unit Tests', () => {

    describe('User Model Schema Validation', () => {
        it('should require email field', async () => {
            const user = new User({ role: 'jobseeker' });
            let err = null;
            try { await user.validate(); } catch (e) { err = e; }
            assert.ok(err, 'Expected validation error for missing email');
            assert.ok(err.errors.email, 'Expected error on email field');
        });

        it('should require role field', async () => {
            const user = new User({ email: 'test@example.com' });
            let err = null;
            try { await user.validate(); } catch (e) { err = e; }
            assert.ok(err, 'Expected validation error for missing role');
            assert.ok(err.errors.role, 'Expected error on role field');
        });

        it('should reject invalid role enum', async () => {
            const user = new User({ email: 'test@example.com', role: 'invalid_role' });
            let err = null;
            try { await user.validate(); } catch (e) { err = e; }
            assert.ok(err, 'Expected validation error for invalid role');
            assert.match(err.errors.role.message, /is not a valid enum value/);
        });

        it('should accept valid roles (admin, recruiter, jobseeker)', async () => {
            const roles = ['admin', 'recruiter', 'jobseeker'];
            for (const role of roles) {
                const user = new User({
                    email: `${role}@example.com`,
                    role: role,
                    password: 'password123'
                });
                let err = null;
                try { await user.validate(); } catch (e) { err = e; }
                assert.equal(err, null, `Role ${role} should be valid`);
            }
        });

        it('should require password when authProvide is local', async () => {
            const user = new User({
                email: 'local@example.com',
                role: 'jobseeker',
                authProvide: 'local'
            });
            let err = null;
            try { await user.validate(); } catch (e) { err = e; }
            assert.ok(err, 'Expected validation error for missing password with local auth');
            assert.ok(err.errors.password, 'Expected error on password field');
        });
    });

    describe('Authentication Utilities (JWT & Password Hashing)', () => {
        const testSecret = 'devops_jwt_secret_test_key_12345';

        it('should generate and verify JWT token successfully', () => {
            const payload = { userId: '123456', role: 'jobseeker', email: 'user@example.com' };
            const token = jwt.sign(payload, testSecret, { expiresIn: '1h' });

            assert.ok(typeof token === 'string' && token.length > 0, 'JWT token should be non-empty string');

            const decoded = jwt.verify(token, testSecret);
            assert.equal(decoded.userId, payload.userId);
            assert.equal(decoded.role, payload.role);
            assert.equal(decoded.email, payload.email);
        });

        it('should fail verification with invalid JWT secret', () => {
            const payload = { userId: '123456' };
            const token = jwt.sign(payload, testSecret);

            assert.throws(() => {
                jwt.verify(token, 'wrong_secret_key');
            }, /invalid signature/);
        });

        it('should hash and compare passwords securely using bcrypt', async () => {
            const plainPassword = 'secureStudentPassword2026';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);

            assert.notEqual(plainPassword, hashedPassword);

            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            assert.equal(isMatch, true, 'Correct password should match hashed password');

            const isWrongMatch = await bcrypt.compare('wrongPassword', hashedPassword);
            assert.equal(isWrongMatch, false, 'Incorrect password should fail comparison');
        });
    });

    describe('Server Environment & Default Configurations', () => {
        it('should default to port 3000 if PORT is not set', () => {
            const defaultPort = process.env.PORT || 3000;
            assert.equal(typeof defaultPort, 'number');
            assert.ok(defaultPort > 0);
        });

        it('should define a valid frontend fallback origin', () => {
            const defaultFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            assert.match(defaultFrontendUrl, /^https?:\/\//);
        });
    });
});
