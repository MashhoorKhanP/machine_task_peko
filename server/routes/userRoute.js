import express from 'express';
import { getAllUsers, postLogin, postLogout, postSignUp } from '../controllers/userController.js';
import { addComments, addReport, deleteComment, deletePost, getAllPosts, getMyPosts, getPost, postAddPost, updateDisLike, updateLike, updatePost, updateUndoDislike, updateUndoLike } from '../controllers/postController.js';
import { verifyUser } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/all-users', (req, res) => getAllUsers(req, res));

userRouter.post('/sign-up', (req, res) => postSignUp(req, res));
userRouter.post('/login', (req, res) => postLogin(req, res));
userRouter.post('/logout', (req, res) => postLogout(req, res));

userRouter.get('/all-posts', (req, res) => getAllPosts(req, res));
userRouter.get('/my-posts/:userId', verifyUser, (req, res) => getMyPosts(req, res));
userRouter.get('/post/:postId', verifyUser, (req, res) => getPost(req, res));
userRouter.post('/add-post/:userId', verifyUser, (req, res) => postAddPost(req, res));
userRouter.patch('/update-post/:postId', verifyUser, (req, res) => updatePost(req, res));
userRouter.delete('/delete-post/:postId', verifyUser, (req, res) => deletePost(req, res));

userRouter.patch('/update-like', verifyUser, (req, res) => updateLike(req, res));
userRouter.patch('/update-dislike', verifyUser, (req, res) => updateDisLike(req, res));
userRouter.patch('/undo-like', verifyUser, (req, res) => updateUndoLike(req, res));
userRouter.patch('/undo-dislike', verifyUser, (req, res) => updateUndoDislike(req, res));

userRouter.patch('/add-comment', verifyUser, (req, res) => addComments(req, res));
userRouter.delete('/delete-comment', verifyUser, (req, res) => deleteComment(req, res));

userRouter.patch('/add-report', verifyUser, (req, res) => addReport(req, res));





export default userRouter;