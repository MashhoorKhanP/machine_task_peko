import express from 'express';
import { postLogin, updateBlockUser } from '../controllers/adminController.js';
import { getAllUsers, postLogout } from '../controllers/userController.js';
import { verifyAdmin } from '../middlewares/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', (req, res) => postLogin(req, res))
adminRouter.post('/logout', (req, res) => postLogout(req, res));

adminRouter.get('/all-users', verifyAdmin, (req, res) => getAllUsers(req, res));
adminRouter.patch('/block-user/:userId', verifyAdmin, (req, res) => updateBlockUser(req, res));


export default adminRouter;
