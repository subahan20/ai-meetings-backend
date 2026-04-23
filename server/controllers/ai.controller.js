import { processMeeting } from '../services/ai.pipeline.js';

const processMeetingHandler = async (req, res) => {
  try {
    const { meetingId } = req.body;

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: 'meetingId is required in request body',
      });
    }

    const result = await processMeeting(meetingId);

    return res.status(200).json({
      success: true,
      message: 'AI pipeline completed successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { processMeetingHandler };
