import Api from "../services/axios";
import errorHandle from "../middleware/errorHandler";
import userRoutes from "../services/endpoints/userEndPoints";


export const signUp = async (userData) => {
  try {
    const response = await Api.post(userRoutes.signUp, userData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const login = async (loginData) => {
  try {
    const response = await Api.post(userRoutes.login, loginData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const logout = async () => {
  try {
    const response = await Api.post(userRoutes.logout);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
};