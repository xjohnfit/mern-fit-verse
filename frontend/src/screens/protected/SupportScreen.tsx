import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    useCreateSupportTicketMutation,
    useGetMyTicketsQuery,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Ticket,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';

const SupportScreen = () => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        category: 'other' as
            | 'technical'
            | 'account'
            | 'billing'
            | 'feedback'
            | 'other',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    const [createTicket, { isLoading: isCreatingTicket }] =
        useCreateSupportTicketMutation();
    const {
        data: tickets,
        isLoading: isLoadingTickets,
        refetch,
    } = useGetMyTicketsQuery(undefined);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createTicket(formData).unwrap();
            toast.success('Support ticket created successfully');
            setFormData({
                subject: '',
                category: 'other',
                description: '',
                priority: 'medium',
            });
            setIsCreating(false);
            refetch();
        } catch (error: any) {
            toast.error(
                error?.data?.message || 'Failed to create support ticket'
            );
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
                return <Ticket className='w-4 h-4' />;
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

    return (
        <div className='container mx-auto px-4 py-8 max-w-6xl min-h-screen'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                        Support Center
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-2'>
                        Get help with your questions and issues
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreating(!isCreating)}
                    className='bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                    <Plus className='w-4 h-4 mr-2' />
                    New Ticket
                </Button>
            </div>

            {/* Create Ticket Form */}
            {isCreating && (
                <Card className='mb-8'>
                    <CardHeader>
                        <CardTitle>Create Support Ticket</CardTitle>
                        <CardDescription>
                            Fill out the form below to submit your support
                            request
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium mb-2'>
                                    Subject *
                                </label>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject: e.target.value,
                                        })
                                    }
                                    placeholder='Brief description of your issue'
                                    maxLength={200}
                                    required
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>
                                        Category
                                    </label>
                                    <div className='flex flex-wrap gap-2'>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.category === 'technical' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: 'technical',
                                                })
                                            }
                                            className={formData.category === 'technical' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Technical
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.category === 'account' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: 'account',
                                                })
                                            }
                                            className={formData.category === 'account' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Account
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.category === 'billing' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: 'billing',
                                                })
                                            }
                                            className={formData.category === 'billing' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Billing
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.category === 'feedback' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: 'feedback',
                                                })
                                            }
                                            className={formData.category === 'feedback' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Feedback
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.category === 'other' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    category: 'other',
                                                })
                                            }
                                            className={formData.category === 'other' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Other
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium mb-2'>
                                        Priority
                                    </label>
                                    <div className='flex flex-wrap gap-2'>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.priority === 'low' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    priority: 'low',
                                                })
                                            }
                                            className={formData.priority === 'low' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                            Low
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.priority === 'medium' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    priority: 'medium',
                                                })
                                            }
                                            className={formData.priority === 'medium' ? 'bg-orange-600 hover:bg-orange-700' : ''}>
                                            Medium
                                        </Button>
                                        <Button
                                            type='button'
                                            size='sm'
                                            variant={formData.priority === 'high' ? 'default' : 'outline'}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    priority: 'high',
                                                })
                                            }
                                            className={formData.priority === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}>
                                            High
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-2'>
                                    Description *
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder='Provide detailed information about your issue'
                                    rows={5}
                                    maxLength={2000}
                                    required
                                />
                            </div>

                            <div className='flex gap-3'>
                                <Button
                                    type='submit'
                                    disabled={isCreatingTicket}
                                    className='bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                                    {isCreatingTicket
                                        ? 'Creating...'
                                        : 'Submit Ticket'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => setIsCreating(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tickets List */}
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    My Tickets
                </h2>

                {isLoadingTickets ? (
                    <div className='flex items-center justify-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    </div>
                ) : !tickets || tickets.length === 0 ? (
                    <Card>
                        <CardContent className='flex flex-col items-center justify-center py-12'>
                            <Ticket className='w-16 h-16 text-gray-400 mb-4' />
                            <p className='text-gray-600 dark:text-gray-400 text-center'>
                                No support tickets yet. Create one to get help!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid gap-4'>
                        {tickets.map((ticket) => (
                            <Card
                                key={ticket._id}
                                className='cursor-pointer hover:shadow-lg transition-shadow'
                                onClick={() =>
                                    navigate(`/support/${ticket._id}`)
                                }>
                                <CardContent className='p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                                                    {ticket.subject}
                                                </h3>
                                                <Badge
                                                    className={getStatusColor(
                                                        ticket.status
                                                    )}>
                                                    <span className='flex items-center gap-1'>
                                                        {getStatusIcon(
                                                            ticket.status
                                                        )}
                                                        {ticket.status}
                                                    </span>
                                                </Badge>
                                                <Badge
                                                    className={getPriorityColor(
                                                        ticket.priority
                                                    )}>
                                                    {ticket.priority}
                                                </Badge>
                                            </div>
                                            <p className='text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2'>
                                                {ticket.description}
                                            </p>
                                            <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                                                <span className='capitalize'>
                                                    {ticket.category}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(
                                                        ticket.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                                {ticket.messages.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className='flex items-center gap-1'>
                                                            <MessageSquare className='w-4 h-4' />
                                                            {
                                                                ticket.messages
                                                                    .length
                                                            }{' '}
                                                            {ticket.messages
                                                                .length === 1
                                                                ? 'reply'
                                                                : 'replies'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportScreen;
