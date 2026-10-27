import { Router } from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middlewares/verifyToken.js";
import { JobPosting } from "../models/jobPosting.model.js";
import { RecruiterProfile } from "../models/recuiter.model.js";
import { jobSeeker } from "../models/jobseeker.models.js";
import { Application } from "../models/jobApplication.js";
import { User } from "../models/user.model.js";

const router = Router();

router.use(verifyToken);

router.get("/", async (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({ success: false, message: "Only job seekers can browse job postings." });
    }

    try {
        const filters = {
            status: "Active",
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gte: new Date() } }
            ]
        };
        const keyword = typeof req.query.q === "string" ? req.query.q.trim() : "";
        const terms = keyword.split(/\s+/).filter(Boolean).map((term) => (
            new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        ));

        if (terms.length) {
            filters.$and = terms.map((term) => ({
                $or: [
                    { title: term },
                    { description: term },
                    { skillDemand: term },
                    { "location.city": term },
                    { "location.state": term },
                    { "location.country": term }
                ]
            }));
        }

        for (const [queryKey, field] of [
            ["workMode", "workMode"],
            ["jobType", "jobType"],
            ["city", "location.city"]
        ]) {
            const value = typeof req.query[queryKey] === "string" ? req.query[queryKey].trim() : "";
            if (value) {
                filters[field] = new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
            }
        }

        const postings = await JobPosting.find(filters).sort({ createdAt: -1 }).lean();
        const recruiterIds = [...new Set(postings.map((job) => String(job.recruiterId)))];
        const [profiles, users] = await Promise.all([
            RecruiterProfile.find({ userId: { $in: recruiterIds } }).select("userId orgName").lean(),
            User.find({ _id: { $in: recruiterIds } }).select("name").lean()
        ]);
        const organizationByRecruiter = new Map(
            profiles.map((profile) => [String(profile.userId), profile.orgName])
        );
        const recruiterNameById = new Map(users.map((user) => [String(user._id), user.name]));

        return res.status(200).json({
            success: true,
            data: postings.map((job) => ({
                ...job,
                company: organizationByRecruiter.get(String(job.recruiterId)) ||
                    recruiterNameById.get(String(job.recruiterId)) ||
                    "Organization"
            }))
        });
    } catch (error) {
        console.error("Error searching job postings:", error);
        return res.status(500).json({ success: false, message: "Unable to load job postings." });
    }
});

router.post("/:jobId/applications", async (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({ success: false, message: "Only job seekers can apply to jobs." });
    }

    try {
        if (!mongoose.isValidObjectId(req.params.jobId)) {
            return res.status(400).json({ success: false, message: "Invalid job posting." });
        }

        const [job, seekerProfile] = await Promise.all([
            JobPosting.findOne({
                _id: req.params.jobId,
                status: "Active",
                $or: [
                    { expiresAt: { $exists: false } },
                    { expiresAt: null },
                    { expiresAt: { $gte: new Date() } }
                ]
            }),
            jobSeeker.findOne({ userId: req.user.id || req.user.userId }).select("resumeUrl")
        ]);

        if (!job) {
            return res.status(404).json({ success: false, message: "This job is no longer available." });
        }
        if (!seekerProfile?.resumeUrl) {
            return res.status(400).json({
                success: false,
                message: "Add a resume URL to your job seeker profile before applying."
            });
        }

        const application = await Application.create({
            jobId: job._id,
            seekerId: req.user.id || req.user.userId,
            resumeUrl: seekerProfile.resumeUrl
        });

        return res.status(201).json({
            success: true,
            message: "Your application was submitted.",
            data: application
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "You have already applied to this job." });
        }
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ success: false, message: error.message });
        }

        console.error("Error submitting job application:", error);
        return res.status(500).json({ success: false, message: "Unable to submit your application." });
    }
});

router.get("/applications/mine", async (req, res) => {
    if (req.user.role !== "jobseeker") {
        return res.status(403).json({ success: false, message: "Only job seekers can view their applications." });
    }

    try {
        const applications = await Application.find({
            seekerId: req.user.id || req.user.userId
        }).select("jobId status").lean();

        return res.status(200).json({ success: true, data: applications });
    } catch (error) {
        console.error("Error loading job seeker applications:", error);
        return res.status(500).json({ success: false, message: "Unable to load your applications." });
    }
});

export default router;
