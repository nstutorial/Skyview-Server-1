const mongoose = require('mongoose');

const examMarksSchema = new mongoose.Schema({
    written: {
        type: Number,
        min: 0,
        max: 80
    },
    oral: {
        type: Number,
        min: 0,
        max: 20
    }
});

const subjectMarksSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    pt1: examMarksSchema,
    hy: examMarksSchema,
    pt2: examMarksSchema,
    final: examMarksSchema
});

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    admissionNo: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    marks: [subjectMarksSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    rank:{
        type: Number}
}, {
    timestamps: true
});

// Compound index for unique student-year combination
marksSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

// Method to calculate total marks for an exam
marksSchema.methods.calculateExamTotal = function(examType) {
    let total = 0;
    this.marks.forEach(subject => {
        if (subject[examType]) {
            total += (subject[examType].written || 0) + (subject[examType].oral || 0);
        }
    });
    return total;
};

// Method to calculate percentage for an exam
marksSchema.methods.calculateExamPercentage = function(examType) {
    const total = this.calculateExamTotal(examType);
    const maxMarks = this.marks.length * 100; // 100 marks per subject
    return maxMarks > 0 ? (total / maxMarks) * 100 : 0;
};

// Method to calculate grade based on percentage
marksSchema.methods.calculateGrade = function(percentage) {
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 61) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 33) return 'D';
    return 'E';
};

// Method to get overall results
marksSchema.methods.getOverallResults = function() {
    const examTypes = ['pt1', 'hy', 'pt2', 'final'];
    let totalPercentage = 0;
    let validExams = 0;

    const results = {
        examWise: {},
        overall: {
            percentage: 0,
            grade: 'E',
            result: 'NEEDS IMPROVEMENT'
        }
    };

    examTypes.forEach(examType => {
        const percentage = this.calculateExamPercentage(examType);
        if (percentage > 0) {
            results.examWise[examType] = {
                total: this.calculateExamTotal(examType),
                percentage: percentage,
                grade: this.calculateGrade(percentage)
            };
            totalPercentage += percentage;
            validExams++;
        }
    });

    if (validExams > 0) {
        results.overall.percentage = totalPercentage / validExams;
        results.overall.grade = this.calculateGrade(results.overall.percentage);
        results.overall.result = results.overall.percentage >= 33 ? 'PASS' : 'NEEDS IMPROVEMENT';
    }

    return results;
};

module.exports = mongoose.model('Marks', marksSchema);
