import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {OAuth2Client} from "google-auth-library"; // for google login library of backend.
import {Router} from "express"
import {User} from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log("google client info: ", googleClient);

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
        // console.log(req.body);
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
        //gen10 is the thing which help us to make the 2 differnet hash form of the same password.
        //beacuse it help us to add the random "noise" between the data sent that is real password!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // console.log(hashedPassword);
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

//logout is handled via the jsx only as we only wanna remove the local storage material.

//google signup and login both as this will act for both the things.

router.post("/google", async (req, res) =>{
    try{
        // console.log("hello to all");
        // console.log("req.body: ", req.body);
        const { credential, role} = req.body; //credentials === client id from the google 
        // console.log("role is: ", role);
        if(!credential){
            return res.status(400).json({message: "Missing Google Credential!"});
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

// /        console.log("ticket is: ",ticket);

        const payload = ticket.getPayload();
        // console.log("google payload: ", payload);

        if(!payload.email_verified){
            return res.status(400).json({message: "Google account mail is not verified!"});
        }

        let user = await User.findOne({email: payload.email.toLowerCase()});
        // console.log("user find info: ", user);

        if(!user){ //it means that the user doesn't exist then we consider it as signup
            if(!role || !['jobseeker', 'recruiter'].includes(role)){
                return res.status(400).json({message: "Role is required to get procees further!"});
            }
            user = await User.create({
                name: payload.name,
                email: payload.email,
                authProvide: 'google',
                googleId: payload.sub,
                role,
            })
        }
        else if(role && user.role !== role){
            // console.log("user info is :", user.role);
            return res.status(403).json({
                message: `This Email is already regirsted with ${user.role}, Please switch the role and then try again..`
            });
        }
        const token = generateToken(user);

        res.json({
            token, 
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                refreshToken: token,
                email: user.email
            }
        })
    }
    catch(e){
        return res.status(401).json({message: "Invalid Google token.", error: e.message});
    }
})

export default router;
