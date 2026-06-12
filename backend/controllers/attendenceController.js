import prisma from '../config/db.js';

// @desc    Mark student entry time (State A)
// @route   POST /api/attendance/entry
// @access  Private (Student)
export const markEntry = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Create entry log utilizing the authenticated user details from Prisma (via protect middleware)
    const newEntry = await prisma.attendance.create({
      data: {
        date: today,
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
    // Intercept Prisma's unique constraint violation error code (replaces Mongoose 11000)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'You have already marked your entry for today.' });
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

    // Locate today's active classroom record for the logged-in student using Prisma's structural filtering
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