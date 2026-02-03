import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, Image, useColorScheme, Animated, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useImportTemplateMutation } from '@/slices/workoutTemplateApiSlice';
import Toast from 'react-native-toast-message';
import createStyles from '@/styles/chat/MessageBubbleStyles';

interface TemplateData {
    _id: string;
    name: string;
    description?: string;
    exercises: any[];
}

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    messageType?: 'text' | 'image' | 'template';
    templateData?: TemplateData;
    createdAt: string;
}

interface MessageBubbleProps {
    message: Message;
    isMyMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMyMessage }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark, isMyMessage), [isDark, isMyMessage]);
    const [importTemplate, { isLoading: isImporting }] = useImportTemplateMutation();

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleImportTemplate = async () => {
        if (!message.templateData) return;

        Alert.alert(
            'Import Template',
            `Do you want to import "${message.templateData.name}" to your templates?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Import',
                    onPress: async () => {
                        try {
                            await importTemplate(message.templateData!._id).unwrap();
                            Toast.show({
                                type: 'success',
                                text1: 'Template Imported',
                                text2: `"${message.templateData!.name}" has been added to your templates`,
                            });
                        } catch (error: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Import Failed',
                                text2: error?.data?.message || 'Failed to import template',
                            });
                        }
                    },
                },
            ]
        );
    };

    const renderTemplateMessage = () => {
        if (!message.templateData) return null;

        const exerciseCount = message.templateData.exercises.length;

        return (
            <View style={styles.templateContainer}>
                <LinearGradient
                    colors={isMyMessage
                        ? ['#7c3aed', '#6d28d9']
                        : isDark
                            ? ['#374151', '#1f2937']
                            : ['#f3e8ff', '#ede9fe']
                    }
                    style={styles.templateGradient}
                >
                    <View style={styles.templateHeader}>
                        <View style={styles.templateIconContainer}>
                            <Ionicons
                                name="fitness"
                                size={24}
                                color={isMyMessage ? '#fff' : isDark ? '#a78bfa' : '#9333ea'}
                            />
                        </View>
                        <View style={styles.templateInfo}>
                            <Text style={[
                                styles.templateTitle,
                                { color: isMyMessage ? '#fff' : isDark ? '#f9fafb' : '#111827' }
                            ]}>
                                {message.templateData.name}
                            </Text>
                            {message.templateData.description && (
                                <Text
                                    style={[
                                        styles.templateDescription,
                                        { color: isMyMessage ? 'rgba(255,255,255,0.9)' : isDark ? '#d1d5db' : '#6b7280' }
                                    ]}
                                    numberOfLines={2}
                                >
                                    {message.templateData.description}
                                </Text>
                            )}
                            <View style={styles.templateStats}>
                                <Ionicons
                                    name="barbell-outline"
                                    size={14}
                                    color={isMyMessage ? 'rgba(255,255,255,0.8)' : isDark ? '#9ca3af' : '#6b7280'}
                                />
                                <Text style={[
                                    styles.templateStatsText,
                                    { color: isMyMessage ? 'rgba(255,255,255,0.8)' : isDark ? '#9ca3af' : '#6b7280' }
                                ]}>
                                    {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {!isMyMessage && (
                        <TouchableOpacity
                            style={styles.importButton}
                            onPress={handleImportTemplate}
                            disabled={isImporting}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                style={styles.importButtonGradient}
                            >
                                {isImporting ? (
                                    <Text style={styles.importButtonText}>Importing...</Text>
                                ) : (
                                    <>
                                        <Ionicons name="download-outline" size={16} color="#fff" />
                                        <Text style={styles.importButtonText}>Import Template</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {message.createdAt && (
                        <Text
                            style={[
                                styles.timestamp,
                                styles.templateTimestamp,
                                {
                                    color: isMyMessage
                                        ? 'rgba(255,255,255,0.8)'
                                        : '#9ca3af',
                                },
                            ]}
                        >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    )}
                </LinearGradient>
            </View>
        );
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                }
            ]}
        >
            {message.messageType === 'template' ? (
                renderTemplateMessage()
            ) : (
                <View style={styles.bubble}>
                    {message.image && (
                        <Image
                            source={{ uri: message.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: isMyMessage
                                    ? '#fff'
                                    : isDark
                                        ? '#f9fafb'
                                        : '#1f2937',
                            },
                        ]}
                    >
                        {message.text}
                    </Text>
                    {message.createdAt && (
                        <Text
                            style={[
                                styles.timestamp,
                                {
                                    color: isMyMessage
                                        ? 'rgba(255,255,255,0.8)'
                                        : '#9ca3af',
                                },
                            ]}
                        >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    )}
                </View>
            )}
        </Animated.View>
    );
};

export default MessageBubble;

