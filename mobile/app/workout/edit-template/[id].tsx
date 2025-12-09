import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    Alert,
    useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useGetExercisesQuery } from '@/slices/exerciseApiSlice';
import { useGetTemplateByIdQuery, useUpdateTemplateMutation, useDeleteTemplateMutation } from '@/slices/workoutTemplateApiSlice';
import { useGetTemplateFoldersQuery } from '@/slices/workoutTemplateFolderApiSlice';
import type { WorkoutTemplateExercise, WorkoutTemplateSet } from '@/slices/workoutTemplateApiSlice';

// Exercise type from API
interface Exercise {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
}

const EditTemplateScreen = () => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const params = useLocalSearchParams();
    const templateId = params.id as string;

    // API hooks
    const { data: templateResponse, isLoading: templateLoading, error: templateError } = useGetTemplateByIdQuery(templateId);
    const { data: exercises, isLoading: exercisesLoading } = useGetExercisesQuery();
    const { data: foldersResponse } = useGetTemplateFoldersQuery();
    const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
    const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();

    // State
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [templateExercises, setTemplateExercises] = useState<WorkoutTemplateExercise[]>([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [showFolderPicker, setShowFolderPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const folders = foldersResponse?.data || [];
    const template = templateResponse?.data;

    // Load template data when available
    useEffect(() => {
        if (template) {
            setTemplateName(template.name);
            setTemplateDescription(template.description || '');
            setSelectedFolderId(template.folderId || '');
            setTemplateExercises(
                template.exercises.map((exercise: any) => ({
                    ...exercise,
                    sets: exercise.sets.map((set: any) => ({
                        ...set,
                        targetWeight: set.targetWeight ?? 0,
                    })),
                }))
            );
        }
    }, [template]);

    // Handle template not found
    useEffect(() => {
        if (templateError) {
            Toast.show({ type: 'error', text1: 'Template not found' });
            router.back();
        }
    }, [templateError]);

    // Filter exercises based on search
    const filteredExercises = exercises?.filter(
        (exercise) =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleAddExercise = (exercise: Exercise) => {
        const newExercise: WorkoutTemplateExercise = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: [{ setNumber: 1, targetReps: 10, targetWeight: 0, notes: '' }],
            notes: '',
        };

        setTemplateExercises([...templateExercises, newExercise]);
        setShowExerciseSearch(false);
        setSearchTerm('');
        Toast.show({ type: 'success', text1: `${exercise.name} added` });
    };

    const handleRemoveExercise = (exerciseId: string) => {
        Alert.alert('Remove Exercise', 'Are you sure you want to remove this exercise?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    setTemplateExercises(templateExercises.filter((ex) => ex.exerciseId !== exerciseId));
                },
            },
        ]);
    };

    const handleAddSet = (exerciseId: string) => {
        setTemplateExercises(
            templateExercises.map((ex) => {
                if (ex.exerciseId === exerciseId) {
                    const newSetNumber = ex.sets.length + 1;
                    return {
                        ...ex,
                        sets: [...ex.sets, { setNumber: newSetNumber, targetReps: 10, targetWeight: 0, notes: '' }],
                    };
                }
                return ex;
            })
        );
    };

    const handleRemoveSet = (exerciseId: string, setNumber: number) => {
        setTemplateExercises(
            templateExercises.map((ex) => {
                if (ex.exerciseId === exerciseId && ex.sets.length > 1) {
                    return {
                        ...ex,
                        sets: ex.sets.filter((s) => s.setNumber !== setNumber).map((s, idx) => ({ ...s, setNumber: idx + 1 })),
                    };
                }
                return ex;
            })
        );
    };

    const handleUpdateSet = (
        exerciseId: string,
        setNumber: number,
        field: keyof WorkoutTemplateSet,
        value: any
    ) => {
        setTemplateExercises(
            templateExercises.map((ex) => {
                if (ex.exerciseId === exerciseId) {
                    return {
                        ...ex,
                        sets: ex.sets.map((s) => (s.setNumber === setNumber ? { ...s, [field]: value } : s)),
                    };
                }
                return ex;
            })
        );
    };

    const handleUpdateTemplate = async () => {
        if (!templateName.trim()) {
            Toast.show({ type: 'error', text1: 'Please enter a template name' });
            return;
        }

        if (templateExercises.length === 0) {
            Toast.show({ type: 'error', text1: 'Please add at least one exercise' });
            return;
        }

        try {
            await updateTemplate({
                id: templateId,
                name: templateName.trim(),
                description: templateDescription.trim(),
                exercises: templateExercises,
                folderId: selectedFolderId || undefined,
                isPublic: false,
            }).unwrap();

            router.back();
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to update template' });
        }
    };

    const handleDeleteTemplate = () => {
        Alert.alert(
            'Delete Template',
            'Are you sure you want to delete this template? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTemplate(templateId).unwrap();
                            router.back();
                        } catch (error: any) {
                            Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to delete template' });
                        }
                    },
                },
            ]
        );
    };

    const selectedFolder = folders.find((f) => f._id === selectedFolderId);

    // Loading state
    if (templateLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
                <LinearGradient colors={['#9333ea', '#7e22ce']} style={{ paddingTop: insets.top + 12, paddingBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' }}>
                            Edit Template
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#9333ea" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: isDark ? '#9CA3AF' : '#6B7280' }}>Loading template...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
            {/* Header */}
            <LinearGradient colors={['#9333ea', '#7e22ce']} style={{ paddingTop: insets.top + 12, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' }}>
                        Edit Template
                    </Text>
                    <TouchableOpacity
                        onPress={handleDeleteTemplate}
                        disabled={isDeleting}
                        style={{ padding: 8, marginRight: -8 }}
                    >
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* Template Details Card */}
                <View
                    style={{
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 16 }}>
                        Template Details
                    </Text>

                    {/* Template Name */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 8 }}>
                            Name *
                        </Text>
                        <TextInput
                            value={templateName}
                            onChangeText={setTemplateName}
                            placeholder="e.g., Push Day, Full Body Workout"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            style={{
                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                color: isDark ? '#FFFFFF' : '#111827',
                                borderWidth: 1,
                                borderColor: isDark ? '#4B5563' : '#E5E7EB',
                            }}
                        />
                    </View>

                    {/* Description */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 8 }}>
                            Description (Optional)
                        </Text>
                        <TextInput
                            value={templateDescription}
                            onChangeText={setTemplateDescription}
                            placeholder="Add notes about this template..."
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            multiline
                            numberOfLines={3}
                            style={{
                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                color: isDark ? '#FFFFFF' : '#111827',
                                borderWidth: 1,
                                borderColor: isDark ? '#4B5563' : '#E5E7EB',
                                textAlignVertical: 'top',
                                minHeight: 80,
                            }}
                        />
                    </View>

                    {/* Folder Selection */}
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 8 }}>
                            Folder (Optional)
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowFolderPicker(true)}
                            style={{
                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderWidth: 1,
                                borderColor: isDark ? '#4B5563' : '#E5E7EB',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{ fontSize: 16, color: selectedFolder ? (isDark ? '#FFFFFF' : '#111827') : (isDark ? '#6B7280' : '#9CA3AF') }}>
                                {selectedFolder ? selectedFolder.name : 'Select a folder'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Exercises Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>Exercises</Text>
                    <TouchableOpacity
                        onPress={() => setShowExerciseSearch(true)}
                        style={{
                            backgroundColor: '#9333ea',
                            borderRadius: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>Add Exercise</Text>
                    </TouchableOpacity>
                </View>

                {/* Exercise List */}
                {templateExercises.length === 0 ? (
                    <View style={{ alignItems: 'center', paddingVertical: 40, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 16, marginBottom: 16 }}>
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Ionicons name="barbell-outline" size={32} color={isDark ? '#6B7280' : '#9CA3AF'} />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 8 }}>
                            No exercises yet
                        </Text>
                        <Text style={{ fontSize: 14, color: isDark ? '#9CA3AF' : '#9CA3AF', textAlign: 'center' }}>
                            Add exercises to build your workout template
                        </Text>
                    </View>
                ) : (
                    <View style={{ gap: 12, marginBottom: 16 }}>
                        {templateExercises.map((exercise, index) => (
                            <View
                                key={exercise.exerciseId}
                                style={{
                                    backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                    borderRadius: 12,
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                }}
                            >
                                {/* Exercise Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 4 }}>
                                            {index + 1}. {exercise.exerciseName}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                            {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveExercise(exercise.exerciseId)}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16,
                                            backgroundColor: '#FEE2E2',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                {/* Sets */}
                                <View style={{ gap: 8, marginBottom: 12 }}>
                                    {exercise.sets.map((set) => (
                                        <View
                                            key={set.setNumber}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 8,
                                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                                borderRadius: 8,
                                                padding: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#9CA3AF' : '#6B7280', width: 50 }}>
                                                Set {set.setNumber}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                                                <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280' }}>Reps:</Text>
                                                <TextInput
                                                    value={set.targetReps.toString()}
                                                    onChangeText={(text) => handleUpdateSet(exercise.exerciseId, set.setNumber, 'targetReps', Number(text) || 0)}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                                        borderRadius: 6,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 6,
                                                        fontSize: 14,
                                                        color: isDark ? '#FFFFFF' : '#111827',
                                                        textAlign: 'center',
                                                    }}
                                                />
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                                                <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280' }}>Weight:</Text>
                                                <TextInput
                                                    value={set.targetWeight?.toString() || '0'}
                                                    onChangeText={(text) => handleUpdateSet(exercise.exerciseId, set.setNumber, 'targetWeight', Number(text) || 0)}
                                                    keyboardType="numeric"
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                                        borderRadius: 6,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 6,
                                                        fontSize: 14,
                                                        color: isDark ? '#FFFFFF' : '#111827',
                                                        textAlign: 'center',
                                                    }}
                                                />
                                            </View>
                                            {exercise.sets.length > 1 && (
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveSet(exercise.exerciseId, set.setNumber)}
                                                    style={{ padding: 4 }}
                                                >
                                                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ))}
                                </View>

                                {/* Add Set Button */}
                                <TouchableOpacity
                                    onPress={() => handleAddSet(exercise.exerciseId)}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#9333ea',
                                        borderStyle: 'dashed',
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons name="add" size={18} color="#9333ea" />
                                    <Text style={{ color: '#9333ea', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>Add Set</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: insets.bottom + 20 }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            flex: 1,
                            backgroundColor: isDark ? '#374151' : '#E5E7EB',
                            borderRadius: 12,
                            paddingVertical: 16,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleUpdateTemplate}
                        disabled={isUpdating || !templateName.trim() || templateExercises.length === 0}
                        style={{
                            flex: 1,
                            backgroundColor: isUpdating || !templateName.trim() || templateExercises.length === 0 ? (isDark ? '#4B5563' : '#D1D5DB') : '#10B981',
                            borderRadius: 12,
                            paddingVertical: 16,
                            alignItems: 'center',
                        }}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Update Template</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Exercise Search Modal */}
            <Modal visible={showExerciseSearch} animationType="slide" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View
                        style={{
                            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            maxHeight: '80%',
                            paddingTop: 20,
                            paddingBottom: insets.bottom + 20,
                        }}
                    >
                        {/* Handle Bar */}
                        <View style={{ alignItems: 'center', marginBottom: 16 }}>
                            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }} />
                        </View>

                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                                    Add Exercise
                                </Text>
                                <TouchableOpacity onPress={() => setShowExerciseSearch(false)} style={{ padding: 4 }}>
                                    <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
                                </TouchableOpacity>
                            </View>

                            {/* Search Input */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                    borderRadius: 12,
                                    paddingHorizontal: 16,
                                    marginBottom: 16,
                                }}
                            >
                                <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                <TextInput
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholder="Search exercises..."
                                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 14,
                                        paddingHorizontal: 12,
                                        fontSize: 16,
                                        color: isDark ? '#FFFFFF' : '#111827',
                                    }}
                                />
                            </View>
                        </View>

                        {/* Exercise List */}
                        <ScrollView style={{ paddingHorizontal: 20 }}>
                            {exercisesLoading ? (
                                <ActivityIndicator size="large" color="#9333ea" style={{ marginTop: 40 }} />
                            ) : filteredExercises && filteredExercises.length > 0 ? (
                                <View style={{ gap: 8 }}>
                                    {filteredExercises.map((exercise) => {
                                        const isAdded = templateExercises.some((ex) => ex.exerciseId === exercise.id);
                                        return (
                                            <TouchableOpacity
                                                key={exercise.id}
                                                onPress={() => !isAdded && handleAddExercise(exercise)}
                                                disabled={isAdded}
                                                style={{
                                                    backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                                    borderRadius: 12,
                                                    padding: 16,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    opacity: isAdded ? 0.5 : 1,
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 4 }}>
                                                        {exercise.name}
                                                    </Text>
                                                    <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                                        {exercise.category}
                                                    </Text>
                                                </View>
                                                {isAdded ? (
                                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                                ) : (
                                                    <Ionicons name="add-circle-outline" size={24} color="#9333ea" />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                    <Text style={{ fontSize: 16, color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                        {searchTerm ? 'No exercises found' : 'Start typing to search exercises'}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Folder Picker Modal */}
            <Modal visible={showFolderPicker} animationType="fade" transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <View style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 16 }}>
                            Select Folder
                        </Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedFolderId('');
                                    setShowFolderPicker(false);
                                }}
                                style={{
                                    padding: 14,
                                    borderRadius: 10,
                                    marginBottom: 8,
                                    backgroundColor: !selectedFolderId ? (isDark ? '#374151' : '#F3F4F6') : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 16, color: isDark ? '#FFFFFF' : '#111827' }}>No Folder</Text>
                            </TouchableOpacity>
                            {folders.map((folder) => (
                                <TouchableOpacity
                                    key={folder._id}
                                    onPress={() => {
                                        setSelectedFolderId(folder._id);
                                        setShowFolderPicker(false);
                                    }}
                                    style={{
                                        padding: 14,
                                        borderRadius: 10,
                                        marginBottom: 8,
                                        backgroundColor: selectedFolderId === folder._id ? (isDark ? '#374151' : '#F3F4F6') : 'transparent',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: folder.color, marginRight: 12 }} />
                                    <Text style={{ fontSize: 16, color: isDark ? '#FFFFFF' : '#111827' }}>{folder.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            onPress={() => setShowFolderPicker(false)}
                            style={{ marginTop: 16, backgroundColor: isDark ? '#374151' : '#E5E7EB', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                        >
                            <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default EditTemplateScreen;
