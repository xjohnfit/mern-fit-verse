import React, { useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    Image,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Styles
import createStyles from '@/styles/workout/ExerciseInfoModalStyles';

// Types
import { Exercise } from '@/slices/exerciseApiSlice';


interface ExerciseInfoModalProps {
    visible: boolean;
    exercise: Exercise | null;
    onClose: () => void;
}

const ExerciseInfoModal: React.FC<ExerciseInfoModalProps> = ({
    visible,
    exercise,
    onClose,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    if (!exercise) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <LinearGradient
                        colors={isDark ? ['#7e22ce', '#6b21a8'] : ['#9333ea', '#7e22ce']}
                        style={styles.header}
                    >
                        <View style={styles.headerContent}>
                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.headerTitle} numberOfLines={2}>
                                    {exercise.name}
                                </Text>
                                <View style={styles.categoryBadge}>
                                    <Ionicons name="fitness" size={14} color="#FFFFFF" />
                                    <Text style={styles.categoryBadgeText}>{exercise.category}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Content */}
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Exercise Image */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: exercise.image }}
                                style={styles.exerciseImage}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(249, 250, 251, 0.7)']}
                                style={styles.imageGradient}
                            />
                        </View>

                        {/* Exercise Details */}
                        <View style={styles.detailsContainer}>
                            {/* Description Section */}
                            {exercise.description && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons 
                                            name="information-circle" 
                                            size={20} 
                                            color={isDark ? '#a78bfa' : '#9333ea'} 
                                        />
                                        <Text style={styles.sectionTitle}>Description</Text>
                                    </View>
                                    <Text style={styles.descriptionText}>
                                        {exercise.description}
                                    </Text>
                                </View>
                            )}

                            {/* Instructions Section */}
                            {exercise.instructions && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons 
                                            name="list" 
                                            size={20} 
                                            color={isDark ? '#a78bfa' : '#9333ea'} 
                                        />
                                        <Text style={styles.sectionTitle}>How to Perform</Text>
                                    </View>
                                    <View style={styles.instructionsContainer}>
                                        {exercise.instructions.split('\n').map((instruction, index) => {
                                            const trimmed = instruction.trim();
                                            if (!trimmed) return null;
                                            return (
                                                <View key={index} style={styles.instructionRow}>
                                                    <View style={styles.instructionNumber}>
                                                        <Text style={styles.instructionNumberText}>
                                                            {index + 1}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.instructionText}>
                                                        {trimmed}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}

                            {/* Additional Info */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons 
                                        name="ellipsis-horizontal-circle" 
                                        size={20} 
                                        color={isDark ? '#a78bfa' : '#9333ea'} 
                                    />
                                    <Text style={styles.sectionTitle}>Additional Information</Text>
                                </View>
                                <View style={styles.infoGrid}>
                                    <View style={styles.infoCard}>
                                        <Ionicons 
                                            name="fitness-outline" 
                                            size={24} 
                                            color={isDark ? '#a78bfa' : '#9333ea'} 
                                        />
                                        <Text style={styles.infoLabel}>Category</Text>
                                        <Text style={styles.infoValue}>{exercise.category}</Text>
                                    </View>
                                    <View style={styles.infoCard}>
                                        <Ionicons 
                                            name="barbell-outline" 
                                            size={24} 
                                            color={isDark ? '#a78bfa' : '#9333ea'} 
                                        />
                                        <Text style={styles.infoLabel}>Exercise</Text>
                                        <Text style={styles.infoValue}>Strength</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ExerciseInfoModal;

