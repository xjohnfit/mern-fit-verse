import { Request, Response } from 'express';
import Report from '../models/reportModel';
import User from '../models/userModel';
import Post from '../models/postModel';

// @desc    Report a user or content
// @route   POST /api/reports
// @access  Private
export const createReport = async (req: Request, res: Response) => {
    try {
        const { reportedUserId, reportedPostId, reason, description } =
            req.body;
        const reporterId = req.user._id;

        // Validate that user isn't reporting themselves
        if (reportedUserId && reportedUserId === reporterId.toString()) {
            res.status(400);
            throw new Error('You cannot report yourself');
        }

        // Check if reported user exists
        const reportedUser = await User.findById(reportedUserId);
        if (!reportedUser) {
            res.status(404);
            throw new Error('Reported user not found');
        }

        // Check if user already reported this (prevent spam)
        // Only prevent duplicate reports if there's an active (pending or reviewed) report
        const existingReport = await Report.findOne({
            reporter: reporterId,
            reportedUser: reportedUserId,
            status: { $in: ['pending', 'reviewed'] },
        });

        if (existingReport) {
            res.status(400);
            throw new Error(
                'You have already reported this user. We are reviewing it.',
            );
        }

        const report = await Report.create({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reportedPost: reportedPostId,
            reason,
            description,
            status: 'pending',
            createdAt: new Date(),
        });

        const populatedReport = await Report.findById(report._id)
            .populate('reporter', 'name username photo')
            .populate('reportedUser', 'name username photo');

        res.status(201).json({
            message:
                'Report submitted successfully. We will review it within 24 hours.',
            report: populatedReport,
        });
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error submitting report',
        });
    }
};

// @desc    Get all reports (admin only)
// @route   GET /api/reports
// @access  Private/Admin
export const getAllReports = async (req: Request, res: Response) => {
    try {
        const { status, reason, page = 1, limit = 20 } = req.query;

        const query: any = {};
        if (status) query.status = status;
        if (reason) query.reason = reason;

        const reports = await Report.find(query)
            .populate('reporter', 'name username photo')
            .populate('reportedUser', 'name username photo email')
            .populate('reportedPost')
            .populate('reviewedBy', 'name username')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Report.countDocuments(query);

        res.json({
            reports,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalReports: total,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'Error fetching reports',
        });
    }
};

// @desc    Get a single report by ID
// @route   GET /api/reports/:reportId
// @access  Private/Admin
export const getReportById = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findById(reportId)
            .populate('reporter', 'name username photo email')
            .populate('reportedUser', 'name username photo email')
            .populate('reportedPost')
            .populate('reviewedBy', 'name username');

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        res.json(report);
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error fetching report',
        });
    }
};

// @desc    Update report status (admin only)
// @route   PUT /api/reports/:reportId
// @access  Private/Admin
export const updateReportStatus = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;
        const { status, actionTaken, adminNotes } = req.body;

        const report = await Report.findById(reportId);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        report.status = status || report.status;
        report.actionTaken = actionTaken;
        report.adminNotes = adminNotes;
        report.reviewedBy = req.user._id;
        report.reviewedAt = new Date();

        await report.save();

        // Take action based on decision
        if (actionTaken === 'suspend' || actionTaken === 'ban') {
            await User.findByIdAndUpdate(report.reportedUser, {
                isActive: actionTaken !== 'ban',
                isBanned: actionTaken === 'ban',
                suspendedUntil:
                    actionTaken === 'suspend'
                        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        : null,
            });
        }

        if (actionTaken === 'content_removed' && report.reportedPost) {
            await Post.findByIdAndDelete(report.reportedPost);
        }

        const updatedReport = await Report.findById(reportId)
            .populate('reporter', 'name username photo')
            .populate('reportedUser', 'name username photo')
            .populate('reviewedBy', 'name username');

        res.json({
            message: 'Report updated successfully',
            report: updatedReport,
        });
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error updating report',
        });
    }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:reportId
// @access  Private/Admin
export const deleteReport = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;

        const report = await Report.findById(reportId);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        await report.deleteOne();

        res.json({ message: 'Report deleted successfully' });
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error deleting report',
        });
    }
};

// @desc    Get reports submitted by current user
// @route   GET /api/reports/my-reports
// @access  Private
export const getMyReports = async (req: Request, res: Response) => {
    try {
        const reports = await Report.find({ reporter: req.user._id })
            .populate('reportedUser', 'name username photo')
            .populate('reportedPost')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'Error fetching your reports',
        });
    }
};
