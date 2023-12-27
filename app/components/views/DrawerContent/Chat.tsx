import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  GiftedChat,
  Avatar as GiftedAvatar,
  AvatarProps,
  MessageText,
  BubbleProps,
  MessageTextProps,
  Bubble,
  IMessage,
} from 'react-native-gifted-chat';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Message from '../../../types/Message';
import {FlatList, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Avatar from '../../commons/Avatar';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';
import useInit from '../../../hooks/UseInit';
import _ from 'lodash';
import {
  loadEarlierMessages,
  sendMessage,
  setChatMessage,
  setMessages,
  setRead,
} from '../../../reducers/profile';
import {viewWorkout} from '../../../reducers/exercises';

interface ChatProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
  profile: Profile;
  setMessagesAction: ({
    uid,
    snapshot,
  }: {
    uid: string;
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) => void;
  messagesObj: {[key: string]: Message};
  connection: Profile;
  chatId: string;
  sendMessageAction: ({
    message,
    chatId,
    uid,
  }: {
    message: Message;
    chatId: string;
    uid: string;
  }) => void;
  setReadAction: (uid: string) => void;
  viewWorkoutAction: (workout: string[]) => void;
  exercisesLoading: boolean;
  loadEarlierMessages: ({
    chatId,
    uid,
    startAfter,
  }: {
    chatId: string;
    uid: string;
    startAfter: number;
  }) => void;
  loading: boolean;
  chatMessages: {[key: string]: string};
  setChatMessage: ({uid, message}: {uid: string; message: string}) => void;
}

const Chat: React.FC<ChatProps> = ({
  route,
  profile,
  messagesObj,
  connection,
  chatId,
  sendMessageAction,
  setReadAction,
  viewWorkoutAction,
  exercisesLoading,
  loadEarlierMessages: loadEarlierMessagesAction,
  loading,
  chatMessages,
  setChatMessage: setChatMessageAction,
  navigation,
}) => {
  const {uid} = route.params;
  const [text, setText] = useState('');
  const [initialized, setInitialized] = useState(false);

  const persistChat = useMemo(
    () =>
      _.debounce(t => {
        setChatMessageAction({uid, message: t});
      }, 1000),
    [setChatMessageAction, uid],
  );

  const onInputTextChanged = (t: string) => {
    setText(t);
    if (initialized) {
      persistChat(t);
    }
  };

  useEffect(() => {
    setReadAction(uid);
    return () => {
      setReadAction(uid);
    };
  }, [uid, setReadAction]);

  useInit(() => {
    setTimeout(() => {
      setInitialized(true);
      if (chatMessages[uid]) {
        setText(chatMessages[uid]);
      }
    }, 500);
  });

  const sortMessages = useCallback(() => {
    const messages = Object.values(messagesObj || {});
    return messages
      .sort((a, b) => (a.createdAt as number) - (b.createdAt as number))
      .map(message => {
        return {
          ...message,
          user: {...message.user, avatar: message.user?.avatar || undefined},
        };
      });
  }, [messagesObj]);

  const loadEarlier = useCallback(async () => {
    const sorted = sortMessages();
    const startAfter = sorted[0].createdAt;
    loadEarlierMessagesAction({chatId, uid, startAfter: Number(startAfter)});
  }, [sortMessages, chatId, uid, loadEarlierMessagesAction]);

  const showLoadEarlier = useMemo(() => {
    return !sortMessages().some(m => m.text === 'Beginning of chat');
  }, [sortMessages]);

  const insets = useSafeAreaInsets();

  const renderCustomView = (props: BubbleProps<Message>) => {
    switch (props.currentMessage?.type) {
      case 'workout':
        return (
          <TouchableOpacity
            onPress={() => {
              if (props.currentMessage?.workout) {
                viewWorkoutAction(props.currentMessage?.workout);
              }
            }}
            style={{
              padding: 10,
              margin: 10,
              borderRadius: 5,
              backgroundColor: '#fff',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon size={30} name="dumbbell" style={{color: colors.appBlue}} />
            <Text style={{fontWeight: 'bold', color: colors.appBlue}}>
              Press to view workout
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderMessageText = (props: MessageTextProps<Message>) => {
    switch (props.currentMessage?.type) {
      case 'text':
      case 'workout':
        return <MessageText {...props} />;
      default:
        const newProps = {
          ...props,
          currentMessage: {
            ...props.currentMessage,
            text: 'Unknown message type',
          },
        };
        return (
          // @ts-ignore
          <MessageText
            {...newProps}
            textStyle={{
              left: {fontStyle: 'italic', fontFamily: 'normal'},
              right: {fontStyle: 'italic', fontFamily: 'normal'},
            }}
          />
        );
    }
  };

  const renderAvatar = (props: AvatarProps<IMessage>) => {
    return (
      <GiftedAvatar
        {...props}
        containerStyle={{
          left: {
            // marginRight: Platform.OS === 'ios' ? 10 : 0,
          },
          right: {},
        }}
        renderAvatar={(p: AvatarProps<Message>) =>
          p ? (
            <Avatar
              uid={connection.uid}
              name={`${connection.name} ${connection.surname || ''}`}
              src={connection.avatar}
              size={28}
            />
          ) : null
        }
      />
    );
  };

  const ref = useRef<FlatList>(null);

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header
        title={connection.name}
        hasBack
        right={
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewProfile', {connection})}>
            <Avatar
              src={connection.avatar}
              name={`${connection.name} ${connection.surname || ''}`}
              uid={connection.uid}
            />
          </TouchableOpacity>
        }
      />
      <GiftedChat
        messageContainerRef={ref}
        renderCustomView={renderCustomView}
        loadEarlier={showLoadEarlier}
        isLoadingEarlier={loading}
        onLoadEarlier={loadEarlier}
        keyboardShouldPersistTaps="never"
        renderMessageText={renderMessageText}
        bottomOffset={insets.bottom - 10}
        messages={sortMessages()}
        messagesContainerStyle={{marginBottom: 10}}
        textInputProps={{lineHeight: null}}
        listViewProps={{marginBottom: 10}}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  // fontFamily: 'Helvetica',
                },
                left: {
                  // fontFamily: 'Helvetica',
                },
              }}
              wrapperStyle={{
                left: {},
                right: {
                  backgroundColor: colors.appBlue,
                },
              }}
            />
          );
        }}
        user={{
          _id: profile.uid,
          name: profile.name,
          avatar: profile.avatar,
        }}
        scrollToBottom
        renderAvatar={renderAvatar}
        onSend={msgs => {
          const message: Message = {
            ...msgs[0],
            type: 'text',
            pending: true,
            createdAt: moment().valueOf(),
          };
          sendMessageAction({message, chatId, uid});
          ref.current?.scrollToEnd();
        }}
        inverted={false}
        onInputTextChanged={onInputTextChanged}
        text={text}
      />

      <AbsoluteSpinner loading={exercisesLoading} text="Fetching exercises" />
    </SafeAreaView>
  );
};

const mapStateToProps = (
  {profile, exercises}: MyRootState,
  props: {
    route: RouteProp<StackParamList, 'Chat'>;
  },
) => ({
  profile: profile.profile,
  chatMessages: profile.chatMessages,
  messagesObj: profile.messages[props.route.params.uid],
  connection: profile.connections[props.route.params.uid],
  chatId: profile.chats[props.route.params.uid].id,
  exercisesLoading: exercises.loading,
  loading: profile.loading,
});

const mapDispatchToProps = {
  setMessagesAction: setMessages,
  sendMessageAction: sendMessage,
  setReadAction: setRead,
  viewWorkoutAction: viewWorkout,
  loadEarlierMessages,
  setChatMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
