import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

// Models import
import SupportTicket from '../models/supportTicketModel';
import User from '../models/userModel';

// Types import
import { IUser } from '../models/userModel';

// Custom request interface with user property
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
export const createSupportTicket = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { subject, category, description, priority } = req.body;

        if (!subject || !description) {
            res.status(400);
            throw new Error('Subject and description are required');
        }

        const ticket = await SupportTicket.create({
            user: req.user!._id,
            subject,
            category: category || 'other',
            description,
            priority: priority || 'medium',
            status: 'open',
            messages: [],
        });

        const populatedTicket = await SupportTicket.findById(ticket._id)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo');

        res.status(201).json(populatedTicket);
    },
);

// @desc    Get all tickets for logged-in user
// @route   GET /api/support/my-tickets
// @access  Private
export const getMyTickets = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { status, category } = req.query;

        const filter: any = { user: req.user!._id };

        if (status) {
            filter.status = status;
        }

        if (category) {
            filter.category = category;
        }

        const tickets = await SupportTicket.find(filter)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .sort({ createdAt: -1 });

        res.status(200).json(tickets);
    },
);

// @desc    Get single ticket by ID
// @route   GET /api/support/:id
// @access  Private
export const getTicketById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const ticket = await SupportTicket.findById(req.params.id)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .populate('messages.sender', 'name email username photo');

        if (!ticket) {
            res.status(404);
            throw new Error('Ticket not found');
        }

        // Check if user is the ticket owner or admin
        if (
            ticket.user.toString() !== req.user!._id.toString() &&
            !req.user!.admin
        ) {
            res.status(403);
            throw new Error('Not authorized to view this ticket');
        }

        res.status(200).json(ticket);
    },
);

// @desc    Add a message to a ticket
// @route   POST /api/support/:id/messages
// @access  Private
export const addMessageToTicket = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { message } = req.body;

        if (!message) {
            res.status(400);
            throw new Error('Message is required');
        }

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            res.status(404);
            throw new Error('Ticket not found');
        }

        // Check if user is the ticket owner or admin
        if (
            ticket.user.toString() !== req.user!._id.toString() &&
            !req.user!.admin
        ) {
            res.status(403);
            throw new Error('Not authorized to reply to this ticket');
        }

        ticket.messages.push({
            sender: req.user!._id,
            senderType: req.user!.admin ? 'admin' : 'user',
            message,
            timestamp: new Date(),
        } as any);

        // If ticket was closed and user replies, reopen it
        if (ticket.status === 'closed' && !req.user!.admin) {
            ticket.status = 'open';
        }

        await ticket.save();

        const updatedTicket = await SupportTicket.findById(ticket._id)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .populate('messages.sender', 'name email username photo');

        res.status(200).json(updatedTicket);
    },
);

// @desc    Update ticket status or priority
// @route   PATCH /api/support/:id
// @access  Private
export const updateTicket = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { status, priority } = req.body;

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            res.status(404);
            throw new Error('Ticket not found');
        }

        // Check if user is the ticket owner or admin
        if (
            ticket.user.toString() !== req.user!._id.toString() &&
            !req.user!.admin
        ) {
            res.status(403);
            throw new Error('Not authorized to update this ticket');
        }

        if (status) {
            ticket.status = status;
        }

        if (priority && req.user!.admin) {
            ticket.priority = priority;
        }

        await ticket.save();

        const updatedTicket = await SupportTicket.findById(ticket._id)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .populate('messages.sender', 'name email username photo');

        res.status(200).json(updatedTicket);
    },
);

// @desc    Delete a ticket
// @route   DELETE /api/support/:id
// @access  Private
export const deleteTicket = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            res.status(404);
            throw new Error('Ticket not found');
        }

        // Only ticket owner or admin can delete
        if (
            ticket.user.toString() !== req.user!._id.toString() &&
            !req.user!.admin
        ) {
            res.status(403);
            throw new Error('Not authorized to delete this ticket');
        }

        await SupportTicket.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Ticket deleted successfully' });
    },
);

// ============= ADMIN ONLY ENDPOINTS =============

// @desc    Get all tickets (admin only)
// @route   GET /api/support/admin/all
// @access  Private/Admin
export const getAllTickets = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { status, category, priority } = req.query;

        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        if (category) {
            filter.category = category;
        }

        if (priority) {
            filter.priority = priority;
        }

        const tickets = await SupportTicket.find(filter)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .sort({ createdAt: -1 });

        res.status(200).json(tickets);
    },
);

// @desc    Assign ticket to admin
// @route   PATCH /api/support/admin/:id/assign
// @access  Private/Admin
export const assignTicket = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { adminId } = req.body;

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            res.status(404);
            throw new Error('Ticket not found');
        }

        // Verify adminId is actually an admin
        if (adminId) {
            const admin = await User.findById(adminId);
            if (!admin || !admin.admin) {
                res.status(400);
                throw new Error('Invalid admin ID');
            }
            ticket.assignedTo = adminId;
        } else {
            ticket.assignedTo = undefined;
        }

        // Update status to in-progress if assigned
        if (adminId && ticket.status === 'open') {
            ticket.status = 'in-progress';
        }

        await ticket.save();

        const updatedTicket = await SupportTicket.findById(ticket._id)
            .populate('user', 'name email username photo')
            .populate('assignedTo', 'name email username photo')
            .populate('messages.sender', 'name email username photo');

        res.status(200).json(updatedTicket);
    },
);

// @desc    Get support statistics (admin only)
// @route   GET /api/support/admin/stats
// @access  Private/Admin
export const getSupportStats = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const totalTickets = await SupportTicket.countDocuments();
        const openTickets = await SupportTicket.countDocuments({
            status: 'open',
        });
        const inProgressTickets = await SupportTicket.countDocuments({
            status: 'in-progress',
        });
        const resolvedTickets = await SupportTicket.countDocuments({
            status: 'resolved',
        });
        const closedTickets = await SupportTicket.countDocuments({
            status: 'closed',
        });

        const highPriorityTickets = await SupportTicket.countDocuments({
            priority: 'high',
            status: { $in: ['open', 'in-progress'] },
        });

        const categoryStats = await SupportTicket.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            highPriorityTickets,
            categoryStats,
        });
    },
);
