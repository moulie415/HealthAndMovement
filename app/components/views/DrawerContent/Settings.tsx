import React, {ReactNode, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform, ScrollView, StyleSheet, Switch, View} from 'react-native';
import {CalendarType, Goal, MyRootState, Plan} from '../../../types/Shared';
import {
  setAutoPlay,
  setPrepTime,
  setTestReminders,
  setTestReminderTime,
  setWorkoutMusic,
  setWorkoutReminders,
  setWorkoutReminderTime,
  updateProfile,
  UpdateProfilePayload,
} from '../../../actions/profile';
import {connect} from 'react-redux';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import colors from '../../../constants/colors';
import * as _ from 'lodash';
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import Divider from '../../commons/Divider';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import Toggle from '../../commons/Toggle';
import {PREP_TIME_SECS} from '../../../constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {SettingsState} from '../../../reducers/settings';
import PickerModal from '../../commons/PickerModal';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import {setCalendarId, syncPlanWithCalendar} from '../../../actions/plan';
import Modal from '../../commons/Modal';
import ListItem from '../../commons/ListItem';
import {FlatList} from 'react-native-gesture-handler';
import RNCalendarEvents, {
  CalendarEventWritable,
} from 'react-native-calendar-events';
import {logError} from '../../../helpers/error';

const isValidGoal = (goal: Goal) =>
  goal === Goal.STRENGTH || goal === Goal.ACTIVE || goal === Goal.WEIGHT_LOSS;

const SettingsItem: React.FC<{
  onPress: () => void;
  text: string;
  right?: ReactNode;
  disabled?: boolean;
}> = ({onPress, text, right, disabled}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        backgroundColor: colors.tile,
        height: 60,
        paddingHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
      <Text
        style={{
          color: colors.appWhite,
          fontSize: 13,
          fontWeight: 'bold',
        }}>
        {text}
      </Text>
      {right}
    </TouchableOpacity>
  );
};

const Settings: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
  workoutReminders: boolean;
  workoutReminderTime: string;
  testReminderTime: string;
  setWorkoutRemindersAction: (disabled: boolean) => void;
  setWorkoutReminderTimeAction: (date: Date) => void;
  setTestReminderTimeAction: (date: Date) => void;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  prepTime: number;
  setPrepTime: (prepTime: number) => void;
  workoutMusic: boolean;
  setWorkoutMusic: (play: boolean) => void;
  plan?: Plan;
  syncPlanWithCalendar: boolean;
  syncPlanWithCalendarAction: (plan: Plan, sync: boolean) => void;
  setCalendarId: (id: string) => void;
}> = ({
  workoutReminders,
  setWorkoutRemindersAction,
  workoutReminderTime,
  setWorkoutReminderTimeAction,
  profile,
  navigation,
  updateProfileAction,
  testReminderTime,
  setTestReminderTimeAction,
  autoPlay,
  setAutoPlay: setAutoPlayAction,
  prepTime,
  setPrepTime: setPrepTimeAction,
  workoutMusic,
  setWorkoutMusic: setWorkoutMusicAction,
  plan,
  syncPlanWithCalendar: syncWithCalendar,
  syncPlanWithCalendarAction,
  setCalendarId: setCalendarIdAction,
}) => {
  const [showWorkoutDate, setShowWorkoutDate] = useState(false);
  const [showTestDate, setShowTestDate] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date(workoutReminderTime));
  const [testDate, setTestDate] = useState(new Date(testReminderTime));
  const [marketing, setMarketing] = useState(profile.marketing);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<Goal>(
    profile.goal && isValidGoal(profile.goal) ? profile.goal : Goal.STRENGTH,
  );
  const [showPrepTime, setShowPrepTime] = useState(false);
  const [calendarList, setCalendarList] = useState<CalendarType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const newProfile = {
    ...profile,
    goal,
    marketing,
  };

  const equal =
    _.isEqual(newProfile, profile) &&
    _.isEqual(workoutDate.toISOString(), workoutReminderTime) &&
    _.isEqual(testDate.toISOString(), testReminderTime);

  const toggle = async (sync: boolean) => {
    try {
      if (plan) {
        if (sync) {
          const permission = await RNCalendarEvents.requestPermissions();
          if (permission === 'authorized') {
            const calendars = await RNCalendarEvents.findCalendars();
            const list = calendars.filter(c => c.isPrimary);
            setCalendarList(list);
            if (list.length && list.length > 1) {
              setModalVisible(true);
            } else {
              setCalendarIdAction(list[0].id);
              syncPlanWithCalendarAction(plan, sync);
            }
          }
        } else {
          syncPlanWithCalendarAction(plan, sync);
        }
      }
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error syncing calendar'});
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header hasBack title="Settings" />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: 200}}>
          <Text
            style={{
              margin: 10,
              fontSize: 18,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Workouts
          </Text>
          <SettingsItem
            onPress={() => setAutoPlayAction(!autoPlay)}
            text="Auto-play"
            right={
              <Toggle value={autoPlay} onValueChange={setAutoPlayAction} />
            }
          />
          <SettingsItem
            onPress={() => setShowPrepTime(true)}
            text="Exercise prepare time"
            right={
              <Text
                style={{
                  fontSize: 13,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                }}>
                {`${prepTime} secs`}
              </Text>
            }
          />
          <SettingsItem
            onPress={() => setWorkoutMusicAction(!workoutMusic)}
            text="Workout music"
            right={
              <Toggle
                value={workoutMusic}
                onValueChange={setWorkoutMusicAction}
              />
            }
          />

          <SettingsItem
            disabled={!plan}
            onPress={() => toggle(!syncWithCalendar)}
            text="Sync custom plans with native calendar"
            right={
              <Toggle
                disabled={!plan}
                value={syncWithCalendar}
                onValueChange={toggle}
              />
            }
          />
          <Text
            style={{
              margin: 10,
              marginTop: 35,
              fontSize: 18,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Notifications
          </Text>

          <SettingsItem
            onPress={() => setWorkoutRemindersAction(!workoutReminders)}
            text="Workout reminders"
            right={
              <Toggle
                value={workoutReminders}
                onValueChange={setWorkoutRemindersAction}
              />
            }
          />

          <SettingsItem
            onPress={() => setShowWorkoutDate(true)}
            disabled={Platform.OS === 'ios'}
            text="Time of workout reminder"
            right={
              <>
                {(showWorkoutDate || Platform.OS === 'ios') && (
                  <DateTimePicker
                    disabled={!workoutReminders}
                    style={{width: 150}}
                    testID="time"
                    value={new Date(workoutDate)}
                    textColor={colors.appWhite}
                    // placeholderText="Select date"
                    mode="time"
                    // is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, d: Date | undefined) => {
                      if (d) {
                        setWorkoutDate(d);
                      }
                      setShowWorkoutDate(Platform.OS === 'ios');
                    }}
                  />
                )}
                {Platform.OS === 'android' && (
                  <TouchableOpacity
                    disabled={!workoutReminders}
                    onPress={() => setShowWorkoutDate(true)}>
                    <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                      {moment(workoutDate).format('HH:mm')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            }
          />

          <Text
            style={{
              fontStyle: 'italic',
              fontSize: 12,
              color: colors.appWhite,
              marginLeft: 10,
            }}>
            Please note these reminders are for custom plans only
          </Text>

          <Text
            style={{
              margin: 10,
              marginTop: 35,
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Emails
          </Text>

          <SettingsItem
            onPress={() => setMarketing(!marketing)}
            text="Receive offers and info on future updates"
            right={<Toggle value={marketing} onValueChange={setMarketing} />}
          />
          <Text
            style={{
              margin: 10,
              marginTop: 35,
              color: colors.appWhite,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Account
          </Text>

          <SettingsItem
            onPress={() => {
              Clipboard.setString(profile.uid);
              Snackbar.show({text: 'User ID copied to clipboard'});
            }}
            text=" User ID"
            right={
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: colors.appWhite, fontSize: 12}}>
                  {profile.uid}
                </Text>
                <Icon
                  name="copy"
                  style={{marginLeft: 10}}
                  color={colors.appBlue}
                  size={18}
                  solid
                />
              </View>
            }
          />

          <Button
            variant="danger"
            text=" Delete my account"
            style={{margin: 10}}
            onPress={() => navigation.navigate('DeleteAccount')}
          />
        </ScrollView>
      </SafeAreaView>
      <Button
        onPress={() => {
          setLoading(true);
          navigation.goBack();
          setTestReminderTimeAction(testDate);
          setWorkoutReminderTimeAction(workoutDate);
          updateProfileAction(newProfile);
        }}
        text="Save"
        disabled={equal || loading}
        style={{
          marginHorizontal: 10,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 30,
        }}
      />
      <PickerModal
        title="Select prepare time"
        visible={showPrepTime}
        selectedValue={String(prepTime)}
        pickerData={PREP_TIME_SECS.map(value => {
          return {
            label: `${value.toString()} secs`,
            value: String(value),
          };
        })}
        onValueChange={val => setPrepTimeAction(Number(val))}
        onRequestClose={() => setShowPrepTime(false)}
      />
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.appGrey,
            paddingBottom: 10,
            borderRadius: 10,
            height: 300,
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              fontSize: 20,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            Select a calendar to sync with
          </Text>

          {plan && (
            <FlatList
              data={calendarList}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ListItem
                  style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.appWhite,
                    marginHorizontal: 40,
                  }}
                  // titleStyle={{color: colors.appGrey}}
                  onPress={() => {
                    setModalVisible(false);
                    setCalendarIdAction(item.id);
                    syncPlanWithCalendarAction(plan, true);
                  }}
                  accessoryLeft={
                    <Icon
                      name="calendar-alt"
                      size={20}
                      style={{margin: 5}}
                      color={colors.appBlue}
                    />
                  }
                  key={item.id}
                  title={item.title}
                />
              )}
              ItemSeparatorComponent={Divider}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  workoutReminders: profile.workoutReminders,
  workoutReminderTime: profile.reminderTime,
  testReminderTime: profile.testReminderTime,
  testReminders: profile.testReminders,
  profile: profile.profile,
  autoPlay: profile.autoPlay,
  prepTime: profile.prepTime,
  workoutMusic: profile.workoutMusic,
  syncedPlanEvents: profile.syncedPlanEvents,
  syncPlanWithCalendar: profile.syncPlanWithCalendar,
  plan: profile.plan,
});

const mapDispatchToProps = {
  setWorkoutRemindersAction: setWorkoutReminders,
  setWorkoutReminderTimeAction: setWorkoutReminderTime,
  setTestReminderTimeAction: setTestReminderTime,
  setTestRemindersAction: setTestReminders,
  updateProfileAction: updateProfile,
  setAutoPlay,
  setPrepTime,
  setWorkoutMusic,
  setCalendarId,
  syncPlanWithCalendarAction: syncPlanWithCalendar,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
