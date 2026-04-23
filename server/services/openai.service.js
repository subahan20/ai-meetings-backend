import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const researchAttendee = async (meeting) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a research assistant that provides concise professional profiles of people based on their name and email.',
      },
      {
        role: 'user',
        content: `Research this attendee for a business meeting:\nName: ${meeting.attendeeName}\nEmail: ${meeting.attendeeEmail}\n\nProvide a brief professional profile including likely role, industry, and background.`,
      },
    ],
  });

  return response.choices[0].message.content;
};

const researchCompany = async (meeting) => {
  const company = meeting.company || 'Unknown';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a business research assistant. Provide a concise company overview including what they do, products/services, and recent notable news.',
      },
      {
        role: 'user',
        content: `Research this company for a business meeting:\nCompany: ${company}\n\nProvide a brief overview, key products/services, and any recent notable news.`,
      },
    ],
  });

  return response.choices[0].message.content;
};

const analyzeGoals = async (meeting) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a meeting strategist. Based on meeting context, suggest clear meeting goals and desired outcomes.',
      },
      {
        role: 'user',
        content: `Suggest meeting goals and outcomes for the following meeting:\nAttendee: ${meeting.attendeeName}\nCompany: ${meeting.company || 'N/A'}\nMeeting Time: ${meeting.meetingTime}\n\nProvide 3-5 specific goals and expected outcomes.`,
      },
    ],
  });

  return response.choices[0].message.content;
};

const generateStructuredReport = async (combinedData) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert executive assistant. Generate a structured meeting prep report.',
      },
      {
        role: 'user',
        content: `Based on the following research data:\n\n${combinedData}\n\nGenerate a structured meeting prep report with exactly these sections:\n- Summary\n- Talking points\n- Risks\n- Strategy`,
      },
    ],
  });

  return response.choices[0].message.content;
};

const generateAudio = async (text) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  const fileName = `report_${Date.now()}.mp3`;
  
  // Ensure the public/audio directory exists
  const audioDir = path.join(__dirname, '../public/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filePath = path.join(audioDir, fileName);
  await fs.promises.writeFile(filePath, buffer);
  
  // Return the relative URL path for the client
  return `/audio/${fileName}`;
};

export { 
  researchAttendee, 
  researchCompany, 
  analyzeGoals, 
  generateStructuredReport, 
  generateAudio 
};
