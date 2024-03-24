import bcrypt from 'bcrypt'

export const generateHash = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error)
  }
}

export const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.log(error)
  }
}