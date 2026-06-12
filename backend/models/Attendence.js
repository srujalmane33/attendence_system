import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true
    }
  },
  date: {
    type: String, 
    required: true
  },
  entryTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  exitTime: {
    type: Date,
    default: null 
  },
  status: {
    type: String,
    enum: ['In-Classroom', 'Left'],
    default: 'In-Classroom'
  }
});

// Enforces one log entry per student per day
attendanceSchema.index({ "student._id": 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);