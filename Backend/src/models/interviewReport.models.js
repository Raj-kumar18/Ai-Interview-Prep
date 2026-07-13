import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema({
    questions: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, { _id: false })


const behavioralQuestionSchema = new mongoose.Schema({
    questions: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, { _id: false })



const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "SkillGap is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, { _id: false })




const preprationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "day is required"]
    },
    focusArea: {
        type: String,
        required: [true, "focus area is required"]
    },
    tasks: [{
        type: [String],
        required: [true, "tasks is required"]
    }]
}, {
    _id: false
})



const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String,
        required: [true, "self description is required"]
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preprationPlan: [preprationPlanSchema],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    }
}, {
    timestamps: true
})



export const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)



