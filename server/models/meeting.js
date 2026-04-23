import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    attendeeName: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true,
    },
    attendeeEmail: {
      type: String,
      required: [true, 'Attendee email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    meetingTime: {
      type: Date,
      required: [true, 'Meeting time is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'proceed', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt automatically
  }
);

// Create the model
const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
