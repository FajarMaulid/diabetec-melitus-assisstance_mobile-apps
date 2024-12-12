import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing} from 'react-native';
import { Avatar, GiftedChat, Bubble, Send, IMessage } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import generateObjectId from '../ObjectID';
import Markdown from 'react-native-markdown-display';
import { Platform } from 'react-native';

const ChatScreen = () => {
  type Message = IMessage;

  const URL = process.env.EXPO_PUBLIC_API_URL

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatbotResponse, setChatbotResponse] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const typingDots = useState(new Animated.Value(0))[0];

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
              //name: item.user.name || 'Unknown',
              //avatar: item.user.avatar || '../assets/images/august.jpg',
            },
          }));

          //console.log("Formatted messages:", messagesFromApi); 

          setMessages(messagesFromApi);
        } else {
          //console.error("Data format error: 'message' not found");
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(typingDots, {
        toValue: 1,
        duration: 1000,
        easing: Easing.circle,
        useNativeDriver: true,
      })
    ).start();
  }, [typingDots]);

  const onSend = useCallback((newMessages: Message[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    //console.log('New messages:', newMessages);
    setIsTyping(true);
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [{
      _id: generateObjectId(),
      text: '...', // Placeholder text
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'bot',
        avatar: '../assets/images/august.jpg',
      },
    }]));
    fetch(`${URL}/myapp/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newMessages[0].text,
        user: {
          _id: newMessages[0].user._id,
          avatar: '../assets/images/august.jpg',
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Success:'))
      .catch((error) => console.error('Error:', error));

    //fetch('https://8a17-34-16-127-67.ngrok-free.app/chat/', {
    fetch(`${URL}/myapp/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "question": newMessages[0].text,
        "lang": "id",
      }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        //console.log('Chatbot response:', data);
        fetch(`${URL}/myapp/messages/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.answer,
            user: {
              _id: 2,
            },
          }),
        }).then((response) => response.json())
          .then((data) => console.log('Success:'))
          .catch((error) => console.log('Error:', error));
        setIsTyping(false);
        setMessages((previousMessages) => {
          const updatedMessages = previousMessages.filter(
            (msg) => msg.text !== '...'
          );
          return GiftedChat.append(updatedMessages, [{
          //_id: Math.random().toString(36).substring(2,20) + Date.now().toString(12),
          _id: generateObjectId(),
          text: data.answer,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'bot',
            avatar: '../assets/images/august.jpg',
          },
        }])})
      })
      .catch((error) => {
        setIsTyping(false);
        console.error('Error getting chatbot response:', error);
      });
  }, []);

  const renderBubble = (props: any) => {
    let { currentMessage } = props;
    if (currentMessage.text === '...' && currentMessage.user._id === 2) {
      // Render bubble dengan animasi typing bot
      const dotStyle = (index: number) => ({
        opacity: typingDots.interpolate({
          inputRange: [0, 1],
          outputRange: index === 0 ? [1, 0] : index === 1 ? [0, 1] : [0, 0],
        }),
        marginHorizontal: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#14B8AD',
      });

      return (
        <View style={styles.typingBubble}>
          {[0, 1, 2].map((index) => (
            <Animated.View key={index} style={dotStyle(index)} />
          ))}
        </View>
      );
    }

    const isFromCurrentUser = currentMessage.user._id === 1;
    return (
      <View style={{ marginRight: 10 }}>
        <Bubble
          {...props}
          wrapperStyle={{
            flex: 1,
            flexWrap: 'wrap',
            right: {
              backgroundColor: '#14B8AD',
              textAlign: 'right',
            },
            left: {
              maxWidth: '95%',
              margin: 10,
              backgroundColor: '#f0f0f0',
              textAlign: 'center',
            },
          }}
          renderMessageText={(messageProps) => {
            if (!isFromCurrentUser) {
              return (
                <View style={{ marginLeft: 20, marginRight: 10, marginTop: 0 }}>
                  <Markdown style={{
                    body: {
                      color: '#333333',
                      fontSize: 14,
                      maxWidth: '100%',
                    },
                    heading1: {
                      fontSize: 24,
                      fontWeight: 'bold',
                    },
                    em: {
                      fontStyle: 'italic',
                    },
                    link: {
                      color: '#1e90ff',
                    },
                  }}>
                    {messageProps.currentMessage.text}
                  </Markdown>
                </View>
              );
            }
            return (
              <Text style={{ color: 'white', marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                {messageProps.currentMessage.text}
              </Text>
            );
          }}
        />
      </View>
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

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    const dotStyle = (index: number) => ({
      opacity: typingDots.interpolate({
        inputRange: [0, 1],
        outputRange: index === 0 ? [1, 0] : index === 1 ? [0, 1] : [0, 0],
      }),
      marginHorizontal: 2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#14B8AD',
    });

    return (
      <View style={styles.typingContainer}>
        {[0, 1, 2].map((index) => (
          <Animated.View key={index} style={dotStyle(index)} />
        ))}
      </View>
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <MaterialCommunityIcons name="chevron-double-down" size={22} color="#333333" />
    );
  }

  return (
    <View style={{ flex:1 }}>
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
      {//renderTypingIndicator()
      }
    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    start: 0,
    top: 0,
    marginRight: 50,
  },
    typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    margin: 5,
    maxWidth: '75%',
  },
});
