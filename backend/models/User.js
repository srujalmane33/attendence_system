import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true // Ensures only documents containing this field are indexed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-assign custom student ID before saving
userSchema.pre('save', async function () {
  if (this.role === 'student') {
    // Only generate a studentId if they don't have one yet
    if (!this.studentId) {
      try {
        const currentYear = new Date().getFullYear();
        
        // Dynamically fetch model reference using 'this.constructor' to prevent compilation circular loops
        const lastStudent = await this.constructor
          .findOne({ role: 'student', studentId: { $regex: `^STU-${currentYear}` } })
          .sort({ createdAt: -1 });

        let sequenceNumber = 1;
        if (lastStudent && lastStudent.studentId) {
          // Breakdown "STU-2026-0004" -> pull out sequence "0004" -> convert to integer 4
          const lastSequence = parseInt(lastStudent.studentId.split('-')[2], 10);
          sequenceNumber = lastSequence + 1;
        }

        // Format with leading zeros (e.g., 0001, 0012)
        const paddedSequence = String(sequenceNumber).padStart(4, '0');
        this.studentId = `STU-${currentYear}-${paddedSequence}`;
      } catch (error) {
        throw new Error(`Failed to generate Student ID: ${error.message}`);
      }
    }
  } else {
    // 💡 CRITICAL FIX: If the user is an Admin, explicitly delete the studentId key
    // by setting it to undefined. This ensures Mongoose completely omits it from MongoDB,
    // allowing the "sparse: true" index to work perfectly without duplicate null key crashes!
    this.studentId = undefined;
  }
});

export default mongoose.model('User', userSchema);