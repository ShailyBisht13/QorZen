import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token){
            const error = new Error("Not authorized, no token provided");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user){
            const error = new Error("Not authorized, user no longer exists");
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next()
    } catch (error) {
        if(!error.statusCode) error.statusCode = 401;
        next(error);
    }
}

export const authorize = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            const error = new Error(`Role '${req.user.role}' is not permitted to perform this action`)
            error.statusCode = 403
            throw error;
        }
        next()
    }
}

// Like protect, but doesn't block the request if there's no token —
// it just leaves req.user undefined for logged-out visitors.
// Used on routes that behave differently for logged-in vs anonymous users,
// like viewing a course preview.
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(); // no token? that's fine, just continue as a guest
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next(); // invalid token? treat as guest instead of blocking
  }
};