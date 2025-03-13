import express from 'express';
import { registerUser, LoginUser, userCredits, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

// Define routes correctly
userRouter.post('/register', registerUser); // For user registration
userRouter.post('/login', LoginUser);      // For user login
userRouter.get('/credits',userAuth, userCredits);  //For Credits
userRouter.get('/razor-pay',userAuth, paymentRazorpay);  //For Payments
userRouter.post('/verify-razor', verifyRazorpay);

export default userRouter;

//http://localhost:4000/api/user/register  ==>registerUser
//http://localhost:4000/api/user/login  ==>LoginUser