import Meeting from '../models/meeting.js';
import Research from '../models/research.js';
import Report from '../models/report.js';
import {
  researchAttendee,
  researchCompany,
  analyzeGoals,
  generateStructuredReport,
  generateAudio as generateAudioOpenAI
} from './openai.service.js';

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
  console.log("Generating structured meeting report via OpenAI...");
  const report = await generateStructuredReport(combinedData);
  return report;
};

const generateAudio = async (reportText) => {
  console.log("Generating audio via OpenAI TTS...");
  const audioUrl = await generateAudioOpenAI(reportText);
  return audioUrl;
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
