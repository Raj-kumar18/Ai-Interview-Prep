import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import config from "../utils/config.js";
import { PDFParse } from "pdf-parse";
import puppeteer from "puppeteer";

// ---- EDITABLE: JSON schema jo Gemini se structured output ke roop mein chahiye ----
// NOTE: types hamesha LOWERCASE hone chahiye (object/string/array/number/integer),
// Gemini ka purana Type enum (OBJECT/STRING) standard JSON Schema nahi hai aur zod.fromJSONSchema() isse reject karta hai.
const interviewReportJsonSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
        },
        technicalQuestions: {
            type: "array",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them.",
            items: {
                type: "object",
                properties: {
                    // FIX: was "question" (singular), mongoose model field is "questions" (plural)
                    questions: { type: "string", description: "The technical question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["questions", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",
            items: {
                type: "object",
                properties: {
                    // FIX: was "question" (singular), mongoose model field is "questions" (plural)
                    questions: { type: "string", description: "The behavioral question that can be asked in the interview" },
                    intention: { type: "string", description: "The intention of interviewer behind asking this question" },
                    answer: { type: "string", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["questions", "intention", "answer"]
            }
        },
        skillGap: {
            type: "array",
            description: "List of skill gaps in the candidate's profile along with their severity.",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill which the candidate is lacking" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "The severity of this skill gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        // FIX: matches your mongoose field name "preprationPlan" (kept as-is for consistency with the model)
        preprationPlan: {
            type: "array",
            description: "A day-wise preparation plan for the candidate to follow in order to cover all the topics and skills required for the job description.",
            items: {
                type: "object",
                properties: {
                    day: { type: "integer", description: "The day number in the preparation plan, starting from 1" },
                    // FIX: was "focus", model field is "focusArea"
                    focusArea: { type: "string", description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of tasks to be done on this day"
                    }
                },
                required: ["day", "focusArea", "tasks"]
            }
        },
        title: {
            type: "string",
            description: "The title of the job for which the interview report is generated"
        }
    },
    // FIX: names now match the actual property keys above exactly
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preprationPlan", "title"]
};
// ---- END EDITABLE SCHEMA ----

// Zod schema JSON schema se auto-derive ho raha hai -> response validate karne ke liye
const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

// Gemini client -> API key config.js se aa rahi hai (never hardcode key yahan)
const client = new GoogleGenAI({
    apiKey: config.GOOGLE_API_KEY
});

/**
 * @param {object} params
 * @param {string} params.jobDescription
 * @param {string} params.resume
 * @param {string} params.selfDescription
 */
export async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
        throw new Error("jobDescription is required to generate an interview report");
    }
    if (!resume || typeof resume !== "string" || !resume.trim()) {
        throw new Error("resume text is required to generate an interview report");
    }
    if (!selfDescription || typeof selfDescription !== "string" || !selfDescription.trim()) {
        throw new Error("selfDescription is required to generate an interview report");
    }

    const prompt = `You are an expert technical interviewer and career coach. Your task is to analyze the Candidate Data against the provided Job Description and generate a comprehensive, highly-structured JSON interview report matching the schema.

### CANDIDATE DATA:
- Resume Content: ${resume}
- Candidate Self-Description: ${selfDescription}

### TARGET JOB DESCRIPTION:
- Role & Requirements: ${jobDescription}

### CRITICAL OUTPUT INSTRUCTIONS:
1. You MUST populate all schema fields. Do not leave any array empty.
2. For "preprationPlan": Based on the identified "skillGap" and required tech stack, create a realistic 5 to 7 day preparation plan. Every object inside the "preprationPlan" array MUST include a valid "day" (Integer), a clear "focusArea" string, and an array of specific actionable "tasks" (Strings).
3. DO NOT return an empty array [] for "preprationPlan". You must break down what the candidate needs to study day by day to clear the skill gaps.
4. Output must be strictly valid JSON without any markdown formatting wrappers outside the schema.`;

    const interaction = await client.interactions.create({
        model: "gemini-3.1-flash-lite", // EDITABLE: model name (e.g. gemini-2.5-flash agar 3.5 access na ho)
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            // FIX: raw JSON schema jaana chahiye Gemini ko, zod-derived object nahi
            schema: interviewReportJsonSchema
        }
    });

    let rawJson;
    try {
        rawJson = JSON.parse(interaction.output_text);
    } catch (err) {
        throw new Error("Gemini se valid JSON nahi mila: " + err.message);
    }

    // Zod se validate + parse -> agar schema match nahi karta to yahin throw hoga
    return interviewReportSchema.parse(rawJson);
}




export async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: {
            top: "2mm",
            bottom: "2mm",
            left: "2mm",
            right: "2mm",
        },
    });

    await browser.close();

    return pdf;
}


export async function generateResumePdf({
    selfDescription,
    jobDescription,
    resume,
}) {
    const resumePdfJsonSchema = {
        type: "object",
        properties: {
            html: {
                type: "string",
                description:
                    "The HTML conntent of the resume which can be convereted to PDF using any library like puppeteer",
            },
        },
        required: ["html"],
    };

    const resumePdfSchema = z.fromJSONSchema(resumePdfJsonSchema);

    const prompt = `
You are a senior Resume Writer, UX Designer, ATS Resume Expert and HR Recruiter.

Your task is to generate a PREMIUM one-page HTML resume for the candidate.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

========================
OBJECTIVE
========================

Create an ATS-friendly yet visually stunning resume that looks like it was designed by a professional resume designer.

The HTML should be COMPLETE and directly renderable by Puppeteer.

Return ONLY valid JSON:

{
    "html":"<complete html here>"
}

========================
DESIGN REQUIREMENTS
========================

• Use modern HTML5 + CSS only.
• No external CSS frameworks.
• No JavaScript.
• No CDN.
• Everything must be inside one HTML file.
• The layout must print perfectly on A4.
• Maximum 2 pages.
• Professional typography.
• Premium spacing.
• Consistent alignment.
• Excellent visual hierarchy.

========================
COLOR PALETTE
========================

Primary:
#2563EB

Secondary:
#0F172A

Accent:
#06B6D4

Background:
#F8FAFC

Cards:
#FFFFFF

Borders:
#E2E8F0

Text:
#1E293B

Muted Text:
#64748B

========================
LAYOUT
========================

Create a premium two-column layout.

LEFT COLUMN

• Profile Photo Placeholder
• Name
• Job Title
• Contact
• Email
• GitHub
• LinkedIn
• Portfolio
• Skills
• Soft Skills
• Languages
• Certifications

RIGHT COLUMN

• Professional Summary
• Experience
• Projects
• Education
• Technical Skills
• Achievements
• Relevant Technologies
• Career Objective

========================
STYLE
========================

Use:

✔ Rounded cards

✔ Soft shadows

✔ Gradient header

✔ Modern badges

✔ Professional icons using Unicode

✔ Progress bars for skills

✔ Skill chips

✔ Clean section dividers

✔ Nice typography

✔ Plenty of whitespace

✔ Elegant borders

✔ Premium appearance similar to resumes from Canva, Novoresume, Enhancv and FlowCV.

========================
ATS REQUIREMENTS
========================

The resume MUST remain ATS-friendly.

Do NOT use tables for the main layout.

Use semantic HTML.

Use proper headings:

<h1>
<h2>
<h3>

Use lists where appropriate.

Include keywords from the Job Description naturally.

========================
CONTENT REQUIREMENTS
========================

Rewrite the resume professionally.

Improve grammar.

Improve wording.

Quantify achievements where possible.

Do NOT invent fake companies.

Do NOT mention AI.

Make the resume sound human-written.

Tailor every section according to the Job Description.

Highlight matching technologies.

Remove irrelevant information.

========================
PRINT REQUIREMENTS
========================

Must fit beautifully on A4 PDF.

Avoid unnecessary page breaks.

Use page-break-inside: avoid where necessary.

========================
OUTPUT
========================

Return ONLY JSON.

Do not wrap in markdown.

Do not explain anything.

Only return:

{
    "html":"..."
}
`;

    try {
        const interaction = await client.interactions.create({
            model: "gemini-3.1-flash-lite",
            input: prompt,
            response_format: {
                type: "text",
                mime_type: "application/json",

                // ✅ IMPORTANT
                schema: resumePdfJsonSchema,
            },
        });


        if (!interaction.output_text) {
            throw new Error("Gemini returned empty output.");
        }

        const rawJson = JSON.parse(interaction.output_text);

        const parsed = resumePdfSchema.parse(rawJson);

        if (!parsed.html) {
            throw new Error("HTML field missing from Gemini response.");
        }

        return await generatePdfFromHtml(parsed.html);
    } catch (err) {
        console.error("Generate Resume PDF Error:");
        console.error(err);

        throw err;
    }
}