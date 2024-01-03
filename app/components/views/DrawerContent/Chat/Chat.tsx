import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome6';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GiftedChat,
  Avatar as GiftedAvatar,
  AvatarProps,
  MessageText,
  BubbleProps,
  MessageTextProps,
  Bubble,
  IMessage,
  MessageVideoProps,
  MessageAudioProps,
  MessageImageProps,
} from 'react-native-gifted-chat';
import {StackParamList} from '../../../../App';
import Profile from '../../../../types/Profile';
import {MyRootState} from '../../../../types/Shared';
import {connect} from 'react-redux';
import Message, {MessageType} from '../../../../types/Message';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Avatar from '../../../commons/Avatar';
import Text from '../../../commons/Text';
import colors from '../../../../constants/colors';
import AbsoluteSpinner from '../../../commons/AbsoluteSpinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../commons/Header';
import FastImage from 'react-native-fast-image';
import useInit from '../../../../hooks/UseInit';
import _ from 'lodash';
import {
  loadEarlierMessages,
  requestMessageDeletion,
  sendMessage,
  setChatMessage,
  setMessages,
  setRead,
} from '../../../../reducers/profile';
import {viewWorkout} from '../../../../reducers/exercises';
import CustomInputToolbar from './CustomInputToolbar';
import CustomSend from './CustomSend';
import CustomActions from './CustomActions';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {logError} from '../../../../helpers/error';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import VoiceNotePlayer from './VoiceNotePlayer';
import Clipboard from '@react-native-clipboard/clipboard';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';

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
  requestMessageDeletion: ({
    chatId,
    messageId,
    message,
    uid,
  }: {
    chatId: string;
    messageId: string;
    message: Message;
    uid: string;
  }) => void;
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
  requestMessageDeletion,
}) => {
  const {uid} = route.params;
  const [text, setText] = useState('');
  const [initialized, setInitialized] = useState(false);

  const [showRecorder, setShowRecorder] = useState(false);

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

  const sorted = useMemo(() => {
    const messages = Object.values(messagesObj || {});
    return messages
      .sort((a, b) => (b.createdAt as number) - (a.createdAt as number))
      .map(message => {
        return {
          ...message,
          user: {...message.user, avatar: message.user?.avatar || undefined},
        };
      });
  }, [messagesObj]);

  const images: {uri: string}[] = sorted
    .filter(msg => msg.image)
    .map(msg => ({uri: msg.image || ''}))
    .reverse();

  const [imageIndex, setImageIndex] = useState(0);
  const [imagesVisible, setImagesVisible] = useState(false);

  const loadEarlier = useCallback(async () => {
    const startAfter = sorted[sorted.length - 1].createdAt;
    loadEarlierMessagesAction({chatId, uid, startAfter: Number(startAfter)});
  }, [sorted, chatId, uid, loadEarlierMessagesAction]);

  const showLoadEarlier = useMemo(() => {
    return !sorted.some(m => m.text === 'Beginning of chat');
  }, [sorted]);

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

  const renderMessageVideo = (props: MessageVideoProps<IMessage>) => {
    return (
      <TouchableOpacity
        disabled={props.currentMessage?.pending}
        onPress={() => {
          if (props.currentMessage) {
            navigation.navigate('VideoView', {message: props.currentMessage});
          }
        }}
        style={{position: 'relative', height: 150, width: 250, margin: 3}}>
        <Video
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 15,
          }}
          resizeMode="cover"
          muted
          paused
          source={{
            uri: convertToProxyURL(props.currentMessage?.video || ''),
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="play" color={colors.appWhite} size={40} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageAudio = (props: MessageAudioProps<IMessage>) => {
    if (props.currentMessage) {
      return <VoiceNotePlayer message={props.currentMessage} />;
    }
    return null;
  };

  const renderMessageImage = (props: MessageImageProps<IMessage>) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setImageIndex(
            images.findIndex(img => img.uri === props.currentMessage?.image),
          );
          setImagesVisible(true);
        }}
        disabled={props.currentMessage?.pending}>
        <FastImage
          style={{
            position: 'relative',
            height: 150,
            width: 250,
            margin: 3,
            borderRadius: 15,
          }}
          source={{uri: props.currentMessage?.image}}
        />
      </TouchableOpacity>
    );
  };

  const handleResponse = async (response: ImagePickerResponse) => {
    try {
      if (response.assets) {
        const asset = response.assets[0];

        let type: MessageType;
        if (asset.type?.includes('image/')) {
          type = 'image';
        } else if (asset.type?.includes('video/')) {
          type = 'video';
        } else {
          throw new Error('Unsupported mime type');
        }

        const message: Message = {
          user: {
            _id: profile.uid,
            name: profile.name,
            avatar: profile.avatar,
          },
          _id: uuid.v4() as string,
          ...(type === 'image' ? {image: asset.uri} : {}),
          ...(type === 'video' ? {video: asset.uri} : {}),
          text: '',
          type,
          pending: true,
          createdAt: moment().valueOf(),
        };
        sendMessageAction({message, chatId, uid});
      }
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error sending message'});
    }
  };

  const onPressAttachment = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      formatAsMp4: true,
    };
    if (Platform.OS === 'ios') {
      const result = await launchImageLibrary(options);
      handleResponse(result);
    } else {
      Alert.alert('Send image/video', '', [
        {
          text: 'Send image',
          onPress: async () => {
            const result = await launchImageLibrary({
              ...options,
              mediaType: 'photo',
            });
            handleResponse(result);
          },
        },
        {
          text: 'Send video',
          onPress: async () => {
            const result = await launchImageLibrary({
              ...options,
              mediaType: 'video',
            });
            handleResponse(result);
          },
        },
      ]);
    }
  };

  const onPressVoiceNote = () => {
    setShowRecorder(true);
  };

  const onPressCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'mixed',
      formatAsMp4: true,
    };
    if (Platform.OS === 'ios') {
      const result = await launchCamera(options);
      handleResponse(result);
    } else {
      Alert.alert('Take photo/video', '', [
        {
          text: 'Take photo',
          onPress: async () => {
            const result = await launchCamera({
              ...options,
              mediaType: 'photo',
            });
            handleResponse(result);
          },
        },
        {
          text: 'Shoot video',
          onPress: async () => {
            const result = await launchCamera({
              ...options,
              mediaType: 'video',
            });
            handleResponse(result);
          },
        },
      ]);
    }
  };

  const onSendVoiceNote = (result: string) => {
    const message: Message = {
      user: {
        _id: profile.uid,
        name: profile.name,
        avatar: profile.avatar,
      },
      _id: uuid.v4() as string,
      audio: result,
      text: '',
      type: 'audio',
      pending: true,
      createdAt: moment().valueOf(),
    };
    sendMessageAction({message, chatId, uid});
  };

  const onLongPress = (context: any, message: IMessage) => {
    const id = Object.keys(messagesObj).find(key => {
      const msg: Message = messagesObj[key];
      return msg._id === message._id;
    });

    const msg: Message = messagesObj[id || ''];
    const messageId = msg.id;
    if (message.text) {
      const options = ['Copy Text', 'Delete message', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              if (msg && messageId) {
                requestMessageDeletion({chatId, message: msg, uid, messageId});
              }
              break;
          }
        },
      );
    } else {
      const options = ['Delete message', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex: number) => {
          switch (buttonIndex) {
            case 0:
              if (msg && messageId) {
                requestMessageDeletion({chatId, message: msg, uid, messageId});
              }
              break;
          }
        },
      );
    }
  };

  const ref = useRef<FlatList>(null);

  return (
    <>
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
          messages={sorted}
          messagesContainerStyle={{marginBottom: 10}}
          textInputProps={{lineHeight: null}}
          listViewProps={{marginBottom: 10}}
          renderActions={() => <CustomActions onPressCamera={onPressCamera} />}
          renderInputToolbar={props => (
            <CustomInputToolbar
              {...props}
              text={text}
              showRecorder={showRecorder}
              onCloseRecorder={() => setShowRecorder(false)}
              onSendVoiceNote={onSendVoiceNote}
            />
          )}
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
          }}
          onInputTextChanged={onInputTextChanged}
          text={text}
          onLongPress={onLongPress}
          renderMessageVideo={renderMessageVideo}
          renderMessageAudio={renderMessageAudio}
          renderMessageImage={renderMessageImage}
          renderSend={props => (
            <CustomSend
              {...props}
              onPressAttachment={onPressAttachment}
              onPressVoiceNote={onPressVoiceNote}
            />
          )}
          alwaysShowSend
        />

        <AbsoluteSpinner loading={exercisesLoading} text="Fetching exercises" />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: colors.appGrey}} />
      <ImageView
        images={images}
        imageIndex={imageIndex}
        visible={imagesVisible}
        onRequestClose={() => setImagesVisible(false)}
      />
    </>
  );
};

const mapStateToProps = (
  {profile, exercises, settings}: MyRootState,
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
  requestMessageDeletion,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
