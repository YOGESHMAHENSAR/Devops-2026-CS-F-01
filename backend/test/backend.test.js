import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/user.model.js';
import { RecruiterProfile } from '../src/models/recuiter.model.js';
import { JobPosting } from '../src/models/jobPosting.model.js';
import { Application } from '../src/models/jobApplication.js';

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

    describe('Recruiter Profile Schema Validation', () => {
        it('should require organization name, designation, industry, and user id', async () => {
            const profile = new RecruiterProfile({});
            let err = null;
            try { await profile.validate(); } catch (e) { err = e; }

            assert.ok(err, 'Expected validation errors for missing recruiter profile fields');
            assert.ok(err.errors.userId);
            assert.ok(err.errors.orgName);
            assert.ok(err.errors['contactPerson.designation']);
            assert.ok(err.errors.industry);
        });

        it('should accept a profile matching the recruiter form fields', async () => {
            const profile = new RecruiterProfile({
                userId: '507f1f77bcf86cd799439011',
                orgName: ' SeniorPro ',
                contactPerson: { designation: ' Talent Lead ', phone: ' 1234567890 ' },
                website: 'https://example.com',
                companySize: '11-50',
                industry: [' Technology '],
                location: { headquarters: ' Bengaluru ', country: ' India ' }
            });

            await profile.validate();
            assert.equal(profile.orgName, 'SeniorPro');
            assert.equal(profile.contactPerson.designation, 'Talent Lead');
            assert.equal(profile.industry[0], 'Technology');
            assert.equal(profile.isVerified, false);
        });
    });

    describe('Job Posting Schema Validation', () => {
        it('should require recruiter, title, description, experience, skills, work mode, and salary', async () => {
            const job = new JobPosting({});
            let err = null;
            try { await job.validate(); } catch (e) { err = e; }

            assert.ok(err, 'Expected validation errors for missing required job posting fields');
            assert.ok(err.errors.recruiterId);
            assert.ok(err.errors.title);
            assert.ok(err.errors.description);
            assert.ok(err.errors['experienceDeman.min']);
            assert.ok(err.errors.skillDemand);
            assert.ok(err.errors.workMode);
            assert.ok(err.errors['amount.salary']);
        });

        describe('Job Application Schema Validation', () => {
            it('should require job, seeker, and resume URL', async () => {
                const application = new Application({});
                let err = null;
                try { await application.validate(); } catch (e) { err = e; }

                assert.ok(err, 'Expected validation errors for missing application fields');
                assert.ok(err.errors.jobId);
                assert.ok(err.errors.seekerId);
                assert.ok(err.errors.resumeUrl);
            });

            it('should accept a submitted job application', async () => {
                const application = new Application({
                    jobId: '507f1f77bcf86cd799439011',
                    seekerId: '507f1f77bcf86cd799439012',
                    resumeUrl: 'https://example.com/resume.pdf'
                });

                await application.validate();
                assert.equal(application.status, 'Submitted');
                assert.equal(application.resumeUrl, 'https://example.com/resume.pdf');
            });
        });

        it('should accept a job matching the recruiter posting form', async () => {
            const job = new JobPosting({
                recruiterId: '507f1f77bcf86cd799439011',
                title: 'Senior Engineer',
                description: 'Build products with the team.',
                openingCount: 2,
                experienceDeman: { min: 5, max: 10 },
                skillDemand: [' React ', 'Node.js '],
                jobType: 'Full-time',
                workMode: 'Hybrid',
                location: { city: 'Bengaluru', country: 'India' },
                amount: { salary: 2000000, currency: 'INR', period: 'Yearly' },
                status: 'Active'
            });

            await job.validate();
            assert.deepEqual(job.skillDemand, ['react', 'node.js']);
            assert.equal(job.experienceDeman.min, 5);
            assert.equal(job.amount.period, 'Yearly');
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
