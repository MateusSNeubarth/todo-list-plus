import express from 'express';
import { updateUser, deleteUser, getUser, getUsers } from '../controllers/user.js';

const router = express.Router();

//Update
router.put('/:id', updateUser);
//Delete
router.delete('/:id', deleteUser);
//Get User
router.get('/:id', getUser);
//Get All Users
router.get('/', getUsers);

export default router;