import { createMeeting, getAllMeetings } from '../services/meeting.service.js';
import { processMeeting } from '../services/ai.pipeline.js';
import User from '../models/user.js';

const createMeetingHandler = async (req, res) => {
  try {
    const { attendeeName, attendeeEmail, company, meetingTime } = req.body;

    if (!attendeeName || !attendeeEmail || !meetingTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: attendeeName, attendeeEmail, meetingTime',
      });
    }

    // Automatically find or create the User based on the attendee email
    let user = await User.findOne({ email: attendeeEmail.toLowerCase() });
    
    if (!user) {
      user = await User.create({
        name: attendeeName,
        email: attendeeEmail,
      });
    }

    // Create a brand new meeting object every single time, linked to this user
    const meeting = await createMeeting({
      userId: user._id,
      attendeeName,
      attendeeEmail,
      company,
      meetingTime,
    });

    // TRIGGER AI PIPELINE ASYNCHRONOUSLY
    processMeeting(meeting._id).catch((err) => {
      console.error('Failed to process meeting pipeline:', err.message);
    });

    // Fetch all meetings to return as an array so the client can see them stacking up
    // Removed because POST should typically return the created resource
    // const allMeetings = await getAllMeetings();

    return res.status(201).json({
      success: true,
      message: 'Meeting created successfully. AI pipeline started.',
      data: meeting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetingsHandler = async (req, res) => {
  try {
    const allMeetings = await getAllMeetings();

    return res.status(200).json({
      success: true,
      message: 'Meetings fetched successfully',
      data: allMeetings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createMeetingHandler, getMeetingsHandler };
