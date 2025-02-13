const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const auth = require('../middleware/auth');

// Get marks by student ID
router.get('/:studentId', auth, async (req, res) => {
    try {
        const marks = await Marks.findOne({ studentId: req.params.studentId });
        if (!marks) {
            return res.status(404).json({ message: 'Marks not found' });
        }
        res.json(marks);
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get marks by class and section
router.get('/class/:className/:section', auth, async (req, res) => {
    try {
        const marks = await Marks.find({
            className: req.params.className,
            section: req.params.section
        }).populate({
            path: 'studentId',
            model: 'Student',
            select: 'name studentId fatherName'
        });
        
        //console.log(`Found ${marks.length} marks records for Class ${req.params.className} Section ${req.params.section}`);
        res.json(marks);
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new marks
router.post('/', auth, async (req, res) => {
    try {
        const { studentId, className, section, academicYear, marks, studentName, admissionNo, fatherName } = req.body;
        
        // Create new marks document
        const marksDoc = new Marks({
            studentId,
            className,
            section,
            academicYear,
            marks,
            studentName,
            admissionNo,
            fatherName
        });

        const savedMarks = await marksDoc.save();
       // console.log('Created new marks:', savedMarks);
        res.status(201).json(savedMarks);
    } catch (error) {
        console.error('Error creating marks:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update marks by student ID
router.put('/:studentId', auth, async (req, res) => {
    try {
        const { marks, rank } = req.body;
        
        // Find and update marks
        const updatedMarks = await Marks.findOneAndUpdate(
            { studentId: req.params.studentId },
            { $set: { marks, rank } },
            { new: true }
        );

        if (!updatedMarks) {
            return res.status(404).json({ message: 'Marks not found' });
        }

        //console.log('Updated marks for student:', updatedMarks.studentName);
        res.json(updatedMarks);
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(400).json({ message: error.message });
    }
});
// Update rank for a student
router.put('/rank/:studentId', auth, async (req, res) => {
    try {
        const { rank } = req.body;
        
        // Find and update marks using MongoDB _id
        const updatedMarks = await Marks.findByIdAndUpdate(
            req.params.studentId,
            { $set: { rank } },
            { new: true }
        );

        if (!updatedMarks) {
            return res.status(404).json({ message: 'Marks not found' });
        }

        //console.log('Updated ranks for student:', updatedMarks.studentName);
        res.json(updatedMarks);
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(400).json({ message: error.message });
    }
});
// Update rank for a student
router.patch('/:id/rank', auth, async (req, res) => {
    try {
        const { rank } = req.body;
        
        // Find and update only the rank field
        const updatedMarks = await Marks.findByIdAndUpdate(
            req.params.id,
            { $set: { rank } },
            { new: true }
        );

        if (!updatedMarks) {
            return res.status(404).json({ message: 'Marks not found' });
        }

       // console.log('Updated rank for student:', updatedMarks.studentName, 'New rank:', rank);
        res.json(updatedMarks);
    } catch (error) {
        console.error('Error updating rank:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete marks by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await Marks.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Marks not found' });
        }

        res.json({ success: true, message: 'Marks deleted successfully' });
    } catch (error) {
        console.error('Error deleting marks:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
