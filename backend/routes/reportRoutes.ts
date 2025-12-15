import express from 'express';
import {
    createReport,
    getAllReports,
    getReportById,
    updateReportStatus,
    deleteReport,
    getMyReports,
} from '../controllers/reportController';
import { protect } from '../middlewares/authMiddleware';
import { admin } from '../middlewares/adminMiddleware';

const router = express.Router();

// User routes
router.post('/', protect, createReport);
router.get('/my-reports', protect, getMyReports);

// Admin routes
router.get('/', protect, admin, getAllReports);
router.get('/:reportId', protect, admin, getReportById);
router.put('/:reportId', protect, admin, updateReportStatus);
router.delete('/:reportId', protect, admin, deleteReport);

export default router;
