import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Exercise } from '@/slices/exerciseApiSlice';
import { useCreateTemplateMutation } from '@/slices/workoutTemplateApiSlice';
import { useGetTemplateFoldersQuery } from '@/slices/workoutTemplateFolderApiSlice';
import type { WorkoutTemplateExercise, WorkoutTemplateSet } from '@/slices/workoutTemplateApiSlice';
import { ExercisePickerModal } from '@/components/workout';

const CreateTemplateScreen = () => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // API hooks
    const { data: foldersResponse } = useGetTemplateFoldersQuery();
    const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();

    // State
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [templateExercises, setTemplateExercises] = useState<WorkoutTemplateExercise[]>([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [showFolderPicker, setShowFolderPicker] = useState(false);

    const folders = foldersResponse?.data || [];

    // Handlers
    const handleAddExercise = (exercise: Exercise) => {
        const newExercise: WorkoutTemplateExercise = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: [
                { setNumber: 1, targetReps: 10, notes: '' },
                { setNumber: 2, targetReps: 10, notes: '' },
                { setNumber: 3, targetReps: 10, notes: '' },
                { setNumber: 4, targetReps: 10, notes: '' }
            ],
            notes: '',
        };

        setTemplateExercises([...templateExercises, newExercise]);
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
                        sets: [...ex.sets, { setNumber: newSetNumber, targetReps: 10, notes: '' }],
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

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            Toast.show({ type: 'error', text1: 'Please enter a template name' });
            return;
        }

        if (templateExercises.length === 0) {
            Toast.show({ type: 'error', text1: 'Please add at least one exercise' });
            return;
        }

        try {
            await createTemplate({
                name: templateName.trim(),
                description: templateDescription.trim() || undefined,
                exercises: templateExercises,
                folderId: selectedFolderId || undefined,
                isPublic: false,
            }).unwrap();

            router.back();
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to create template' });
        }
    };

    const selectedFolder = folders.find((f) => f._id === selectedFolderId);

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
            {/* Header */}
            <LinearGradient colors={['#9333ea', '#7e22ce']} style={{ paddingTop: insets.top + 12, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' }}>
                        Create Template
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView 
                style={{ flex: 1 }} 
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
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
                                                    selectTextOnFocus
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
                        onPress={handleSaveTemplate}
                        disabled={isCreating || !templateName.trim() || templateExercises.length === 0}
                        style={{
                            flex: 1,
                            backgroundColor: isCreating || !templateName.trim() || templateExercises.length === 0 ? (isDark ? '#4B5563' : '#D1D5DB') : '#10B981',
                            borderRadius: 12,
                            paddingVertical: 16,
                            alignItems: 'center',
                        }}
                    >
                        {isCreating ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Save Template</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Exercise Picker Modal */}
            <ExercisePickerModal
                visible={showExerciseSearch}
                onClose={() => setShowExerciseSearch(false)}
                onSelectExercise={handleAddExercise}
                addedExerciseIds={templateExercises.map((ex) => ex.exerciseId)}
                title="Add Exercise"
            />

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

export default CreateTemplateScreen;
