import mongoose from "mongoose";
const Schema = mongoose.Schema;
import {User} from "./user.model";
import { JobPosting } from "./jobPosting.model";

const JobApplication = new Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: JobPosting,
        required: true,
        index: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Submitted", "Reviewing", "Shortlisted", "Interviewing", "Offered", "Rejected"],
        default: "Submitted",
        index: true
    },
},
{timestamps: true},
);

const Application = mongoose.model("Application", JobApplication);

export {Application};