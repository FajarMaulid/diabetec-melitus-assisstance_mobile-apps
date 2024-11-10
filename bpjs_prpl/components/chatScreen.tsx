import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar, GiftedChat, Bubble, Send, IMessage } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import URL from '../env'

const ChatScreen = () => {
  type Message = IMessage;

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(`${URL}/myapp/messages/`)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Data from API:", data); 

        if (data && data[0] && data[0].message) {
          const messagesFromApi = data[0].message.map((item: any) => ({
            _id: item._id, 
            text: item.text,
            createdAt: new Date(item.createdAt),
            user: {
              _id: item.user._id,
              name: item.user.name || 'Unknown',
              avatar: item.user.avatar || '',
            },
          }));

          //console.log("Formatted messages:", messagesFromApi); 

          setMessages(messagesFromApi); 
        } else {
          console.error("Data format error: 'message' not found");
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []); 

  const onSend = useCallback((newMessages: Message[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    fetch(`${URL}/myapp/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newMessages[0].text,
        user: {
          _id: newMessages[0].user._id,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  }, []);
  
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#14B8AD',
            textAlign: 'right',
          },
          left: {
            backgroundColor: '#f0f0f0',
            textAlign: 'left',
          },
        }}
      />
    );
  }

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons name="send-circle" size={38} color="#14B8AD" />
        </View>
      </Send>
    );
  }

  const scrollToBottomComponent = () => {
    return (
      <MaterialCommunityIcons name="chevron-double-down" size={22} color="#333333" />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
}

export default ChatScreen;
