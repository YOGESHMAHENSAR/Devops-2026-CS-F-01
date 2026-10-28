import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RecruiterProfile } from "../src/models/recuiter.model.js";
import { JobPosting } from "../src/models/jobPosting.model.js";

describe("Recruiter profile form", () => {
    it("accepts the recruiter form fields and model defaults", async () => {
        const profile = new RecruiterProfile({
            userId: "507f1f77bcf86cd799439011",
            orgName: " SeniorPro ",
            contactPerson: {
                designation: " Talent Lead ",
                phone: " 1234567890 "
            },
            website: "https://example.com",
            companySize: "11-50",
            industry: [" Technology ", " Healthcare "],
            location: {
                headquarters: " Bengaluru ",
                country: " India "
            }
        });

        await profile.validate();
        assert.equal(profile.orgName, "SeniorPro");
        assert.equal(profile.contactPerson.designation, "Talent Lead");
        assert.equal(profile.contactPerson.phone, "1234567890");
        assert.deepEqual(profile.industry, ["Technology", "Healthcare"]);
        assert.equal(profile.location.headquarters, "Bengaluru");
        assert.equal(profile.isVerified, false);
    });

    it("rejects a recruiter profile missing required fields or with invalid company size", async () => {
        const missingFields = new RecruiterProfile({});
        await assert.rejects(missingFields.validate(), (error) => {
            assert.ok(error.errors.userId);
            assert.ok(error.errors.orgName);
            assert.ok(error.errors["contactPerson.designation"]);
            assert.ok(error.errors.industry);
            return true;
        });

        const invalidSize = new RecruiterProfile({
            userId: "507f1f77bcf86cd799439011",
            orgName: "SeniorPro",
            contactPerson: { designation: "Talent Lead" },
            industry: ["Technology"],
            companySize: "1000-2000"
        });
        await assert.rejects(invalidSize.validate(), (error) => {
            assert.ok(error.errors.companySize);
            return true;
        });
    });
});

describe("Job posting form", () => {
    it("accepts the fields entered in the recruiter job form", async () => {
        const job = new JobPosting({
            recruiterId: "507f1f77bcf86cd799439011",
            title: "Senior Engineer",
            description: "Build products with the team.",
            openingCount: 2,
            experienceDeman: { min: 5, max: 10 },
            skillDemand: [" React ", "Node.js "],
            jobType: "Full-time",
            workMode: "Hybrid",
            location: { city: "Bengaluru", state: "Karnataka", country: "India" },
            amount: { salary: 2000000, currency: "INR", period: "Yearly" },
            status: "Active",
            expiresAt: new Date("2027-01-01")
        });

        await job.validate();
        assert.equal(job.title, "Senior Engineer");
        assert.deepEqual(job.skillDemand, ["react", "node.js"]);
        assert.equal(job.experienceDeman.min, 5);
        assert.equal(job.experienceDeman.max, 10);
        assert.equal(job.amount.salary, 2000000);
        assert.equal(job.workMode, "Hybrid");
    });

    it("rejects missing required fields and unsupported form selections", async () => {
        const missingFields = new JobPosting({});
        await assert.rejects(missingFields.validate(), (error) => {
            assert.ok(error.errors.recruiterId);
            assert.ok(error.errors.title);
            assert.ok(error.errors.description);
            assert.ok(error.errors["experienceDeman.min"]);
            assert.ok(error.errors.skillDemand);
            assert.ok(error.errors.workMode);
            assert.ok(error.errors["amount.salary"]);
            return true;
        });

        const invalidSelections = new JobPosting({
            recruiterId: "507f1f77bcf86cd799439011",
            title: "Senior Engineer",
            description: "Build products with the team.",
            experienceDeman: { min: 5 },
            skillDemand: ["Node.js"],
            jobType: "Something else",
            workMode: "Anywhere",
            amount: { salary: 100000, period: "Daily" }
        });
        await assert.rejects(invalidSelections.validate(), (error) => {
            assert.ok(error.errors.jobType);
            assert.ok(error.errors.workMode);
            assert.ok(error.errors["amount.period"]);
            return true;
        });
    });
});
