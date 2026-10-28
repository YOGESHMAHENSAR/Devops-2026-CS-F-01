
import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Application } from "../models/jobApplication.js";
import { JobPosting } from "../models/jobPosting.model.js";

const applicationsRouter = express.Router();

// Resolve the user ID from the JWT payload.
// Confirm your auth route's token payload matches one of these fields.
function getUserId(req) {
  return (
    req.user?.id ??
    req.user?._id ??
    req.user?.userId ??
    req.user?.sub
  );
}

// POST /api/applications
applicationsRouter.post("/", verifyToken, async (req, res) => {
  try {
    const seekerId = getUserId(req);
    const { jobId, resumeUrl } = req.body;

    if (!seekerId || !mongoose.isValidObjectId(seekerId)) {
      return res.status(401).json({
        message: "Your login session does not contain a valid user ID.",
      });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "A valid jobId is required." });
    }

    if (typeof resumeUrl !== "string" || !resumeUrl.trim()) {
      return res.status(400).json({
        message: "Please provide your resume URL.",
      });
    }

    let parsedResumeUrl;
    try {
      parsedResumeUrl = new URL(resumeUrl.trim());
    } catch {
      return res.status(400).json({
        message: "Please provide a valid resume URL.",
      });
    }

    if (!["https:", "http:"].includes(parsedResumeUrl.protocol)) {
      return res.status(400).json({
        message: "Resume URL must use HTTP or HTTPS.",
      });
    }

    // Only job seekers may submit applications.
    if (req.user?.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs.",
      });
    }

    const job = await JobPosting.findOne({
      _id: jobId,
      status: "Active",
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    });

    if (!job) {
      return res.status(404).json({
        message: "This job is unavailable or no longer accepting applications.",
      });
    }

    const existingApplication = await Application.findOne({
      jobId,
      seekerId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
        application: existingApplication,
      });
    }

    const application = await Application.create({
      jobId,
      seekerId,
      resumeUrl: parsedResumeUrl.href,
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    // Handles a duplicate-key error if a unique index is added later.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job.",
      });
    }

    console.error("Submit application error:", error);
    return res.status(500).json({
      message: "Failed to submit application.",
    });
  }
});

// GET /api/applications/my
applicationsRouter.get("/my", verifyToken, async (req, res) => {
  try {
    const seekerId = getUserId(req);

    if (!seekerId || !mongoose.isValidObjectId(seekerId)) {
      return res.status(401).json({
        message: "Your login session does not contain a valid user ID.",
      });
    }

    if (req.user?.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can view their applications.",
      });
    }

    const applications = await Application.find({ seekerId })
      .populate({
        path: "jobId",
        select: "title description location workMode jobType amount status",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ applications });
  } catch (error) {
    console.error("List applications error:", error);
    return res.status(500).json({
      message: "Failed to fetch your applications.",
    });
  }
});

export default applicationsRouter;
