import User from "../models/user.js";

// Middleware to clerk if user is authenticated
// export const protect = async (req, res, next) => {
//     const {userId} = req.auth();
//     if(!userId) {
//         res.json({success: false, message: "not authenticated!"})
//     }else{
//         const user = await User.findById(userId);
//         req.user = user;
//         next()
//     }
// }

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};