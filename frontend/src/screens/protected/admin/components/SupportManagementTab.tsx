import { useState } from 'react';
import {
    useGetAllTicketsQuery,
    useGetSupportStatsQuery,
    useAssignTicketMutation,
    useUpdateTicketMutation,
} from '@/slices/supportApiSlice';
import { useGetAllUsersQuery } from '@/slices/usersApiSlice';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Ticket,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const SupportManagementTab = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');

    const { data: stats } = useGetSupportStatsQuery();
    const { data: tickets, isLoading } = useGetAllTicketsQuery({
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        priority: priorityFilter || undefined,
    } as any);
    const { data: users } = useGetAllUsersQuery(undefined as void);
    const [assignTicket] = useAssignTicketMutation();
    const [updateTicket] = useUpdateTicketMutation();

    const adminUsers = users?.data?.filter((user: any) => user.admin) || [];

    const handleAssign = async (ticketId: string, adminId: string) => {
        try {
            await assignTicket({
                id: ticketId,
                data: { adminId: adminId || undefined },
            }).unwrap();
            toast.success('Ticket assigned successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to assign ticket');
        }
    };

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        try {
            await updateTicket({
                id: ticketId,
                data: { status: newStatus as any },
            }).unwrap();
            toast.success('Status updated successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handlePriorityChange = async (
        ticketId: string,
        newPriority: string
    ) => {
        try {
            await updateTicket({
                id: ticketId,
                data: { priority: newPriority as any },
            }).unwrap();
            toast.success('Priority updated successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update priority');
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
        <div className='space-y-6'>
            {/* Statistics Cards */}
            {stats && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-sm font-medium flex items-center gap-2'>
                                <Ticket className='w-4 h-4 text-blue-600' />
                                Total Tickets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stats.totalTickets}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-sm font-medium flex items-center gap-2'>
                                <Clock className='w-4 h-4 text-blue-600' />
                                Open Tickets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stats.openTickets}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-sm font-medium flex items-center gap-2'>
                                <AlertCircle className='w-4 h-4 text-yellow-600' />
                                In Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stats.inProgressTickets}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-sm font-medium flex items-center gap-2'>
                                <TrendingUp className='w-4 h-4 text-red-600' />
                                High Priority
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stats.highPriorityTickets}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>
                        Filter tickets by status, category, or priority
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-sm font-medium mb-2'>
                                Status
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                <Button
                                    size='sm'
                                    variant={statusFilter === '' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('')}
                                    className={statusFilter === '' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    All
                                </Button>
                                <Button
                                    size='sm'
                                    variant={statusFilter === 'open' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('open')}
                                    className={statusFilter === 'open' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Open
                                </Button>
                                <Button
                                    size='sm'
                                    variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('in-progress')}
                                    className={statusFilter === 'in-progress' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}>
                                    In Progress
                                </Button>
                                <Button
                                    size='sm'
                                    variant={statusFilter === 'resolved' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('resolved')}
                                    className={statusFilter === 'resolved' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                    Resolved
                                </Button>
                                <Button
                                    size='sm'
                                    variant={statusFilter === 'closed' ? 'default' : 'outline'}
                                    onClick={() => setStatusFilter('closed')}
                                    className={statusFilter === 'closed' ? 'bg-gray-600 hover:bg-gray-700' : ''}>
                                    Closed
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-2'>
                                Category
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === '' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('')}
                                    className={categoryFilter === '' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    All
                                </Button>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === 'technical' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('technical')}
                                    className={categoryFilter === 'technical' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Technical
                                </Button>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === 'account' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('account')}
                                    className={categoryFilter === 'account' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Account
                                </Button>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === 'billing' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('billing')}
                                    className={categoryFilter === 'billing' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Billing
                                </Button>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === 'feedback' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('feedback')}
                                    className={categoryFilter === 'feedback' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Feedback
                                </Button>
                                <Button
                                    size='sm'
                                    variant={categoryFilter === 'other' ? 'default' : 'outline'}
                                    onClick={() => setCategoryFilter('other')}
                                    className={categoryFilter === 'other' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
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
                                    size='sm'
                                    variant={priorityFilter === '' ? 'default' : 'outline'}
                                    onClick={() => setPriorityFilter('')}
                                    className={priorityFilter === '' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    All
                                </Button>
                                <Button
                                    size='sm'
                                    variant={priorityFilter === 'high' ? 'default' : 'outline'}
                                    onClick={() => setPriorityFilter('high')}
                                    className={priorityFilter === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}>
                                    High
                                </Button>
                                <Button
                                    size='sm'
                                    variant={priorityFilter === 'medium' ? 'default' : 'outline'}
                                    onClick={() => setPriorityFilter('medium')}
                                    className={priorityFilter === 'medium' ? 'bg-orange-600 hover:bg-orange-700' : ''}>
                                    Medium
                                </Button>
                                <Button
                                    size='sm'
                                    variant={priorityFilter === 'low' ? 'default' : 'outline'}
                                    onClick={() => setPriorityFilter('low')}
                                    className={priorityFilter === 'low' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                                    Low
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets List */}
            <Card>
                <CardHeader>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>
                        Manage and respond to support tickets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className='flex items-center justify-center py-12'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        </div>
                    ) : !tickets || tickets.length === 0 ? (
                        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                            No tickets found
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {tickets.map((ticket: any) => (
                                <Card
                                    key={ticket._id}
                                    className='cursor-pointer hover:shadow-lg transition-shadow'
                                    onClick={() =>
                                        navigate(`/support/${ticket._id}`)
                                    }>
                                    <CardContent className='p-4'>
                                        <div className='flex items-start justify-between gap-4'>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 mb-2 flex-wrap'>
                                                    <h3 className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
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
                                                    <Badge
                                                        variant='outline'
                                                        className='capitalize'>
                                                        {ticket.category}
                                                    </Badge>
                                                </div>
                                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1'>
                                                    {ticket.description}
                                                </p>
                                                <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                                                    <Users className='w-4 h-4' />
                                                    <span>
                                                        {ticket.user ? (
                                                            <>
                                                                {ticket.user.name} ({ticket.user.email})
                                                            </>
                                                        ) : (
                                                            <>Anonymous ({ticket.contactEmail})</>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className='flex flex-col gap-2 min-w-0 w-48'
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }>
                                                <Select
                                                    value={
                                                        ticket.assignedTo?._id ||
                                                        ''
                                                    }
                                                    onValueChange={(value: string) =>
                                                        handleAssign(
                                                            ticket._id,
                                                            value
                                                        )
                                                    }>
                                                    <SelectTrigger className='min-w-0'>
                                                        <SelectValue placeholder='Assign to...' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value=''>
                                                            Unassigned
                                                        </SelectItem>
                                                        {adminUsers.map(
                                                            (admin: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        admin._id
                                                                    }
                                                                    value={
                                                                        admin._id
                                                                    }>
                                                                    {admin.name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <div className='flex gap-2'>
                                                    <Select
                                                        value={ticket.status}
                                                        onValueChange={(value: string) =>
                                                            handleStatusChange(
                                                                ticket._id,
                                                                value
                                                            )
                                                        }>
                                                        <SelectTrigger className='flex-1'>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value='open'>
                                                                Open
                                                            </SelectItem>
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
                                                    <Select
                                                        value={ticket.priority}
                                                        onValueChange={(value: string) =>
                                                            handlePriorityChange(
                                                                ticket._id,
                                                                value
                                                            )
                                                        }>
                                                        <SelectTrigger className='flex-1'>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value='low'>
                                                                Low
                                                            </SelectItem>
                                                            <SelectItem value='medium'>
                                                                Medium
                                                            </SelectItem>
                                                            <SelectItem value='high'>
                                                                High
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportManagementTab;
