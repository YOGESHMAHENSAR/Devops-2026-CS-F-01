import { Router } from "express";
const router = Router();
// import User from "../models/user.model";
import {verifyToken} from "../middlewares/verifyToken.js";
import {jobSeeker} from "../models/jobseeker.models.js";

router.post("/profile", verifyToken, async (req, res)=>{
    try{
        const userId = req.user._id || req.user.id;        
        const {headline,phoneNumber,experience,skills,resumeUrl,
            industry,jobType,mode,country, state, city, amount, currency, duration} = req.body;
            
        const formattedIndustry = Array.isArray(industry) //CONVERSION OF THE INDUSTRY INTO ARRAY
            ? industry
            : typeof industry === "string" && industry.trim()
            ? industry.split(",").map((i) => i.trim())
            : [];

        const cleanedSkills = Array.isArray(skills)
            ? skills.map((s) => s.trim()).filter(Boolean)
            : [];

        if(!headline || !phoneNumber || experience === undefined || cleanedSkills.length === 0 || 
            !resumeUrl || formattedIndustry.length === 0 || !city || !amount){
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields (experience, skills, industry, city, or salary amount)."
                })
        }

        const profile = await jobSeeker.findOneAndUpdate(
            {userId: userId},
            {
                $set: {
                    userId,
                    headline,
                    phone: Number(phoneNumber),
                    experience: Number(experience),
                    skills: cleanedSkills,
                    resumeUrl,
                    industry,
                    jobType: jobType,
                    mode: mode,
                    location: {
                        city: city.trim(),
                        state: state.trim(),
                        country: country.trim()
                    },
                    expectedSalary: {
                        amount: Number(amount),
                        currency: currency || "INR",
                        period: duration
                    }
                }
            },
            {
                new: true,           // Return the updated document
                upsert: true,        // Create if the account of the user doesn't exist
                runValidators: true  // Enforce schema rules that we have used via formation of models.(min: 0, enums, required)
            }
        );

        return res.status(200).json({
            success: true,
            message: "Job seeker profile saved successfully.",
            data: profile
        });
    }
    catch(error){
        console.error("Error saving job seeker profile:", error);

        // to handle the mongo error of the validation.
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, error: error.message });
        }
        //for error from the server.
        return res.status(500).json({
            success: false,
            message: "Internal server error while saving profile."
        });
    }
})

export default router;