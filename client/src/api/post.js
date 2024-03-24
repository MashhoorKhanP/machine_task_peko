import Api from "../services/axios";
import errorHandle from "../middleware/errorHandler";
import postRoutes from "../services/endpoints/postEndPoints";

export const allBlogs = async () => {
  try {
    const response = await Api.get(postRoutes.allBlogs);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const findBlog = async (postId) => {
  try {
    const response = await Api.get(`${postRoutes.findBlog}/${postId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const addBlog = async (userId, blogData) => {
  try {
    console.log('blogData', blogData)
    const response = await Api.post(`${postRoutes.addBlog}/${userId}`, blogData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const updateBlog = async (postId, updatedBlogData) => {
  try {
    const response = await Api.patch(`${postRoutes.updateBlog}/${postId}`, updatedBlogData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const addLike = async (postId, userId) => {
  try {
    const response = await Api.patch(`${postRoutes.updateLike}?postId=${postId}&userId=${userId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const undoLike = async (postId, userId) => {
  try {
    const response = await Api.patch(`${postRoutes.undoLike}?postId=${postId}&userId=${userId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const undoDisLike = async (postId, userId) => {
  try {
    const response = await Api.patch(`${postRoutes.undoDislike}?postId=${postId}&userId=${userId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const addDislike = async (postId, userId) => {
  try {
    const response = await Api.patch(`${postRoutes.updateDislike}?postId=${postId}&userId=${userId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const addComment = async (userId, uName, postId, commentData) => {
  try {
    const response = await Api.patch(`${postRoutes.addComment}?userId=${userId}&uName=${uName}&postId=${postId}`, commentData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const deleteComment = async (commentId, postId) => {
  try {
    const response = await Api.delete(`${postRoutes.deleteComment}?commentId=${commentId}&postId=${postId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const addReport = async (userId, uName, postId, reportData) => {
  try {
    const response = await Api.patch(`${postRoutes.addReport}?userId=${userId}&uName=${uName}&postId=${postId}`, reportData);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const myBlogs = async (userId) => {
  try {
    const response = await Api.get(`${postRoutes.findMyBlogs}/${userId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}

export const deleteMyBlog = async (postId) => {
  try {
    const response = await Api.delete(`${postRoutes.deleteBlog}/${postId}`);
    return response;
  } catch (error) {
    return errorHandle(error);
  }
}