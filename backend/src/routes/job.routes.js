
import express from "express";
import mongoose from "mongoose";
import { JobPosting } from "../models/jobPosting.model.js";

const jobsRouter = express.Router();

// GET /api/jobs
// Search and filter active job postings.
jobsRouter.get("/", async (req, res) => {
  try {
    const {
      search,
      location,
      workMode,
      jobType,
      experience,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      status: "Active",
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (search?.trim()) {
      const term = search.trim();
      filter.$and = [
        {
          $or: [
            { title: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } },
            { skillDemand: { $regex: term, $options: "i" } },
          ],
        },
      ];
    }

    if (location?.trim()) {
      filter.$and ??= [];
      filter.$and.push({
        $or: [
          { "location.city": { $regex: location.trim(), $options: "i" } },
          { "location.state": { $regex: location.trim(), $options: "i" } },
          { "location.country": { $regex: location.trim(), $options: "i" } },
        ],
      });
    }

    if (workMode) filter.workMode = workMode;
    if (jobType) filter.jobType = jobType;

    if (experience !== undefined && experience !== "") {
      const years = Number(experience);

      if (!Number.isFinite(years) || years < 0) {
        return res.status(400).json({
          message: "Experience must be a non-negative number.",
        });
      }

      filter["experienceDeman.min"] = { $lte: years };
      filter.$and ??= [];
      filter.$and.push({
        $or: [
          { "experienceDeman.max": { $gte: years } },
          { "experienceDeman.max": { $exists: false } },
          { "experienceDeman.max": null },
        ],
      });
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const [jobs, total] = await Promise.all([
      JobPosting.find(filter)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .select("-__v")
        .lean(),
      JobPosting.countDocuments(filter),
    ]);

    return res.json({
      jobs,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("List jobs error:", error);
    return res.status(500).json({ message: "Failed to fetch jobs." });
  }
});

// GET /api/jobs/:id
jobsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job ID." });
    }

    const job = await JobPosting.findOne({
      _id: id,
      status: "Active",
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    }).select("-__v").lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    return res.json({ job });
  } catch (error) {
    console.error("Get job error:", error);
    return res.status(500).json({ message: "Failed to fetch job details." });
  }
});

export default jobsRouter;
