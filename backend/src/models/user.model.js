import {mongoose } from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, //John@gmail.com and john@gmail.com are treated as same.
        trim: true,
        index: true,
    }, 
    name: {
        type: String,
        unique: true,
        trim: true
    },
    refreshToken: {
        type: String,
        default: null
    }, 
    role: {
        type: String,
        enum: ["admin", "recruiter", "jobseeker"],
        // default: "jobseeker",
        required: true
    }, 
    authProvide: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    password: {
        type: String,
        required: function(){
            return this.authProvide === "local";
        },
        minlength: [6]
    }, 
    googleId: {
        type: String,
        sparse: true, //allows the empty or undefined entry also
        unique: true, //make sure no duplicate entry 
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    }
},
{timestamps: true},
);

const User = mongoose.model("User", userSchema);

export {User};