import express from 'express';
import {userSignup, userLogin} from "../controllers/userControllers";

const router = express.Router();

router.route('/signup').post(userSignup);
router.route('/login').post(userLogin);


export default router;