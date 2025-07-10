import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";


//register controller
export const register = async(req,res)=>{
    try {
        const {name,email,password,role} = req.body;

        //check if any field is absent
        if(!name || !email || !password || !role){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check if the email is already registered
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists with this email"
            })
        }

        //if the user is not found in the database, create a new one.

        //encrypt the password
        const hashedPassword = await bcrypt.hash(password,10);
        
        const createdUser=await User.create({
            name,
            email,
            password:hashedPassword,
            role
        })

        return res.status(201).json({
            success:true,
            message:"User registered successfully"
        })
        
    } catch (error) {
        console.log("Error in register controller",error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}

//login controller

export const login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        //check if any field is empty
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Both email and password are mandatory."
            })
        }
        //check if the user with the given id exists
        const user = await User.findOne({email});

        
        if(!user){
            return res.status(400).json({
                success:false,
                message:"email or password incorrect"
            })
        }

        //check if the password is correct by comparing with the value in database
        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"email or password incorrect"
            })
        }
        //login user if the password is correct 
        //generate access token
        await generateToken(res,user,`Welcome back ${user.name}`)

    } catch (error) {
        console.log("Error in login controller",error);
        return res.status(500).json({
            success:false,
            message:"Log in failed"
        })
    }
}

//logout user
export const logout = async (req,res) =>{
    try {
        res.cookie("token","" , {maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        })
    }
}

//profile return 
export const getuserProfile = async(req,res)=>{
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }

        return res.status(200).json({
            success:true,
            user  //return the user
        })

    } catch (error) {
        console.log("Error in getuserProfile controller",error);
        return res.status(500).json({
            success:false,
            message:"Failed to load profile"
        })
    }
}


//update profile 
export const updateProfile = async (req,res) =>{
    try {
        const userId = req.id;
        const {name} = req.body; //get name from req.body
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            res.status(400).json({
                message:"User not found",
                success:"false"
            })
        }

        //to update profile photo we need to delete the previous one
        //extract publicId of the old image from the url if it exists 
        //for every image or video uploaded on cloudinary , it has a unique public id

        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];  //extract public id from the string of photo url
            deleteMediaFromCloudinary(publicId);
        }

        // now upload the new photo or(update)
        const cloudinaryResponse = await uploadMedia(profilePhoto.path);

        const photoUrl = cloudinaryResponse.secure_url;

        const updatedData = {name,photoUrl};

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData,{new:true}).select("-password")

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Peofile updated successfully"
        })

    } catch (error) {
        console.log("Error in updateProfile controller",error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}