import React, { useState, useEffect } from 'react';
import { View, Platform, Text } from 'react-native';
import { GiftedChat, IMessage, Bubble } from 'react-native-gifted-chat';
import Markdown from 'react-native-markdown-display';

const Asal = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const copy = `Headings

  # h1 Heading 8-)
  ## h2 Heading
  ### h3 Heading
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading


Horizontal Rules

  Some text above
  ___

  Some text in the middle

  ---

  Some text below


Emphasis

  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~


Blockquotes

  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.


Lists

  Unordered

  + Create a list by starting a line with \`+\`, \`-\`, or \`*\`
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar


Code

  Inline \`code\`

  Indented code

      // Some comments
      line 1 of code
      line 2 of code
      line 3 of code


  Block code "fences"

  \`\`\`
  Sample text here...
  \`\`\`

  Syntax highlighting

  \`\`\` js
  var foo = function (bar) {
    return bar++;
  };

  console.log(foo(5));
  \`\`\`


Tables

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

  Right aligned columns

  | Option | Description |
  | ------:| -----------:|
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |


Links

  [link text](https://www.google.com)

  [link with title](https://www.google.com "title text!")

  Autoconverted link https://www.google.com (enable linkify to see)


Images

  Like links, Images also have a footnote style syntax

  ![Alt text][id]

  With a reference later in the document defining the URL location:

Typographic Replacements

  Enable typographer option to see result.

  (c) (C) (r) (R) (tm) (TM) (p) (P) +-

  test.. test... test..... test?..... test!....

  !!!!!! ???? ,,  -- ---

  "Smartypants, double quotes" and 'single quotes'
`
  useEffect(() => {
    // Fetch initial messages if needed
    setMessages([
      {
        _id: 1,
        text: copy,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support Agent',
          avatar: 'https://placeimg.com/140/140/any', // Optional avatar image
        },
      },
    ]);
  }, []);

  const renderBubble = (props: any) => {
    let { currentMessage } = props;
    const isFromCurrentUser = currentMessage.user._id === 1;
    return (
      <View style={{marginRight:10}}>
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
            width: '95%',
            backgroundColor: '#f0f0f0',
            textAlign: 'center',
          },
        }}
        renderMessageText={(messageProps) => {
          if (!isFromCurrentUser) {
            return (
              <Text style={{ marginLeft: 20, marginRight: 10, marginTop: 0, width: '100%', flex: 1, flexWrap: 'wrap' }}>
                <Markdown style={{
                  body: {
                    color: '#333333',
                    fontSize: 14,
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
              </Text>
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

  const onSend = (newMessages:IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1, // User ID for the current user
        }}
        renderBubble={renderBubble}
        renderUsernameOnMessage={true} // Option to show username with each message
        placeholder="Type your message here..."
        alwaysShowSend={true} // Always show the send button
        scrollToBottom
      />
    </View>
  );
};

export default Asal;

