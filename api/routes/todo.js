import express from 'express';
import { createTodo, deleteTodo, getUserTodos } from '../controllers/todo.js';

const router = express.Router();

//Create Todo
router.post('/:user_id', createTodo);
//Delete Todo
router.delete('/:id', deleteTodo);
//Get User Todos
router.get('/:user_id', getUserTodos);

export default router;