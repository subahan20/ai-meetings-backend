import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: [true, 'Meeting ID is required'],
    },
    reportText: {
      type: String,
      required: [true, 'Report text is required'],
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    emailContent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt automatically
  }
);

// Create the model
const Report = mongoose.model('Report', reportSchema);

export default Report;
