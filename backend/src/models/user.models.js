import mongoose from "mongoose"
const Schema = mongoose.Schema();

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    skills: {
        type: [String],
        default: [],
        required: true,
        set: (skills) => skills.map(skill => skill.trim())
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
        country: {
            type: String,
            default: "India",
            trime: true
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
            default: "Monthly"
        }
    }
},
{timestamps: true}
);

const userModel = mongoose.model("userModel", userSchema);

export {userModel};