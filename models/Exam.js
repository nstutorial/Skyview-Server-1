const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true,
        enum: ['Term-I', 'Term-II', 'Half Yearly', 'Annual']
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    session: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
