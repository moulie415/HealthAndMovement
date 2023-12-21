import React, {useCallback, useEffect, useState} from 'react';
import Button from './Button';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import Message, {MessageType} from '../../types/Message';
import Text from './Text';
import Avatar from './Avatar';
import {shareWorkout} from '../../helpers/exercises';
import Exercise from '../../types/Exercise';
import {FlatList, View} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import Chat from '../../types/Chat';
import Snackbar from 'react-native-snackbar';
import AbsoluteSpinner from './AbsoluteSpinner';
import {sendMessage} from '../../helpers/api';
import moment from 'moment';
import uuid from 'react-native-uuid';
import Modal from './Modal';
import Divider from './Divider';
import ListItem from './ListItem';
import { setShareModalVisible } from '../../reducers/exercises';
import { getConnections } from '../../reducers/profile';

const ShareModal: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  connections: {[key: string]: Profile};
  type: MessageType;
  workout?: Exercise[];
  title: string;
  profile: Profile;
  getConnectionsAction: () => void;
  chats: {[key: string]: Chat};
}> = ({
  visible,
  setVisible,
  title,
  connections,
  profile,
  type,
  workout,
  getConnectionsAction,
  chats,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExternal, setShowExternal] = useState(false);

  const shareExternal = useCallback(() => {
    setVisible(false);
    switch (type) {
      case 'workout':
        workout && profile.name && shareWorkout(workout, profile.name);
    }
  }, [type, profile.name, setVisible, workout]);

  useEffect(() => {
    if (visible && !profile.premium && !showExternal) {
      setShowExternal(true);
      shareExternal();
    }
  }, [visible, profile.premium, shareExternal, showExternal]);

  useEffect(() => {
    if (profile.premium) {
      getConnectionsAction();
    }
  }, [getConnectionsAction, profile.premium]);

  const getMessage = (): Message => {
    switch (type) {
      default:
        return {
          _id: uuid.v4() as string,
          text: `${profile.name} shared a workout with you`,
          type: 'workout',
          workout: workout?.map(exercise => exercise.id || ''),
          user: {_id: profile.uid, name: profile.name, avatar: profile.avatar},
          pending: true,
          createdAt: moment().valueOf(),
        };
    }
  };

  return (
    <Modal visible={visible && !!profile.premium}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 10,
          borderRadius: 10,
        }}>
        <Text style={{textAlign: 'center'}}>{title}</Text>
        <Text style={{textAlign: 'center', marginBottom: 10}}>
          (Send message to friends)
        </Text>
        <Divider />
        <FlatList
          style={{height: 200}}
          data={Object.values(connections)}
          ItemSeparatorComponent={Divider}
          renderItem={({item}) => (
            <ListItem
              accessoryLeft={
                <Avatar
                  name={`${item.name} ${item.surname || ''}`}
                  src={item.avatar}
                  uid={item.uid}
                />
              }
              onPress={() => {
                if (selected.includes(item.uid)) {
                  setSelected(selected.filter(i => i !== item.uid));
                } else {
                  setSelected([...selected, item.uid]);
                }
              }}
              title={item.name}
              accessoryRight={
                selected.includes(item.uid) ? (
                  <Icon
                    size={20}
                    name="check-circle"
                    solid
                    color={colors.appBlue}
                  />
                ) : (
                  <Icon size={20} name="circle" color={colors.appBlue} />
                )
              }
            />
          )}
        />

        <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
          <Button
            text="Cancel"
            style={{marginRight: 10}}
            onPress={() => setVisible(false)}
          />
          <Button text="Share external" onPress={shareExternal} />
          <Button
            text="Send"
            style={{marginLeft: 10}}
            disabled={!selected.length || loading}
            onPress={async () => {
              try {
                setLoading(true);
                await Promise.all(
                  selected.map(uid => {
                    const chatId = chats[uid].id;
                    return sendMessage(getMessage(), chatId, uid);
                  }),
                );
                Snackbar.show({
                  text: `${selected.length > 1 ? 'Messages' : 'Message'} sent`,
                });
                setLoading(false);
                setVisible(false);
              } catch (e) {
                Snackbar.show({
                  text: `Error sending ${
                    selected.length > 1 ? 'Messages' : 'Message'
                  }`,
                });
                setLoading(false);
              }
            }}
          />
        </View>
      </View>
      <AbsoluteSpinner loading={loading} />
    </Modal>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  connections: profile.connections,
  profile: profile.profile,
  visible: exercises.shareModalVisible,
  chats: profile.chats,
});

const mapDispatchToProps = {
  setVisible: setShareModalVisible,
  getConnectionsAction: getConnections,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
