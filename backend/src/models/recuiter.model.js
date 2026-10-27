import mongoose from "mongoose";
import { User } from "./user.model.js";

const RecruiterProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        unique: true,
        index: true
    },
    orgName: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        // name: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        }
    },
    website: {
        type: String,
        trim: true,
    },
    companySize: {
        type: String,
        enum: ["1-10", "11-50", "50-200", "201-500", "500+"],
    },
    industry: {
        type: [String],
        required: true,
        default: undefined,
        set: (items) => items.map((item) => item.trim()),
    },
    location: {
        headquarters: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            default: "India",
            trim: true,
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

const RecruiterProfile = mongoose.model("RecruiterProfile", RecruiterProfileSchema);

export {RecruiterProfile};