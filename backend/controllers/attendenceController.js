import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js'; // Import your Cloudinary config

// @desc    Mark student entry time (State A)
// @route   POST /api/attendance/entry
// @access  Private (Student)
export const markEntry = async (req, res) => {
  try {
    const { image } = req.body; // Expecting base64 image string from the camera component
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // 1. Programmatic single-punch verification guard
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

    // Upload entry snap to Cloudinary if provided
    let entryPhotoUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: 'student_entries',
      });
      entryPhotoUrl = uploadRes.secure_url;
    }

    // 2. Create entry log utilizing the authenticated student details from Prisma
    const newEntry = await prisma.attendance.create({
      data: {
        date: today,
        entryTime: now,
        entryPhotoUrl, // Stores Cloudinary URL
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
    const { image } = req.body; // Expecting base64 image string from the camera component
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

    // Upload exit snap to Cloudinary if provided
    let exitPhotoUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: 'student_exits',
      });
      exitPhotoUrl = uploadRes.secure_url;
    }

    // Update fields using the specific document's unique ID to close out the session
    const updatedRecord = await prisma.attendance.update({
      where: { id: attendanceRecord.id },
      data: {
        exitTime: new Date(),
        exitPhotoUrl, // Stores Cloudinary URL
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