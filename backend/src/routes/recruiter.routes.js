import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { RecruiterProfile } from "../models/recuiter.model.js";
import { JobPosting } from "../models/jobPosting.model.js";
import { Application } from "../models/jobApplication.js";
import { jobSeeker } from "../models/jobseeker.models.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const router = Router();

router.use(verifyToken);
router.use((req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            success: false,
            message: "Only recruiter accounts can access this profile."
        });
    }

    next();
});

router.get("/profile", async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const profile = await RecruiterProfile.findOne({ userId });

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error loading recruiter profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while loading recruiter profile."
        });
    }
});

router.get("/jobs", async (req, res) => {
    try {
        const recruiterId = req.user.id || req.user.userId;
        const jobs = await JobPosting.find({ recruiterId }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error("Error loading recruiter job postings:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while loading job postings."
        });
    }
});

router.get("/jobs/:jobId/applications", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.jobId)) {
            return res.status(400).json({ success: false, message: "Invalid job posting." });
        }

        const job = await JobPosting.findOne({
            _id: req.params.jobId,
            recruiterId: req.user.id || req.user.userId
        }).select("_id");

        if (!job) {
            return res.status(404).json({ success: false, message: "Job posting not found." });
        }

        const applications = await Application.find({ jobId: job._id }).sort({ createdAt: -1 }).lean();
        const seekerIds = applications.map((application) => application.seekerId);
        const [users, profiles] = await Promise.all([
            User.find({ _id: { $in: seekerIds } }).select("name email").lean(),
            jobSeeker.find({ userId: { $in: seekerIds } })
                .select("userId headline phone experience skills resumeUrl location")
                .lean()
        ]);
        const userById = new Map(users.map((user) => [String(user._id), user]));
        const profileByUserId = new Map(profiles.map((profile) => [String(profile.userId), profile]));

        return res.status(200).json({
            success: true,
            data: applications.map((application) => ({
                ...application,
                applicant: {
                    name: userById.get(String(application.seekerId))?.name || "",
                    email: userById.get(String(application.seekerId))?.email || "",
                    headline: profileByUserId.get(String(application.seekerId))?.headline || "",
                    phone: profileByUserId.get(String(application.seekerId))?.phone || "",
                    experience: profileByUserId.get(String(application.seekerId))?.experience ?? null,
                    skills: profileByUserId.get(String(application.seekerId))?.skills || [],
                    resumeUrl: application.resumeUrl,
                    location: profileByUserId.get(String(application.seekerId))?.location || {}
                }
            }))
        });
    } catch (error) {
        console.error("Error loading job applicants:", error);
        return res.status(500).json({ success: false, message: "Unable to load job applicants." });
    }
});

router.post("/jobs", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ success: false, message: "A job posting is required." });
        }

        const {
            title,
            description,
            openingCount,
            experienceDeman,
            skillDemand,
            jobType,
            workMode,
            location,
            amount,
            status,
            expiresAt
        } = req.body;
        const experience = experienceDeman && typeof experienceDeman === "object" && !Array.isArray(experienceDeman)
            ? experienceDeman
            : {};
        const jobLocation = location && typeof location === "object" && !Array.isArray(location)
            ? location
            : {};
        const salary = amount && typeof amount === "object" && !Array.isArray(amount)
            ? amount
            : {};
        const skills = Array.isArray(skillDemand)
            ? skillDemand
            : typeof skillDemand === "string"
                ? skillDemand.split(",")
                : [];
        const cleanedSkills = skills
            .filter((skill) => typeof skill === "string")
            .map((skill) => skill.trim())
            .filter(Boolean);
        const minimumExperience = Number(experience.min);
        const maximumExperience = experience.max === "" || experience.max === undefined || experience.max === null
            ? undefined
            : Number(experience.max);
        const openingTotal = Number(openingCount);
        const salaryAmount = Number(salary.salary);
        const requestedExpiry = expiresAt ? new Date(expiresAt) : undefined;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            !Number.isInteger(openingTotal) ||
            openingTotal < 1 ||
            !Number.isFinite(minimumExperience) ||
            minimumExperience < 0 ||
            (maximumExperience !== undefined &&
                (!Number.isFinite(maximumExperience) || maximumExperience < minimumExperience)) ||
            cleanedSkills.length === 0 ||
            !Number.isFinite(salaryAmount) ||
            salaryAmount < 0 ||
            (requestedExpiry && Number.isNaN(requestedExpiry.getTime()))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a title, description, valid openings and experience range, at least one skill, and a valid non-negative salary."
            });
        }

        const job = await JobPosting.create({
            recruiterId: req.user.id || req.user.userId,
            title: title.trim(),
            description: description.trim(),
            openingCount: openingTotal,
            experienceDeman: {
                min: minimumExperience,
                ...(maximumExperience !== undefined ? { max: maximumExperience } : {})
            },
            skillDemand: cleanedSkills,
            ...(jobType ? { jobType } : {}),
            workMode,
            location: {
                city: typeof jobLocation.city === "string" ? jobLocation.city.trim() : "",
                state: typeof jobLocation.state === "string" ? jobLocation.state.trim() : "",
                country: typeof jobLocation.country === "string" && jobLocation.country.trim()
                    ? jobLocation.country.trim()
                    : "India"
            },
            amount: {
                salary: salaryAmount,
                ...(salary.currency ? { currency: salary.currency } : {}),
                ...(salary.period ? { period: salary.period } : {})
            },
            ...(status ? { status } : {}),
            ...(requestedExpiry ? { expiresAt: requestedExpiry } : {})
        });

        return res.status(201).json({
            success: true,
            message: "Job posting created successfully.",
            data: job
        });
    } catch (error) {
        console.error("Error creating job posting:", error);
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error while creating job posting."
        });
    }
});

router.post("/profile", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({ success: false, message: "A recruiter profile is required." });
        }

        const userId = req.user.id || req.user.userId;
        const {
            orgName,
            contactPerson,
            website,
            companySize,
            industry,
            location
        } = req.body;
        const recruiterContact = contactPerson && typeof contactPerson === "object" && !Array.isArray(contactPerson)
            ? contactPerson
            : {};
        const recruiterLocation = location && typeof location === "object" && !Array.isArray(location)
            ? location
            : {};

        const industries = Array.isArray(industry)
            ? industry
            : typeof industry === "string"
                ? industry.split(",")
                : [];
        const cleanedIndustries = industries
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean);

        if (
            typeof orgName !== "string" ||
            !orgName.trim() ||
            typeof recruiterContact.designation !== "string" ||
            !recruiterContact.designation.trim() ||
            cleanedIndustries.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Organization name, designation, and at least one industry are required."
            });
        }

        const profile = await RecruiterProfile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    userId,
                    orgName: orgName.trim(),
                    contactPerson: {
                        designation: recruiterContact.designation.trim(),
                        ...(typeof recruiterContact.phone === "string" && recruiterContact.phone.trim()
                            ? { phone: recruiterContact.phone.trim() }
                            : {})
                    },
                    website: typeof website === "string" ? website.trim() : "",
                    companySize: companySize || null,
                    industry: cleanedIndustries,
                    location: {
                        headquarters: typeof recruiterLocation.headquarters === "string"
                            ? recruiterLocation.headquarters.trim()
                            : "",
                        country: typeof recruiterLocation.country === "string" && recruiterLocation.country.trim()
                            ? recruiterLocation.country.trim()
                            : "India"
                    }
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Recruiter profile saved successfully.",
            data: profile
        });
    } catch (error) {
        console.error("Error saving recruiter profile:", error);
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error while saving recruiter profile."
        });
    }
});

export default router;
