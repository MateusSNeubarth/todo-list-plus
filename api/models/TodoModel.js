import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
    {
        todoText: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        }
    }, { timestamps: true },
);

export default mongoose.model('Todo', TodoSchema);