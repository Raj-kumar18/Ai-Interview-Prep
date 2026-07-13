import { interviewReportModel } from "../models/interviewReport.models.js";
import { PDFParse } from "pdf-parse";
import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";


export async function generateInterviewController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF file is required"
            });
        }

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }

        // FIX: correct class name (was pdfParse.PDFParse -> undefined variable)
        const parser = new PDFParse({ data: req.file.buffer });
        const parsed = await parser.getText();
        await parser.destroy(); // always free memory after parsing
        const resumeText = parsed.text;

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from the uploaded PDF"
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText, // FIX: was resumeContent.text, but resumeContent was already a string
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport
        });
    } catch (error) {
        console.error("generateInterviewController error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while generating the interview report"
        });
    }
}




export async function getInterviewByIdController(req, res) {
    const { interviewId } = req.params

    if (!interviewId) {
        return res.status(400).json({ success: false, message: "Interview Id is required" })
    }

    const interviewReport = await interviewReportModel.findById(interviewId);
    if (!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        })
    }

    res.status(200).json({
        success: true,
        message: "Interview report fetched successfully",
        data: interviewReport
    })
}



export async function getAllInterviewReport(req, res) {
    const interviews = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v,-technicalQuestions -behavioralQuestions -skillGaps -preprationPlans");
    res.status(200).json({
        success: true,
        message: "Interviews fetched successfully",
        data: interviews
    });
}



export async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId);
    if (!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}