import Report from '../models/report.js';
import Meeting from '../models/meeting.js';
import { processMeeting } from '../services/ai.pipeline.js';

/**
 * Controller to handle report retrieval and generation
 */
export const getLatestReportHandler = async (req, res) => {
  try {
    // 1. Find the most recent meeting created in the system
    const latestMeeting = await Meeting.findOne().sort({ createdAt: -1 });
    
    if (!latestMeeting) {
      return res.status(404).json({
        success: false,
        message: 'No meetings found. Please create a meeting first.',
      });
    }

    // 2. Check if a report already exists for this specific meeting
    let report = await Report.findOne({ meetingId: latestMeeting._id });

    // 3. If no report exists (maybe the async pipeline failed or is still running), 
    // we can trigger it now or wait. Since the user clicked "Generate", let's ensure it's generated.
    if (!report) {
      console.log(`No report found for meeting ${latestMeeting._id}. Triggering AI pipeline...`);
      const result = await processMeeting(latestMeeting._id);
      report = result.report;
    }

    // 4. Return the report data
    return res.status(200).json({
      success: true,
      message: 'Latest report fetched successfully',
      data: {
        report: report.reportText,
        audioUrl: report.audioUrl,
        meetingId: latestMeeting._id,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getLatestReportHandler:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
