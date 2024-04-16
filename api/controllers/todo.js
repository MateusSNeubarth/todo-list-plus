import Todo from '../models/TodoModel.js';
import { createError } from '../utils/error.js';

//Create Todo
export const createTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({ todoText: req.body.todoText, user_id: req.params.user_id });
        if(todo) return next(createError(403, 'To-do already exists'));

        const newTodo = new Todo({
            todoText: req.body.todoText,
            user_id: req.params.user_id,
        });

        await newTodo.save();
        res.status(200).json(newTodo._doc);
    } catch (err) {
        next(err);
    }
};

//Delete Todo
export const deleteTodo = async (req, res, next) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');      
    } catch (err) {
        next(err);
    }
};

//Get User Todos
export const getUserTodos = async (req, res, next) => {
    try {
        const userTodos = await Todo.find({ user_id: req.params.user_id});
        res.status(200).json(userTodos);    
    } catch (err) {
        next(err);
    }
};