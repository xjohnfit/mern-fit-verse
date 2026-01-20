import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { admin } from '../middlewares/adminMiddleware';

import {
    createSupportTicket,
    getMyTickets,
    getTicketById,
    addMessageToTicket,
    updateTicket,
    deleteTicket,
    getAllTickets,
    assignTicket,
    getSupportStats,
} from '../controllers/supportController';

const router = express.Router();

// User routes
router.post('/', protect, createSupportTicket); // Create new ticket
router.get('/my-tickets', protect, getMyTickets); // Get all tickets for logged-in user
router.get('/:id', protect, getTicketById); // Get single ticket
router.post('/:id/messages', protect, addMessageToTicket); // Add message to ticket
router.patch('/:id', protect, updateTicket); // Update ticket status
router.delete('/:id', protect, deleteTicket); // Delete ticket

// Admin routes
router.get('/admin/all', protect, admin, getAllTickets); // Admin: Get all tickets
router.patch('/admin/:id/assign', protect, admin, assignTicket); // Admin: Assign ticket
router.get('/admin/stats', protect, admin, getSupportStats); // Admin: Get statistics

export default router;
