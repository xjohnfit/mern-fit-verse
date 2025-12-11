import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useDeleteTemplateFolderMutation } from '@/slices/workoutTemplateFolderApiSlice';
import { TemplateCard } from './TemplateCard';
import type { WorkoutTemplateFolder, WorkoutTemplate } from '@/types/workout.types';

interface FolderCardProps {
    folder: WorkoutTemplateFolder;
    templates: WorkoutTemplate[];
    onEditFolder: (folder: WorkoutTemplateFolder) => void;
    hasActiveWorkout?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, templates, onEditFolder, hasActiveWorkout = false }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFolder, { isLoading: isDeleting }] = useDeleteTemplateFolderMutation();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const folderTemplates = templates
        .filter((t) => t.folderId === folder._id)
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleDeleteFolder = () => {
        setShowDeleteModal(true);
        setShowMenu(false);
    };

    const confirmDeleteFolder = async () => {
        try {
            await deleteFolder(folder._id).unwrap();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Folder deleted successfully',
            });
            setShowDeleteModal(false);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to delete folder',
            });
        }
    };

    return (
        <View style={[styles.container, { borderLeftColor: folder.color }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setIsExpanded(!isExpanded)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                        size={20}
                        color={isDark ? '#94a3b8' : '#6b7280'}
                    />
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: folder.color + '33' },
                        ]}
                    >
                        <Ionicons name="folder-open" size={20} color={folder.color} />
                    </View>
                    <View style={styles.folderInfo}>
                        <Text style={styles.folderName}>{folder.name}</Text>
                        <Text style={styles.folderCount}>
                            {folderTemplates.length}{' '}
                            {folderTemplates.length === 1 ? 'template' : 'templates'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setShowMenu(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#94a3b8' : '#6b7280'} />
                </TouchableOpacity>
            </View>

            {isExpanded && (
                <View style={styles.content}>
                    {folderTemplates.length > 0 ? (
                        folderTemplates.map((template) => (
                            <TemplateCard key={template._id} template={template} hasActiveWorkout={hasActiveWorkout} />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                No templates in this folder yet
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <Modal
                visible={showMenu}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowMenu(false)}
            >
                <TouchableOpacity
                    style={styles.menuOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                onEditFolder(folder);
                                setShowMenu(false);
                            }}
                        >
                            <Ionicons name="pencil" size={20} color={isDark ? '#cbd5e1' : '#374151'} />
                            <Text style={styles.menuItemText}>Edit Folder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, styles.menuItemDanger]}
                            onPress={handleDeleteFolder}
                            disabled={isDeleting}
                        >
                            <Ionicons name="trash" size={20} color="#ef4444" />
                            <Text
                                style={[
                                    styles.menuItemText,
                                    styles.menuItemTextDanger,
                                ]}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Folder'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showDeleteModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.deleteModalOverlay}>
                    <View style={styles.deleteModalContainer}>
                        <View style={styles.deleteModalHeader}>
                            <Text style={styles.deleteModalTitle}>Delete Folder</Text>
                        </View>
                        <Text style={styles.deleteModalMessage}>
                            Are you sure you want to delete the &quot;{folder.name}&quot; folder? Templates
                            will be moved to &quot;Unsorted&quot;.
                        </Text>
                        <View style={styles.deleteModalActions}>
                            <TouchableOpacity
                                style={styles.deleteModalCancelButton}
                                onPress={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                <Text style={styles.deleteModalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.deleteModalConfirmButton,
                                    isDeleting &&
                                    styles.deleteModalConfirmButtonDisabled,
                                ]}
                                onPress={confirmDeleteFolder}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.deleteModalConfirmText}>
                                        Delete
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: 8,
        borderLeftWidth: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? '#334155' : '#e5e7eb',
        padding: 12,
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    folderInfo: {
        marginLeft: 12,
        flex: 1,
    },
    folderName: {
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#f1f5f9' : '#111827',
    },
    folderCount: {
        fontSize: 13,
        color: isDark ? '#94a3b8' : '#6b7280',
        marginTop: 2,
    },
    menuButton: {
        padding: 8,
    },
    content: {
        padding: 12,
        gap: 8,
    },
    emptyState: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 13,
        color: isDark ? '#64748b' : '#9ca3af',
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: 12,
        width: '80%',
        maxWidth: 300,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#334155' : '#f3f4f6',
    },
    menuItemDanger: {
        borderBottomWidth: 0,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },
    menuItemTextDanger: {
        color: '#ef4444',
    },
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    deleteModalContainer: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
    },
    deleteModalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#334155' : '#e5e7eb',
    },
    deleteModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#111827',
    },
    deleteModalMessage: {
        padding: 20,
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#6b7280',
        lineHeight: 22,
    },
    deleteModalActions: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#e5e7eb',
    },
    deleteModalCancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#d1d5db',
        alignItems: 'center',
    },
    deleteModalCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#cbd5e1' : '#374151',
    },
    deleteModalConfirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#ef4444',
        alignItems: 'center',
    },
    deleteModalConfirmButtonDisabled: {
        opacity: 0.6,
    },
    deleteModalConfirmText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
