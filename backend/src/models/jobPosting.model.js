import mongoose from "mongoose";
const Schema = mongoose.Schema;
import {User} from "./user.model";

const JobPostingSchema = new Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    openingCount: {
        type: Number,
        default: 1,
        min: 1
    },
    experienceDeman: {
        min: {
            type: Number,
            required: true,
            min: 0
        },
        max: {
            type: Number, min: 0
        }
    },
    skillDemand: {
        type: [String],
        required: true,
        set: (skills) => skills.map((skill) => skill.trim().toLowerCase())
    },
    jobType: {
        type: String,
        enum: ["Consultancy", "Contract", "Advisory", "Part-time", "Full-time", "Internship"],
        default: "Full-time"
    },
    workMode: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site"],
        required: true
    },
    location: {
        city: { 
            type: String, 
            trim: true 
        },
        state: { 
            type: String, 
            trim: true 
        },
        country: { 
            type: String, 
            default: "India", 
            trim: true 
        }
    },
    amount: {
        salary: {
            type: Number,
            required: true,
        },
        currency: { 
            type: String, 
            default: "INR" 
        },
        period: {
            type: String,
            enum: ["Hourly", "Monthly", "Yearly", "Project-based"],
            default: "Monthly"
        },
    },
    status: {
        type: String,
        enum: ["Draft", "Active", "Paused", "Closed"],
        default: "Active",
        index: true
        },
    expiresAt: {
        type: Date
        }
},
{timestamps: true},
);

const JobPosting = mongoose.model("JobPosting", JobPostingSchema);

export {JobPosting};
