import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authorized token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
    
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token is not valid." });
  }
};

export default protectRoute;


// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const protectRoute = async (req, res, next) => {
//     try {
//         //const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//         const token = req.headers("Authorization").replace("Bearer ", "");
//         if (!token) {
//             return res.status(401).json({ message: "No authorized token, access denied" });
//         }
//         //verfy token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         //get user from token
//         const user = await User.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(401).json({ message: "Not authorized, user not found" });
//         }

//         req.user = user;
//         next();

//     } catch (error) {
//         console.error("Authentication Error", error.message);
//         res.status(401).json({ message: "Not authorized, token is not valid." });
//     }
// }

// export default protectRoute;

        //check if user is deleted  
        // if (user.isDeleted) {
        //     return res.status(401).json({ message: "Not authorized, user not found" });
        // }
        // //check if user is blocked
        // if (user.isBlocked) {
        //     return res.status(401).json({ message: "Not authorized, user is blocked" });
        // }
        // //check if user is admin
        // if (user.isAdmin) {
        //     return res.status(401).json({ message: "Not authorized, user is admin" });
        // }
        // //check if user is verified
        // if (!user.isVerified) {
        //     return res.status(401).json({ message: "Not authorized, user is not verified" });
        // }
        // //check if user is not verified
        // if (user.isNotVerified) {
        //     return res.status(401).json({ message: "Not authorized, user is not verified" });
        // }
        // //check if user is not active
        // if (!user.isActive) {
        //     return res.status(401).json({ message: "Not authorized, user is not active" });
        // }
        // //check if user is not active
        // if (user.isNotActive) {
        //     return res.status(401).json({ message: "Not authorized, user is not active" });
        // } 


            // let token;
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //     token = req.headers.authorization.split(" ")[1];
    // }
    // if (!token) {
    //     return res.status(401).json({ message: "Not authorized, no token" });
    // }
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = await User.findById(decoded.userId).select("-password");
    //     next();
    // } catch (error) {
    //     console.error("Error in protectRoute middleware", error);
    //     res.status(401).json({ message: "Not authorized, token failed" });
    // }