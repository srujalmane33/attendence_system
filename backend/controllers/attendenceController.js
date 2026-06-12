import prisma from '../config/db.js';

// @desc    Mark student entry time (State A)
// @route   POST /api/attendance/entry
// @access  Private (Student)
export const markEntry = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 1. Programmatic single-punch verification guard
    // Check if this student already has ANY attendance log recorded for today
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        date: today,
        student: {
          is: { id: req.user.id }
        }
      }
    });

    if (existingRecord) {
      return res.status(400).json({ 
        message: 'You have already logged your attendance entry for today!' 
      });
    }

    // 2. Create entry log utilizing the authenticated student details from Prisma
    // This will trigger MongoDB's native compound unique index ("student.id" + "date") if hit concurrently
    const newEntry = await prisma.attendance.create({
      data: {
        date: today,
        entryTime: now, // Captures high-precision, live clock timestamps
        status: 'In-Classroom',
        student: {
          id: req.user.id,
          name: req.user.name,
          studentId: req.user.studentId
        }
      }
    });

    res.status(201).json({ message: 'Entry time logged successfully', data: newEntry });
  } catch (error) {
    console.error("MARK ENTRY ERROR:", error);

    // 💡 THE PRISMA + MONGODB UNIQUE INDEX INTERCEPTOR:
    // - P2002: Prisma's native unique constraint violation code
    // - 11000: MongoDB's raw duplicate key collection index code
    const isDuplicate = 
      error.code === 'P2002' || 
      error.message?.includes('P2002') ||
      error.message?.includes('11000') ||
      error.message?.includes('duplicate key');

    if (isDuplicate) {
      return res.status(400).json({ 
        message: 'You have already marked your entry for today.' 
      });
    }

    res.status(500).json({ message: 'Failed to record entry', error: error.message });
  }
};

// @desc    Mark student exit time (State B)
// @route   PUT /api/attendance/exit
// @access  Private (Student)
export const markExit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Locate today's active classroom record for the logged-in student
    const attendanceRecord = await prisma.attendance.findFirst({
      where: {
        student: {
          is: { id: req.user.id }
        },
        date: today,
        status: 'In-Classroom'
      }
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        message: 'No active entry record found for today, or exit already marked.'
      });
    }

    // Update fields using the specific document's unique ID to close out the session
    const updatedRecord = await prisma.attendance.update({
      where: { id: attendanceRecord.id },
      data: {
        exitTime: new Date(),
        status: 'Left'
      }
    });

    res.json({
      message: 'Exit time logged successfully',
      data: updatedRecord
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record exit', error: error.message });
  }
};

// @desc    Get logged-in user's personal attendance histories
// @route   GET /api/attendance/my-logs
// @access  Private (Student)
export const getMyAttendanceLogs = async (req, res) => {
  try {
    // Query database using Prisma's structural filtering matching the active user ID
    const userLogs = await prisma.attendance.findMany({
      where: {
        student: {
          is: { id: req.user.id }
        }
      },
      orderBy: [
        { date: 'desc' },
        { entryTime: 'desc' }
      ]
    });

    // Send the array back to our Redux store frontend
    res.status(200).json(userLogs);
  } catch (error) {
    res.status(500).json({ 
      message: 'Database failed to retrieve your personal attendance records.', 
      error: error.message 
    });
  }
};

// @desc    Get all student attendance records
// @route   GET /api/attendance/admin/all
// @access  Private (Admin Only)
export const getAllAttendance = async (req, res) => {
  try {
    // Fetch all logs from the database, sorted newest first by date and entryTime
    const logs = await prisma.attendance.findMany({
      orderBy: [
        { date: 'desc' },
        { entryTime: 'desc' }
      ]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
};