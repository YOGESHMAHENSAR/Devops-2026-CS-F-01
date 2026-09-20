import mongoose from "mongoose";
import { User } from "./user.model";
const Schema = mongoose.Schema;

// we can do import {Schema} from "mongoose"
// or we can simply do const Schema = mongoose.Schema; without the mongoose.Schema();
//as this make the call to the Schema instance which break the further formation of the main schema.

const JobSeekerProfile = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        unique: true,
        index: true
    },
    // name: { // we have alreay taken it in the user.model.js
    //     type: String,
    //     trim: true,
    //     required: true,
    // },
    headline: { // this is for the 1 line description of the user.
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
        default: 0
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
        default: "Consultancy"
    },
    mode: {
        type: String,
        enum: ["Remote", "Hybrid", "Online"],
        default: "Remote"
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

const JobSeeker = mongoose.model("JobSeeker", JobSeekerProfile);

export {JobSeeker};