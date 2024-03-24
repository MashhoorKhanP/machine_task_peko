import jwt from "jsonwebtoken";

export const generateToken = async (userId, role) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      const token = jwt.sign({ userId, role }, jwtSecret, { expiresIn: '30d' });
      return token;
    }
  } catch (error) {
    console.log(error);
  }
}