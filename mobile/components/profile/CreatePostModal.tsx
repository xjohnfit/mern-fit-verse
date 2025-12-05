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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                    <View
                        className="bg-white dark:bg-gray-800 rounded-t-3xl"
                        style={{ height: '90%' }}
                    >
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={28} color="#6b7280" />
                            </TouchableOpacity>
                            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Create Post
                            </Text>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading || (!content.trim() && !imageUri)}
                                className={`px-4 py-2 rounded-full ${isLoading || (!content.trim() && !imageUri)
                                    ? 'bg-gray-300 dark:bg-gray-600'
                                    : 'bg-blue-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white font-semibold text-sm">Post</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Content Input */}
                            <View className="px-4 py-4">
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Share your fitness journey..."
                                    placeholderTextColor="#9ca3af"
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 text-base min-h-[120px]"
                                />

                                {/* Image Preview */}
                                {imageUri && (
                                    <View className="mt-4 relative">
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={{ width: '100%', aspectRatio: 1 }}
                                            resizeMode="cover"
                                            className="rounded-xl"
                                        />
                                        <TouchableOpacity
                                            onPress={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
                                        >
                                            <Ionicons name="close" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Add Image Button */}
                                <TouchableOpacity
                                    onPress={handlePickImage}
                                    className="flex-row items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl py-3 mt-4"
                                >
                                    <Ionicons name="image-outline" size={24} color="#6b7280" />
                                    <Text className="text-gray-600 dark:text-gray-400 ml-2 font-medium">
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
