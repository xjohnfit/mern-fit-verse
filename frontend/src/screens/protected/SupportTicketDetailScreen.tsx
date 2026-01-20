import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    useGetTicketByIdQuery,
    useAddMessageToTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
} from '@/slices/supportApiSlice';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Send,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Trash2,
    User,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getPhotoUrl } from '@/lib/cacheBuster';

const SupportTicketDetailScreen = () => {
    const { id } = useParams<{ id: string; }>();
    const navigate = useNavigate();

    const [message, setMessage] = useState('');

    const { data: ticket, isLoading } = useGetTicketByIdQuery(id!);
    const [addMessage, { isLoading: isAddingMessage }] =
        useAddMessageToTicketMutation();
    const [updateTicket, { isLoading: isUpdating }] =
        useUpdateTicketMutation();
    const [deleteTicket, { isLoading: isDeleting }] =
        useDeleteTicketMutation();

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            await addMessage({ id: id!, data: { message } }).unwrap();
            setMessage('');
            toast.success('Message sent successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send message');
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateTicket({ id: id!, data: { status: newStatus as any } }).unwrap();
            toast.success('Ticket status updated');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteTicket(id!).unwrap();
            toast.success('Ticket deleted successfully');
            navigate('/support');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete ticket');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return <Clock className='w-4 h-4' />;
            case 'in-progress':
                return <AlertCircle className='w-4 h-4' />;
            case 'resolved':
                return <CheckCircle2 className='w-4 h-4' />;
            case 'closed':
                return <XCircle className='w-4 h-4' />;
            default:
                return <Clock className='w-4 h-4' />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'medium':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'low':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className='container mx-auto px-4 py-8 max-w-4xl'>
                <Card>
                    <CardContent className='flex flex-col items-center justify-center py-12'>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Ticket not found
                        </p>
                        <Button
                            onClick={() => navigate('/support')}
                            className='mt-4'>
                            Back to Support
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8 max-w-4xl'>
            {/* Header */}
            <div className='mb-6'>
                <Button
                    variant='ghost'
                    onClick={() => navigate('/support')}
                    className='mb-4'>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Support
                </Button>

                <Card>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                                <CardTitle className='text-2xl mb-2'>
                                    {ticket.subject}
                                </CardTitle>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    <Badge className={getStatusColor(ticket.status)}>
                                        <span className='flex items-center gap-1'>
                                            {getStatusIcon(ticket.status)}
                                            {ticket.status}
                                        </span>
                                    </Badge>
                                    <Badge className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority}
                                    </Badge>
                                    <Badge variant='outline' className='capitalize'>
                                        {ticket.category}
                                    </Badge>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {ticket.status !== 'closed' && (
                                    <Select
                                        value={ticket.status}
                                        onValueChange={handleStatusChange}
                                        disabled={isUpdating}>
                                        <SelectTrigger className='w-40'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='open'>Open</SelectItem>
                                            <SelectItem value='in-progress'>
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value='resolved'>
                                                Resolved
                                            </SelectItem>
                                            <SelectItem value='closed'>
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                <Button
                                    variant='destructive'
                                    size='icon'
                                    onClick={handleDeleteTicket}
                                    disabled={isDeleting}>
                                    <Trash2 className='w-4 h-4' />
                                </Button>
                            </div>
                        </div>
                        <CardDescription className='mt-3'>
                            Created on{' '}
                            {new Date(ticket.createdAt).toLocaleDateString()}{' '}
                            at {new Date(ticket.createdAt).toLocaleTimeString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
                            <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                                {ticket.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Messages */}
            <div className='space-y-4 mb-6'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    Conversation
                </h3>

                {ticket.messages.length === 0 ? (
                    <Card>
                        <CardContent className='py-8 text-center text-gray-500 dark:text-gray-400'>
                            No messages yet. Start the conversation below.
                        </CardContent>
                    </Card>
                ) : (
                    <div className='space-y-4'>
                        {ticket.messages.map((msg) => (
                            <Card
                                key={msg._id}
                                className={
                                    msg.senderType === 'admin'
                                        ? 'border-l-4 border-l-blue-500'
                                        : ''
                                }>
                                <CardContent className='p-4'>
                                    <div className='flex items-start gap-3'>
                                        {msg.sender.photo ? (
                                            <img
                                                src={getPhotoUrl(msg.sender.photo)}
                                                alt={msg.sender.name}
                                                className='w-10 h-10 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className='w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                                                <User className='w-5 h-5 text-white' />
                                            </div>
                                        )}
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                                                    {msg.sender.name}
                                                </span>
                                                {msg.senderType === 'admin' && (
                                                    <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>
                                                        Support Team
                                                    </Badge>
                                                )}
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>
                                                    {new Date(
                                                        msg.timestamp
                                                    ).toLocaleDateString()}{' '}
                                                    {new Date(
                                                        msg.timestamp
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Reply Form */}
            {ticket.status !== 'closed' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Reply</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendMessage} className='space-y-4'>
                            <textarea
                                value={message}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                placeholder='Type your message here...'
                                rows={4}
                                maxLength={2000}
                                className='w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none'
                            />
                            <Button
                                type='submit'
                                disabled={isAddingMessage || !message.trim()}
                                className='bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                                <Send className='w-4 h-4 mr-2' />
                                {isAddingMessage ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SupportTicketDetailScreen;
