import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Router} from "express"
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

function generateToken(user) {
    return jwt.sign(
        { //this is the payload
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET, //only the server know this
        {
            expiresIn: '7d', //7days expiraition
        }
    )
}

//sign-in

router.post("/signup", async (req, res) =>{
    try{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({message: "All fields are required!"});
        }

        if(!['jobseeker', 'recruiter'].includes(role)){
            return res.status(400).json({message: "Please select the role first!"});
        }

        const existingUser = await User.findOne({email : email.toLowerCase()});
        if(existingUser){
            return res.status(400).json({message: "An account with this E-mail already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
        })

        const token = generateToken(newUser);

        res.status(201).json({
            token, user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                refreshToken: token,
                role: newUser.role,
            }
        })
    }
    catch(e){
        res.status(500).json({message: "Something went wrong during Signup", error: e.message});
    }
})

//login

router.post("/login", async (req, res) => {
    try{
        const {email, password, role} = req.body;

        if(!email || !password || !role){
            return res.status(400).json({message: "All fields are required!"});
        }
        
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user){ //checking for the user in the db or not, and useful for the unique email also!
            return res.status(401).json({message: "Invalid Email or Password!"});
        }

        if(user.role !== role){ //for checking for the role assigned is the actual role selected
            return res.status(403).json({
                message: `This email is registered as a ${user.role}. Please switch role and try again.`
            });
        }
        //comaprision of the original password with the hased password!
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Email or Password!"});
        }
        //all okay now generate the new fresh token for the user
        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                refreshToken: token,
                role: user.role,
            },
        });
    }
    catch(e){
        res.status(500).json({ message: 'Something went wrong during login', error: err.message});
    }
})

export {router};
