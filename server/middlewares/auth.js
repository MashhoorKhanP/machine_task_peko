import Admin from "../model/Admin.cjs";
import User from "../model/User.cjs";
import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.userJWT;
  if (!token) {
    return res.status(401).json({ message: "Access Denied!,Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;

    const role = req?.user?.role;
    if (!role) {
      return res.status(401).json({ message: "Access Denied!,Role not found in token" })
    }
    const id = req?.user?.userId;
    const user = await User.findOne({ where: { id } });
    if (role !== 'user') {
      return res.status(401).json({ message: "No Access to this content!, Invalid role" });
    }
    if (user.isBlocked) {
      return res.status(401).json({ message: "Your account has been blocked!, Please contact support." })
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access, Please try again later." });
  }
}

export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.adminJWT;
  if (!token) {
    return res.status(401).json({ message: "Access Denied!,Please login again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;

    const role = req?.user?.role;
    if (!role) {
      return res.status(401).json({ message: "Access Denied!,Role not found in token" })
    }

    if (role !== 'admin') {
      return res.status(401).json({ message: "No Access to this content!, Invalid role" });
    }
    const id = req?.user?.userId;
    const admin = await Admin.findOne({ where: { id } });
    if (admin) next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access, Please try again later." });
  }
}