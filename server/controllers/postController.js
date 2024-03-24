import Post from "../model/Post.cjs";
import User from "../model/User.cjs"
import { v4 as uuidv4 } from 'uuid';

/** Get All Blog Posts */
export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.findAll();
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error, Please try again!' });
  }
}

/** Get A Blog */
export const getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json(post);
    }
    res.status(200).json(post);
  } catch (error) {

  }
}

/** Get My Blog Posts */
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const post = await Post.findAll({ where: { userId } });
    if (!post) {
      return res.status(400).json({ message: "Posts not found, Please try again!" });
    }
    res.status(200).json({ message: 'My Blogs fetched successfully!', data: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Add Blog Post */
export const postAddPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description, image, category, } = req.body;
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(400).json({ message: "User not found, Please try again." });
    }

    await Post.create({
      title,
      description,
      category,
      image,
      uName: user.name,
      userId,
      role: user.role,
    })
    res.status(200).json({ message: 'Posted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Update Blog Post */
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, description, image } = req.body;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }

    await post.update({
      title,
      description,
      image,
    })
    res.status(200).json({ message: 'Updated post successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Update Blog Like */
export const updateLike = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    await post.increment('likes', { by: 1 });
    const updatedPost = await post.update({
      likedBy: [...post.likedBy, userId]
    });
    res.status(200).json({ message: 'Liked post successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

export const updateUndoLike = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    await post.decrement('likes', { by: 1 });
    const updatedLikedBy = post.likedBy.filter(id => id !== userId);

    const updatedPost = await post.update({
      likedBy: updatedLikedBy
    });
    res.status(200).json({ message: 'UnLiked post successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Update Blog DisLike */
export const updateDisLike = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    await post.increment('dislikes', { by: 1 });
    const updatedPost = await post.update({
      dislikedBy: [...post.dislikedBy, userId]
    });
    res.status(200).json({ message: 'Liked post successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

export const updateUndoDislike = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    console.log(req.query, 'undo');
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    await post.decrement('dislikes', { by: 1 });
    const updatedDislikedBy = post.dislikedBy.filter(id => id !== userId);

    const updatedPost = await post.update({
      likedBy: updatedDislikedBy
    });
    res.status(200).json({ message: 'Undo Dislike post successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Add Blog Comments */
export const addComments = async (req, res) => {
  try {
    const { userId, uName, postId } = req.query;
    const comment = req.body.comment;
    const commentId = uuidv4();
    const comments = {
      commentId,
      userId,
      uName,
      comment
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    const updatedPost = await post.update({
      comments: [...post.comments, comments]
    });
    res.status(200).json({ message: 'Comment added successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Report Blog */
export const addReport = async (req, res) => {
  try {
    const { userId, uName, postId } = req.query;
    const reason = req.body.reason;
    const reportId = uuidv4();
    const reportings = {
      reportId,
      userId,
      uName,
      reason
    }
    const post = await Post.findByPk(postId);
    const user = await User.findByPk(post.userId);
    await user.increment('reports', { by: 1 });
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    const updatedPost = await post.update({
      reportings: [...post.reportings, reportings]
    });
    res.status(200).json({ message: 'Reported post successfully!', data: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error, Please try again!' });
  }
}

/** Delete Blog Comments */
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }

    const updatedComments = post.comments.filter(comment => comment.commentId !== commentId);

    const updatedPost = await post.update({ comments: updatedComments });

    res.status(200).json({ message: 'Comment deleted successfully!', data: updatedPost });
  } catch (error) {
    // Handle errors
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



/** Delete Blog */
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log('postId', postId);
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found, Please try again!" });
    }
    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {

  }
}