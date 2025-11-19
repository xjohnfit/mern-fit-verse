// React
import { useNavigate } from "react-router";

// Third-party libraries
import { Dumbbell, Plus, Play, FileText } from "lucide-react";

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WorkoutScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            Workout
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-[60px]">
                        Start a workout or create a custom template
                    </p>
                </div>

                {/* Main Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Start Freestyle Workout Card */}
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 dark:hover:border-blue-400">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg">
                                    <Play className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-xl">Start Freestyle Workout</CardTitle>
                            </div>
                            <CardDescription>
                                Begin a quick workout session without a template. Add exercises on the fly and track your performance in real-time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    Perfect For:
                                </h4>
                                <ul className="space-y-1 ml-4 text-sm text-blue-800 dark:text-blue-200">
                                    <li>• Quick training sessions</li>
                                    <li>• Spontaneous workouts</li>
                                    <li>• Trying new exercises</li>
                                    <li>• Flexible training days</li>
                                </ul>
                            </div>
                            <Button
                                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                size="lg"
                                onClick={() => navigate("/workout/start")}
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Start Freestyle Workout
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Create Template Card */}
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500 dark:hover:border-purple-400">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-linear-to-r from-purple-500 to-purple-600 rounded-lg">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-xl">Create Workout Template</CardTitle>
                            </div>
                            <CardDescription>
                                Design a structured workout plan with predefined exercises, sets, and reps. Save it for repeated use.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 space-y-2">
                                <h4 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Perfect For:
                                </h4>
                                <ul className="space-y-1 ml-4 text-sm text-purple-800 dark:text-purple-200">
                                    <li>• Structured training programs</li>
                                    <li>• Consistency in your routine</li>
                                    <li>• Progressive overload tracking</li>
                                    <li>• Sharing with others</li>
                                </ul>
                            </div>
                            <Button
                                className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                size="lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Template
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Saved Templates Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            My Workout Templates
                        </CardTitle>
                        <CardDescription>
                            Quick access to your saved workout templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                No Templates Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Create your first workout template to save time and maintain consistency in your training routine.
                            </p>
                            <Button
                                variant="outline"
                                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Template
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WorkoutScreen;