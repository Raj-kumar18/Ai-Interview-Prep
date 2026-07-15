import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/ai",
    withCredentials: true,
});


export async function generateInterviewReport({ resumeFile, selfDescription, jobDescription }) {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;

}


export async function getInterviewById(interviewId) {
    const response = await api.get(`/report/${interviewId}`);
    return response.data;
}

export async function getAllInterviews() {
    const response = await api.get("/");
    console.log(response.data);
    return response.data;
}

export async function generateResumePdf(interviewReportId) {
    const response = await api.post(`/report/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    });

    return response.data
}