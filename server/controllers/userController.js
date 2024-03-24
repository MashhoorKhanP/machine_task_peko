import User from "../model/User.cjs"
import { comparePassword, generateHash } from "../utils/bcryptPassword.js";
import { generateToken } from "../utils/generateToken.js";

/** Get All Users */
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error, Please try again!' });
  }
}

/** User Sign Up */
export const postSignUp = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    const userExists = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists!"
      });
    } else {
      const hashedPassword = await generateHash(password);
      //Insert into table
      await User.create({
        name,
        email,
        mobile,
        role,
        password: hashedPassword
      });
    }
    res.status(200).json({ message: 'User Registration successful!',data:req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** User Login */
export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    let token;
    if (user) {
      if (user.isBlocked) {
        return res.status(400).json({
          message: "You have been blocked by admin!"
        })
      }
      const passwordMatch = await comparePassword(password, user.password);
      if (passwordMatch) {
        const userId = user.id;
        if (userId) token = await generateToken(userId, 'user');
        if (token) {
          res.cookie('userJWT', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000
          });

          const userDetails = { id: user.id, name: user.name, email: user.email, role:user.role, mobile: user.mobile, profileImage: user.profileImage }
          return res.status(200).json({
            message: 'Logged in successfully!',
            data: userDetails,
            token
          });
        }
      } else {
        return res.status(400).json({
          message: 'Invalid email or password!',
        });
      }
    } else {
      return res.status(400).json({
        message: 'Invalid email or password!',
        token
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** User Logout */
export const postLogout = (req, res) => {
  try {
    res.cookie('userJWT', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(400).json(error.message);
  }
}
