import { useContext, useState, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { generateInterviewReport, getInterviewById, getAllInterviews, generateResumePdf } from "../services/interview.api.js";
import { useParams } from "react-router";
export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId, interviewReportId } = useParams()
    if (!context) {
        throw new Error("UseInterview must be used within an interviewProvider")
    }

    const { loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports } = context

    const generateReport = async ({ resumeFile, selfDescription, jobDescription }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setReport(response.data)
        } catch (error) {
            console.error("Error generating interview report:", error);
        }
        finally {
            setLoading(false)
        }
        return response.data
    }


    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewById(interviewId)
            setReport(response.data)
        } catch (error) {
            console.error("Error generating interview report:", error);
        }
        finally {
            setLoading(false)
        }
        return response.data
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviews()
            setReports(response.data)
        } catch (error) {
            console.error("Error generating interview report:", error);
        }
        finally {
            setLoading(false)
        }
        return response.data
    }


    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf(interviewReportId)
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
        else {
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, setReport, setReports, getReportById, getReports, generateReport, getResumePdf }
}