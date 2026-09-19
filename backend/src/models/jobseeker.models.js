import mongoose from "mongoose";
import { User } from "./user.model";
const Schema = mongoose.Schema();

const JobSeekerProfile = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        unique: true,
        index: true
    },
    // name: {
    //     type: String,
    //     trim: true,
    //     required: true,
    // },
    headline: {
        type: String,
        trim: true
    },
    phone: {
        type: Number,
    },
    experience: {
        type: Number,
        required: true,
        min: 0,
        dafault: 0
    },
    skills: {
        type: [String],
        default: [],
        required: true,
        set: (skills) => skills.map(skill => skill.trim().toLowerCase()),
        index: true
    },
    resumeUrl: {
        type: String,
        default: "",
    },
    industry:{
        type: [String],
        required: true,
        default: [],
        set: (industry) => industry.map(ind => ind.trim())
    },
    jobType: {
        type: String,
        enum: ["Consultancy", "Contract", "Advisory", "Part-time", "Full-time"],
        default: ["Consultancy"]
    },
    mode: {
        type: String,
        enum: ["Remote", "Hybrid", "Online"],
        default: ["Remote"]
    },
    location: {
        city: {
            type:String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            default: "India",
            trim: true
        }
    },
    expectedSalary: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "INR"
        },
        period: {
            type: String,
            enum: ["Hourly", "Monthly", "Yearly", "project-based"],
            default: "Yearly"
        }
    }
},
{timestamps: true}
);

const jobSeeker = mongoose.model("jobSeeker", JobSeekerProfile);

export {jobSeeker};