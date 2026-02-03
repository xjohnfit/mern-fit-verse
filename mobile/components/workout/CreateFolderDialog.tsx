import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useCreateTemplateFolderMutation } from '@/slices/workoutTemplateFolderApiSlice';
import { PRESET_COLORS } from './constants';

interface CreateFolderDialogProps {
    visible: boolean;
    onClose: () => void;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({ visible, onClose }) => {
    const [folderName, setFolderName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#3b82f6');
    const [createFolder, { isLoading }] = useCreateTemplateFolderMutation();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const handleSubmit = async () => {
        if (!folderName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please enter a folder name',
            });
            return;
        }

        try {
            await createFolder({
                name: folderName.trim(),
                color: selectedColor,
            }).unwrap();

            setFolderName('');
            setSelectedColor('#3b82f6');
            onClose();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to create folder',
            });
        }
    };

    const handleClose = () => {
        setFolderName('');
        setSelectedColor('#3b82f6');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    activeOpacity={1}
                    onPress={handleClose}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.container}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>Create New Folder</Text>
                                <Text style={styles.subtitle}>
                                    Organize your workout templates
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                style={styles.closeButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#6b7280'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.content}
                            contentContainerStyle={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            <View style={styles.section}>
                                <Text style={styles.label}>Folder Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Upper Body, Cardio, Strength..."
                                    placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                                    value={folderName}
                                    onChangeText={setFolderName}
                                    maxLength={50}
                                />
                                <Text style={styles.charCount}>
                                    {folderName.length}/50 characters
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.label}>Folder Color</Text>
                                <View style={styles.colorGrid}>
                                    {PRESET_COLORS.map((color) => {
                                        const colorValue = color.value;
                                        return (
                                            <TouchableOpacity
                                                key={colorValue}
                                                onPress={() => setSelectedColor(colorValue)}
                                                style={[
                                                    styles.colorOption,
                                                    { backgroundColor: colorValue },
                                                    selectedColor === colorValue &&
                                                    styles.colorOptionSelected,
                                                ]}
                                                activeOpacity={0.7}
                                            >
                                                {selectedColor === colorValue && (
                                                    <Ionicons name="checkmark" size={24} color="#fff" />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                                disabled={isLoading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.createButton,
                                    isLoading && styles.createButtonDisabled,
                                ]}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.createButtonText}>Create Folder</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlayTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: 16,
        maxHeight: '85%',
        width: '100%',
        maxWidth: 500,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#334155' : '#e5e7eb',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: isDark ? '#94a3b8' : '#6b7280',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        maxHeight: 400,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 10,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#cbd5e1' : '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#d1d5db',
        backgroundColor: isDark ? '#0f172a' : '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: isDark ? '#f1f5f9' : '#111827',
    },
    charCount: {
        fontSize: 12,
        color: isDark ? '#94a3b8' : '#6b7280',
        marginTop: 4,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    colorOption: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: isDark ? '#334155' : '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#e5e7eb',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#d1d5db',
        backgroundColor: isDark ? '#334155' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#cbd5e1' : '#374151',
    },
    createButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#9333ea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonDisabled: {
        opacity: 0.6,
    },
    createButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
