const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: [true, 'Please add a task name']
    },
    description: String,
    status: {
        type: String,
        enum: ['New', 'Pending', 'In Progress', 'Completed'],
        default: 'New'
    },
    label: String,
    effort: String,
    comments: Array,
    createdAt: {
        type: Date,
        default: Date.now
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true
    }
});

module.exports = mongoose.model('Tasks', taskSchema);