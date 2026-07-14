import mongoose from "mongoose";


const experienceSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "Role is required"]
    },
    company: {
        type: String,
        required: [true, "Company is required"]
    },
    duration: {
        type: String,
        required: [true, "duration is required"]
    },
    bullets: [{ type: String, required: [true, "bullet point is required"] }]
}, { _id: false })



const educationSchema = new mongoose.Schema({
    degree: { type: String, required: [true, "degree is required"] },
    institution: { type: String, required: [true, "institution is required"] },
    duration: { type: String, required: [true, "duration is required"] },
    details: { type: String } // optional, e.g. CGPA, honors
}, { _id: false });

const skillGroupSchema = new mongoose.Schema({
    category: { type: String, required: [true, "skill category is required"] }, // e.g. "Languages", "Frameworks"
    items: [{ type: String, required: [true, "skill item is required"] }]
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: { type: String, required: [true, "project title is required"] },
    description: { type: String, required: [true, "project description is required"] },
    techStack: [{ type: String }],
    link: { type: String } // optional (github/live link)
}, { _id: false });

const personalInfoSchema = new mongoose.Schema({
    fullName: { type: String, required: [true, "fullName is required"] },
    email: { type: String, required: [true, "email is required"] },
    phone: { type: String },
    location: { type: String },
    linkedin: { type: String },
    portfolio: { type: String }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"]
    },
    source: {
        type: String,
        enum: ["scratch", "upload"], // scratch = AI-generated from form, upload = AI-improved from existing PDF
        required: [true, "source is required"]
    },
    targetRole: { type: String }, // optional, job title this resume is tailored for
    personalInfo: { type: personalInfoSchema, required: true },
    summary: { type: String, required: [true, "summary is required"] },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillGroupSchema],
    projects: [projectSchema],
    certifications: [{ type: String }]
}, {
    timestamps: true
});

export const resumeModel = mongoose.model("Resume", resumeSchema);