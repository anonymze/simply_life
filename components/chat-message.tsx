import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';

import { cn } from '../utils/cn';


export type MessageType = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
  avatar?: string;
};

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      className={cn(
        'mb-4 flex-row',
        message.isMe ? 'justify-end' : 'justify-start'
      )}
    >
      {!message.isMe && (
        <View className="mr-2 h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {message.avatar ? (
            <Image
              source={message.avatar}
              className="h-full w-full"
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={16} color="#666" />
          )}
        </View>
      )}
      <View className="max-w-[80%]">
        {!message.isMe && (
          <Text className="mb-1 text-xs font-medium text-gray-600">
            {message.sender}
          </Text>
        )}
        <View
          className={cn(
            'rounded-2xl px-4 py-2',
            message.isMe
              ? 'rounded-tr-none bg-blue-500'
              : 'rounded-tl-none bg-gray-200'
          )}
        >
          <Text
            className={cn(
              'text-sm',
              message.isMe ? 'text-white' : 'text-gray-800'
            )}
          >
            {message.text}
          </Text>
        </View>
        <Text
          className={cn(
            'mt-1 text-xs text-gray-500',
            message.isMe ? 'text-right' : 'text-left'
          )}
        >
          {formattedTime}
        </Text>
      </View>
      {message.isMe && (
        <View className="ml-2 h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100">
          {message.avatar ? (
            <Image
              source={message.avatar}
              className="h-full w-full"
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={16} color="#3b82f6" />
          )}
        </View>
      )}
    </View>
  );
} 