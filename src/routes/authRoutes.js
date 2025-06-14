import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
}

router.post("/register", async(req, res) => {
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password should be at least 6 characters"});
        }

        if(username.length < 3) {
            return res.status(400).json({message: "Username should be at least 3 characters"});
        }

        //check user already exists
        // const exisitngUser = await User.findOne({$or: [{email}, {username}]});
        // if(exisitngUser) {
        //     return res.status(400).json({message: "User already exists"});
        // }

        //check email already exists
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        //check username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message: "Username already exists"});
        }

        //get random avatar
        //const randomAvatar = await axios.get("https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe");
        const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;

        const newUser = new User({
            username,
            email,
            password,
            profileImage,
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        return res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        //console.log("Error in register route", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        }

        //check user exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        //check password
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        //generate token
        const token = generateToken(user._id);
        
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.log("Error in login route", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

export default router;