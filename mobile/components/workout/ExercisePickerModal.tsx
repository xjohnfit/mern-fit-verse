import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    TextInput,
    Modal,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetExercisesByCategoryQuery, Exercise } from '@/slices/exerciseApiSlice';

interface ExercisePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectExercise: (exercise: Exercise) => void;
    onRemoveExercise?: (exerciseId: string) => void;
    addedExerciseIds?: string[];
    title?: string;
}

const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
    visible,
    onClose,
    onSelectExercise,
    onRemoveExercise,
    addedExerciseIds = [],
    title = 'Add Exercise',
}) => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const { data: exercisesByCategory, isLoading: exercisesLoading } = useGetExercisesByCategoryQuery();

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Filter exercises by category based on search
    const filteredExercisesByCategory = useMemo(() => {
        if (!exercisesByCategory) return {};

        if (!searchTerm) return exercisesByCategory;

        const filtered: Record<string, Exercise[]> = {};
        const searchLower = searchTerm.toLowerCase();

        Object.entries(exercisesByCategory).forEach(([category, exercises]) => {
            const matchingExercises = exercises.filter(
                (exercise) =>
                    exercise.name.toLowerCase().includes(searchLower) ||
                    category.toLowerCase().includes(searchLower)
            );

            if (matchingExercises.length > 0) {
                filtered[category] = matchingExercises;
            }
        });

        return filtered;
    }, [exercisesByCategory, searchTerm]);

    const totalFilteredExercises = Object.values(filteredExercisesByCategory).reduce(
        (total, exercises) => total + exercises.length,
        0
    );

    const handleExercisePress = (exercise: Exercise, isAdded: boolean) => {
        if (isAdded && onRemoveExercise) {
            onRemoveExercise(exercise.id);
        } else {
            onSelectExercise(exercise);
        }
        setSearchTerm('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View
                    style={{
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        height: '85%',
                        paddingTop: 20,
                        paddingBottom: insets.bottom + 20,
                    }}
                >
                    {/* Handle Bar */}
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        <View
                            style={{
                                width: 40,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: isDark ? '#4B5563' : '#D1D5DB',
                            }}
                        />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        {/* Header */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: isDark ? '#FFFFFF' : '#111827',
                                    }}
                                >
                                    {title}
                                </Text>
                                {totalFilteredExercises > 0 && (
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            marginTop: 2,
                                        }}
                                    >
                                        {totalFilteredExercises} {totalFilteredExercises === 1 ? 'exercise' : 'exercises'}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
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
                            {searchTerm.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchTerm('')}>
                                    <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Exercise List by Category */}
                    <ScrollView
                        style={{ flex: 1, paddingHorizontal: 20 }}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                    >
                        {exercisesLoading ? (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#9333ea" />
                                <Text
                                    style={{
                                        marginTop: 12,
                                        fontSize: 14,
                                        color: isDark ? '#9CA3AF' : '#6B7280',
                                    }}
                                >
                                    Loading exercises...
                                </Text>
                            </View>
                        ) : totalFilteredExercises > 0 ? (
                            <View style={{ gap: 12, paddingBottom: 20 }}>
                                {Object.entries(filteredExercisesByCategory).map(([category, exercises]) => {
                                    const isExpanded = expandedCategories.has(category);

                                    return (
                                        <View key={category}>
                                            {/* Category Header */}
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: isDark ? '#374151' : '#F9FAFB',
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 16,
                                                    borderRadius: 12,
                                                    gap: 10,
                                                }}
                                                onPress={() => toggleCategory(category)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons
                                                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                                                    size={20}
                                                    color={isDark ? '#FFFFFF' : '#7E22CE'}
                                                />
                                                <View
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 16,
                                                        backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Ionicons name="fitness" size={18} color="#9333ea" />
                                                </View>
                                                <Text
                                                    style={{
                                                        flex: 1,
                                                        fontSize: 16,
                                                        fontWeight: '600',
                                                        color: isDark ? '#FFFFFF' : '#111827',
                                                    }}
                                                >
                                                    {category}
                                                </Text>
                                                <View
                                                    style={{
                                                        backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 4,
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 13,
                                                            fontWeight: '600',
                                                            color: isDark ? '#FFFFFF' : '#374151',
                                                        }}
                                                    >
                                                        {exercises.length}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                            {/* Category Exercises */}
                                            {isExpanded && (
                                                <View style={{ gap: 8, marginTop: 8, marginLeft: 8 }}>
                                                    {exercises.map((exercise) => {
                                                        const isAdded = addedExerciseIds.includes(exercise.id);
                                                        return (
                                                            <TouchableOpacity
                                                                key={exercise.id}
                                                                onPress={() => handleExercisePress(exercise, isAdded)}
                                                                style={{
                                                                    backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                                                    borderRadius: 12,
                                                                    padding: 14,
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    borderWidth: 1,
                                                                    borderColor: isAdded ? '#10B981' : (isDark ? '#374151' : '#E5E7EB'),
                                                                }}
                                                            >
                                                                {/* Exercise Image */}
                                                                {exercise.image ? (
                                                                    <Image
                                                                        source={{ uri: exercise.image }}
                                                                        style={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            borderRadius: 8,
                                                                            marginRight: 12,
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <View
                                                                        style={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            borderRadius: 8,
                                                                            backgroundColor: isDark ? '#374151' : '#E5E7EB',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginRight: 12,
                                                                        }}
                                                                    >
                                                                        <Ionicons
                                                                            name="barbell-outline"
                                                                            size={20}
                                                                            color={isDark ? '#9CA3AF' : '#6B7280'}
                                                                        />
                                                                    </View>
                                                                )}

                                                                {/* Exercise Info */}
                                                                <View style={{ flex: 1 }}>
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 16,
                                                                            fontWeight: '600',
                                                                            color: isDark ? '#FFFFFF' : '#111827',
                                                                            marginBottom: 2,
                                                                        }}
                                                                    >
                                                                        {exercise.name}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            fontSize: 13,
                                                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                                                        }}
                                                                    >
                                                                        {category}
                                                                    </Text>
                                                                </View>

                                                                {/* Status Icon */}
                                                                {isAdded ? (
                                                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                                                ) : (
                                                                    <Ionicons name="add-circle-outline" size={24} color="#9333ea" />
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <Ionicons name="search" size={48} color={isDark ? '#4B5563' : '#D1D5DB'} />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: isDark ? '#9CA3AF' : '#6B7280',
                                        marginTop: 12,
                                    }}
                                >
                                    {searchTerm ? 'No exercises found' : 'Start typing to search exercises'}
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Done Button */}
                    <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                backgroundColor: '#9333ea',
                                borderRadius: 12,
                                paddingVertical: 14,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Done Adding</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ExercisePickerModal;
