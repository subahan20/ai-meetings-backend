import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: [true, 'Meeting ID is required'],
    },
    attendeeResearch: {
      type: String,
      trim: true,
    },
    companyResearch: {
      type: String,
      trim: true,
    },
    meetingGoals: {
      type: String,
      trim: true,
    },
    combinedData: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt automatically
  }
);

// Create the model
const Research = mongoose.model('Research', researchSchema);

export default Research;
