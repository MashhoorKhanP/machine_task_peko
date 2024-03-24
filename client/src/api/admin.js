import errorHandle from "../middleware/errorHandler";
import Api from "../services/axios";
import adminRoutes from "../services/endpoints/adminEndPoints";

export const adminLogin = async (loginData) => {
  try {
    const response = await Api
      .post(adminRoutes.login, loginData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const adminLogout = async () => {
  try {
    const response = await Api.post(adminRoutes.logout);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
};

export const allUsers = async () => {
  try {
    const response = await Api.get(adminRoutes.allUsers);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const unBlockBlockUser = async (userId) => {
  try {
    const response = await Api.patch(`${adminRoutes.blockUnBlockUser}/${userId}`)
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}