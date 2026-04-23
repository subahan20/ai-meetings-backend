import Meeting from '../models/meeting.js';

const createMeeting = async (data) => {
  const meeting = await Meeting.create(data);
  return meeting;
};

const getAllMeetings = async () => {
  return await Meeting.find().sort({ createdAt: -1 });
};

export { createMeeting, getAllMeetings };
