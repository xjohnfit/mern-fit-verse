import React, { useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import createStyles from '@/styles/chat/MessageInputStyles';

interface MessageInputProps {
    messageText: string;
    setMessageText: (text: string) => void;
    image: string | null;
    setImage: (image: string | null) => void;
    onSend: () => void;
    isSending: boolean;
    recipientName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
    messageText,
    setMessageText,
    image,
    setImage,
    onSend,
    isSending,
    recipientName,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const isDisabled = (!messageText.trim() && !image) || isSending;

    return (
        <>
            {/* Image Preview */}
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <View style={styles.imagePreviewWrapper}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            onPress={() => setImage(null)}
                            style={styles.removeImageButton}
                        >
                            <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Message Input */}
            <View style={styles.container}>
                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={`Message ${recipientName}...`}
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                            maxLength={500}
                            style={styles.textInput}
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* Image Button */}
                    <TouchableOpacity
                        onPress={handlePickImage}
                        disabled={isSending}
                        style={styles.imageButton}
                    >
                        <Ionicons name="image" size={20} color="#06b6d4" />
                    </TouchableOpacity>

                    {/* Send Button */}
                    <TouchableOpacity
                        onPress={onSend}
                        disabled={isDisabled}
                        style={[
                            styles.sendButton,
                            { backgroundColor: isDisabled ? '#d1d5db' : '#06b6d4' },
                        ]}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default MessageInput;

