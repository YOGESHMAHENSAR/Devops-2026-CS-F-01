import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

describe("Recruiter profile and job posting forms", () => {
    it("renders the recruiter profile fields and saves through the recruiter API", () => {
        const page = fs.readFileSync(path.resolve(testDirectory, "../src/Pages/Employer.jsx"), "utf8");
        const api = fs.readFileSync(path.resolve(testDirectory, "../src/api/recruiter.js"), "utf8");

        for (const field of ["orgName", "designation", "phone", "website", "companySize", "industry", "headquarters", "country"]) {
            assert.match(page, new RegExp(`name="${field}"`), `Recruiter profile form should include ${field}`);
        }
        assert.match(api, /saveRecruiterProfile/);
        assert.match(api, /request\("\/profile", "POST"/);
    });

    it("renders required job posting fields and submits postings to the backend", () => {
        const page = fs.readFileSync(path.resolve(testDirectory, "../src/Pages/Employer.jsx"), "utf8");
        const api = fs.readFileSync(path.resolve(testDirectory, "../src/api/recruiter.js"), "utf8");

        for (const field of [
            "title", "description", "openingCount", "minExperience", "maxExperience",
            "skillDemand", "jobType", "workMode", "city", "state", "salary",
            "currency", "salaryPeriod", "status", "expiresAt"
        ]) {
            assert.ok(page.includes(`name="${field}"`) || page.includes(`${field}:`), `Job posting form should use ${field}`);
        }
        assert.match(page, /createJobPosting\(/);
        assert.match(api, /request\("\/jobs", "POST"/);
        assert.match(api, /getJobApplicants/);
    });
});
