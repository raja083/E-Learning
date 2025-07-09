import jwt from "jsonwebtoken"

const isLoggedIn = async (req,res,next) =>{
    try {
        //get the token from browser
        const token = req.cookies.token; 

        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false
            })
        }
        //match the token using the secret key
        const decode = await jwt.verify(token, process.env. TOKEN_SECRET);  //If successful, decode will be an object containing the data you signed in the token (like user ID, email, etc.).
        if(!decode){
             return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }

        req.id = decode.userId; //set the id of req from the cookie
        next();

    } catch (error) {
        console.log("Error in isLoggedIn middleware",error);
    }
}

export default isLoggedIn;