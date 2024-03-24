import Admin from "../model/Admin.cjs";
import User from "../model/User.cjs";
import { comparePassword } from "../utils/bcryptPassword.js";
import { generateToken } from "../utils/generateToken.js";

/** Admin Login */
export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ where: { email } });
    let token;
    if (user) {
      const passwordMatch = await comparePassword(password, user.password);
      if (passwordMatch) {
        const userId = user.id;
        if (userId) token = await generateToken(userId, 'admin');
        if (token) {
          res.cookie('adminJWT', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000
          });

          const userDetails = { id: user.id, name: user.name, email: user.email, profileImage: user.profileImage }
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

/** Admin Logout */
export const postLogout = async (req, res) => {
  try {
    res.cookie('adminJWT', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

/** Block/UnBlock User */
export const updateBlockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ where: { id: userId }, attributes: { exclude: ['password'] } });
    let message;
    if (user) {
      user.isBlocked = !user.isBlocked;
      user.isBlocked ? message = 'Blocked' : message = 'Unblocked';
      await user.save();
      return res.status(200).json({
        message: `${message} ${user.name} successfully!`,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });

  }
}