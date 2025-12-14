import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CreatePostModalStyles from '../../styles/profile/CreatePostModalStyles';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (content: string, imageUri: string | null) => void;
    isLoading?: boolean;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
    visible,
    onClose,
    onSubmit,
    isLoading = false,
}) => {
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    const handleSubmit = () => {
        if (!content.trim() && !imageUri) {
            alert('Please add some content or an image');
            return;
        }

        onSubmit(content, imageUri);
        setContent('');
        setImageUri(null);
    };

    const handleClose = () => {
        setContent('');
        setImageUri(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={CreatePostModalStyles.modalOverlay}>
                    <View style={isDark ? CreatePostModalStyles.modalContentDark : CreatePostModalStyles.modalContent}>
                        {/* Header */}
                        <View style={isDark ? CreatePostModalStyles.headerDark : CreatePostModalStyles.header}>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={28} color="#6b7280" />
                            </TouchableOpacity>
                            <Text style={isDark ? CreatePostModalStyles.titleDark : CreatePostModalStyles.title}>
                                Create Post
                            </Text>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading || (!content.trim() && !imageUri)}
                                style={
                                    isLoading || (!content.trim() && !imageUri)
                                        ? isDark ? CreatePostModalStyles.postButtonDisabledDark : CreatePostModalStyles.postButtonDisabled
                                        : CreatePostModalStyles.postButton
                                }
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={CreatePostModalStyles.postButtonText}>Post</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Content Input */}
                            <View style={CreatePostModalStyles.contentContainer}>
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Share your fitness journey..."
                                    placeholderTextColor="#9ca3af"
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    style={isDark ? CreatePostModalStyles.textInputDark : CreatePostModalStyles.textInput}
                                />

                                {/* Image Preview */}
                                {imageUri && (
                                    <View style={CreatePostModalStyles.imagePreviewContainer}>
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={CreatePostModalStyles.imagePreview}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            onPress={handleRemoveImage}
                                            style={CreatePostModalStyles.removeImageButton}
                                        >
                                            <Ionicons name="close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Add Image Button */}
                                <TouchableOpacity
                                    onPress={handlePickImage}
                                    style={isDark ? CreatePostModalStyles.addImageButtonDark : CreatePostModalStyles.addImageButton}
                                >
                                    <Ionicons name="image-outline" size={24} color="#6b7280" />
                                    <Text style={isDark ? CreatePostModalStyles.addImageTextDark : CreatePostModalStyles.addImageText}>
                                        {imageUri ? 'Change Photo' : 'Add Photo'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
