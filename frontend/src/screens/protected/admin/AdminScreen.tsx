import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/slices/usersApiSlice';
import { useGetExercisesQuery, useCreateExerciseMutation, useUpdateExerciseMutation, useDeleteExerciseMutation } from '@/slices/exerciseApiSlice';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  admin: boolean;
  createdAt: string;
  photo?: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string;
  image: string;
  category: string;
}

interface RootState {
  auth: {
    userInfo: User | null;
    isAuthenticated: boolean;
  };
}

const AdminScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Users management
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersQuery(undefined, {
    skip: !userInfo?.admin,
  });
  const [updateUserRole] = useUpdateUserRoleMutation();

  // Exercises management
  const { data: exercises, isLoading: exercisesLoading, refetch: refetchExercises } = useGetExercisesQuery();
  const [createExercise] = useCreateExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    description: '',
    instructions: '',
    image: '',
    category: '',
  });

  // Check if user is admin
  useEffect(() => {
    if (!userInfo?.admin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  // Handle user role update
  const handleRoleUpdate = async (userId: string, currentAdmin: boolean) => {
    try {
      const result = await updateUserRole({ userId, admin: !currentAdmin }).unwrap();
      toast.success(result.message || 'User role updated successfully');
      refetchUsers();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update user role');
    }
  };

  // Handle exercise form submission
  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!exerciseForm.name || !exerciseForm.description || !exerciseForm.instructions || !exerciseForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingExercise) {
        await updateExercise({ id: editingExercise.id, data: exerciseForm }).unwrap();
        toast.success('Exercise updated successfully');
      } else {
        await createExercise(exerciseForm).unwrap();
        toast.success('Exercise created successfully');
      }

      resetExerciseForm();
      refetchExercises();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save exercise');
    }
  };

  // Handle exercise deletion
  const handleExerciseDelete = async (exerciseId: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await deleteExercise(exerciseId).unwrap();
      toast.success('Exercise deleted successfully');
      refetchExercises();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete exercise');
    }
  };

  // Handle exercise editing
  const handleExerciseEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      description: exercise.description,
      instructions: exercise.instructions,
      image: exercise.image,
      category: exercise.category,
    });
    setShowExerciseModal(true);
  };

  // Handle add new exercise
  const handleAddExercise = () => {
    setEditingExercise(null);
    setExerciseForm({
      name: '',
      description: '',
      instructions: '',
      image: '',
      category: '',
    });
    setShowExerciseModal(true);
  };

  // Reset exercise form
  const resetExerciseForm = () => {
    setEditingExercise(null);
    setExerciseForm({
      name: '',
      description: '',
      instructions: '',
      image: '',
      category: '',
    });
    setShowExerciseModal(false);
  };

  // Filter users based on search
  const filteredUsers = usersData?.data?.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter exercises based on search
  const filteredExercises = exercises?.filter((exercise: Exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  ) || [];

  if (!userInfo?.admin) {
    return null;
  }

  const tabs = [
    {
      title: 'Users',
      value: 'users',
      content: (
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {usersLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="hidden md:table-cell text-left p-3 font-semibold text-foreground">Name</th>
                        <th className="hidden md:table-cell text-left p-3 font-semibold text-foreground">Username</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Email</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Role</th>
                        <th className="text-left p-3 font-semibold text-sm md:text-base text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: User) => (
                        <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="hidden md:table-cell p-3 text-foreground">{user.name}</td>
                          <td className="hidden md:table-cell p-3 text-muted-foreground">@{user.username}</td>
                          <td className="p-3 text-sm md:text-base text-foreground">{user.email}</td>
                          <td className="p-3 text-sm md:text-base">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.admin
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                            >
                              {user.admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="p-3 text-sm md:text-base">
                            <Button
                              size="sm"
                              variant={user.admin ? 'destructive' : 'default'}
                              onClick={() => handleRoleUpdate(user._id, user.admin)}
                              disabled={user._id === userInfo._id}
                            >
                              {user.admin ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      title: 'Exercises',
      value: 'exercises',
      content: (
        <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Management</CardTitle>
              <CardDescription>Add and manage workout exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAddExercise}
                className="mb-4"
              >
                Add New Exercise
              </Button>

              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search exercises by name or category..."
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {exercisesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading exercises...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-semibold text-foreground">Exercise Name</th>
                        <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExercises.map((exercise: Exercise) => (
                        <tr key={exercise.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-3 text-foreground">{exercise.name}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExerciseEdit(exercise)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleExerciseDelete(exercise.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredExercises.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No exercises found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base">
            Manage users, exercises, and system settings
          </p>
        </div>

        <Tabs
          tabs={tabs}
          defaultValue="users"
          containerClassName="mb-8 justify-center"
          activeTabClassName="bg-primary dark:bg-primary"
        />
      </div>

      {/* Exercise Form Modal */}
      <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
            <DialogDescription>
              {editingExercise ? 'Update the exercise details below.' : 'Fill in the details to create a new exercise.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExerciseSubmit}>
            <DialogBody>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Name *</label>
                    <Input
                      type="text"
                      value={exerciseForm.name}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                      placeholder="Exercise name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Category *</label>
                    <Input
                      type="text"
                      value={exerciseForm.category}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, category: e.target.value })}
                      placeholder="e.g., Chest, Back, Legs"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Image URL</label>
                  <Input
                    type="text"
                    value={exerciseForm.image}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Description *</label>
                  <textarea
                    value={exerciseForm.description}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                    placeholder="Brief description of the exercise"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Instructions *</label>
                  <textarea
                    value={exerciseForm.instructions}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, instructions: e.target.value })}
                    placeholder="Step-by-step instructions"
                    className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetExerciseForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExercise ? 'Update Exercise' : 'Create Exercise'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminScreen;