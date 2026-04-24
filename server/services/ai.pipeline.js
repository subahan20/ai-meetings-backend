import Meeting from '../models/meeting.js';
import Research from '../models/research.js';
import Report from '../models/report.js';
import axios from 'axios';
import {
  researchAttendee,
  researchCompany,
  analyzeGoals,
  generateStructuredReport,
  generateAudio as generateAudioService
} from './openai.service.js';

const sendToN8n = async (meeting, reportDoc) => {
  if (!process.env.N8N_WEBHOOK_URL) {
    console.log("n8n Webhook URL not set. Skipping automation.");
    return;
  }

  try {
    console.log("Sending report data to n8n automation...");
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      meetingId: meeting._id,
      attendeeName: meeting.attendeeName,
      attendeeEmail: meeting.attendeeEmail,
      company: meeting.company,
      meetingTime: meeting.meetingTime,
      reportText: reportDoc.reportText,
      audioUrl: reportDoc.audioUrl,
      timestamp: new Date()
    });
    console.log("Successfully triggered n8n automation.");
  } catch (error) {
    console.error("Failed to trigger n8n automation:", error.message);
  }
};

const combineData = async (attendeeResearch, companyResearch, meetingGoals) => {
  const combined = `
Combined Research & Analysis
==========================

--- Attendee Research ---
${attendeeResearch}

--- Company Research ---
${companyResearch}

--- Meeting Goals ---
${meetingGoals}
  `.trim();
  return combined;
};

const generateReport = async (combinedData) => {
  console.log("Generating structured meeting report via Groq...");
  const report = await generateStructuredReport(combinedData);
  return report;
};

const generateAudio = async (reportText) => {
  return await generateAudioService(reportText);
};

const processMeeting = async (meetingId) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      throw new Error(`Meeting not found for id: ${meetingId}`);
    }

    const attendeeResearch = await researchAttendee(meeting);
    const companyResearch = await researchCompany(meeting);
    const meetingGoals = await analyzeGoals(meeting);

    const combinedData = await combineData(
      attendeeResearch,
      companyResearch,
      meetingGoals
    );

    const reportText = await generateReport(combinedData);
    const audioUrl = await generateAudio(reportText);

    const researchDoc = await Research.create({
      meetingId: meeting._id,
      attendeeResearch,
      companyResearch,
      meetingGoals,
      combinedData,
    });

    const reportDoc = await Report.create({
      meetingId: meeting._id,
      reportText,
      audioUrl,
    });

    // Trigger n8n Automation (Optional)
    await sendToN8n(meeting, reportDoc);

    return {
      success: true,
      meetingId: meeting._id,
      research: researchDoc,
      report: reportDoc,
    };
  } catch (error) {
    throw new Error(`AI Pipeline failed: ${error.message}`);
  }
};

export {
  processMeeting,
  researchAttendee,
  researchCompany,
  analyzeGoals,
  combineData,
  generateReport,
  generateAudio,
};
