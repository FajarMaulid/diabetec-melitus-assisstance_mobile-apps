import React, { useState, useCallback, useEffect } from 'react';
import { Avatar, GiftedChat, IMessage } from 'react-native-gifted-chat';

const ChatScreen = () => {
  type Message = IMessage;

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          // avatar: 'https://placeimg.com/140/140/any',        
          avatar: '../assets/images/august.jpg',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: Message[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default ChatScreen;
