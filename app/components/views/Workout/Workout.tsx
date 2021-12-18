import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../../styles/views/Workout';
import {TouchableOpacity, SafeAreaView, View, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import WorkoutProps from '../../../types/views/Workout';
import {Text, Button, Layout, ListItem, Divider} from '@ui-kitten/components';
import {
  CardioType,
  CoolDown,
  Equipment,
  Goal,
  Level,
  MyRootState,
  StrengthArea,
  WarmUp,
} from '../../../types/Shared';
import {setWorkout} from '../../../actions/exercises';
import {connect} from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import DevicePixels from '../../../helpers/DevicePixels';
import {capitalizeFirstLetter} from '../../../helpers';
import GoalMenu from './GoalMenu';
import EquipmentMenu from './EquipmentMenu';
import ExperienceMenu from './ExperienceMenu';
import WarmUpCoolDown from './WarmUpCoolDown';

const Workout: React.FC<WorkoutProps> = ({
  navigation,
  setWorkoutAction,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [level, setLevel] = useState<Level>(Level.BEGINNER);
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.BEGINNER);
  const [goal, setGoal] = useState<Goal>(Goal.STRENGTH);
  const [selectedGoal, setSelectedGoal] = useState<Goal>(Goal.STRENGTH);
  const [area, setArea] = useState<StrengthArea>(StrengthArea.UPPER);
  const [selectedArea, setSelectedArea] = useState<StrengthArea>(
    StrengthArea.UPPER,
  );
  const [cardioType, setCardioType] = useState<CardioType>(CardioType.HIT);
  const [selectedCardioType, setSelectedCardioType] = useState<CardioType>(
    CardioType.HIT,
  );
  const [settings, setSetting] = useState<
    'goal' | 'experience' | 'equipment' | 'warmup'
  >();
  const [equipment, setEquipment] = useState<Equipment[]>([Equipment.NONE]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([
    Equipment.NONE,
  ]);
  const sheetRef = useRef<BottomSheet>(null);
  const [warmUp, setWarmup] = useState<WarmUp[]>([]);
  const [selectedWarmup, setSelectedWarmup] = useState<WarmUp[]>([]);
  const [coolDown, setCoolDown] = useState<CoolDown[]>([]);
  const [selectedCoolDown, setSelectedCoolDown] = useState<CoolDown[]>([]);

  const getSettingsTitle = () => {
    switch (settings) {
      case 'goal':
        return 'Fitness Goal';
      case 'experience':
        return 'Exercise Experience';
      case 'equipment':
        return 'Available Equipment';
      case 'warmup':
        return 'Warm-up & Cool-down';
      default:
        return '';
    }
  };

  const onCancel = () => {
    sheetRef.current.close();
    setModalOpen(false);
    switch (settings) {
      case 'goal':
        setSelectedArea(area);
        setSelectedCardioType(cardioType);
        return setSelectedGoal(goal);
      case 'experience':
        return setSelectedLevel(level);
      case 'equipment':
        return setSelectedEquipment(equipment);
      case 'warmup':
        setSelectedCoolDown(coolDown);
        return setSelectedWarmup(warmUp);
      default:
        return '';
    }
  };

  const onSave = () => {
    sheetRef.current.close();
    setModalOpen(false);
    switch (settings) {
      case 'goal':
        setArea(selectedArea);
        setCardioType(selectedCardioType);
        return setGoal(selectedGoal);
      case 'experience':
        return setLevel(selectedLevel);
      case 'equipment':
        return setEquipment(selectedEquipment);
      case 'warmup':
        setCoolDown(selectedCoolDown);
        return setWarmup(selectedWarmup);
      default:
        return '';
    }
  };

  const availableEquipmentString = () => {
    if (!equipment || equipment.length === 0) {
      return 'N/A';
    }
    if (
      equipment &&
      equipment.length === 1 &&
      equipment[0] === Equipment.NONE
    ) {
      return 'None';
    }
    return `${equipment.length} selected`;
  };

  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Text category="h5" style={{margin: DevicePixels[10], marginBottom: 0}}>
          Workout settings
        </Text>
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Fitness goal"
          onPress={() => {
            sheetRef.current.expand();
            setModalOpen(true);
            setSetting('goal');
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {goal === Goal.STRENGTH ? 'Strength' : 'Cardiovascular'}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Exercise experience"
          onPress={() => {
            sheetRef.current.expand();
            setModalOpen(true);
            setSetting('experience');
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {capitalizeFirstLetter(level)}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Available equipment"
          onPress={() => {
            sheetRef.current.expand();
            setModalOpen(true);
            setSetting('equipment');
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {availableEquipmentString()}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Warm-up & Cool-down"
          onPress={() => {
            sheetRef.current.expand();
            setModalOpen(true);
            setSetting('warmup');
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {warmUp.length || coolDown.length ? 'On' : 'Off'}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            disabled={false}
            onPress={() => {
              if (equipment.length) {
                setWorkoutAction([]);
                navigation.navigate('ExerciseList', {
                  strengthArea: area,
                  level: level,
                  goal,
                  equipment,
                  cardioType,
                  warmUp,
                  coolDown,
                });
              } else {
                Alert.alert('Sorry', 'Please specify equipment first');
              }
            }}
            style={{margin: DevicePixels[10]}}>
            Continue
          </Button>
        </View>
        {modalOpen && (
          <Layout
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        onClose={() => setModalOpen(false)}
        enablePanDownToClose
        snapPoints={['80%']}
        index={-1}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.button,
            alignItems: 'center',
            borderTopLeftRadius: DevicePixels[5],
            borderTopRightRadius: DevicePixels[5],
          }}>
          <TouchableOpacity>
            <Text
              onPress={onCancel}
              style={{
                color: colors.appBlue,
                padding: DevicePixels[10],
                fontWeight: 'bold',
              }}>
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>{getSettingsTitle()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave}>
            <Text
              style={{
                color: colors.appBlue,
                padding: DevicePixels[10],
                fontWeight: 'bold',
              }}>
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
        {settings === 'equipment' && (
          <View
            style={{
              backgroundColor: '#fff',
            }}>
            <TouchableOpacity
              style={{padding: DevicePixels[10]}}
              onPress={() => {
                selectedEquipment.length === Object.keys(Equipment).length
                  ? setSelectedEquipment([])
                  : setSelectedEquipment(Object.values(Equipment));
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  fontWeight: 'bold',
                  // fontSize: DevicePixels[20],
                  color: colors.appBlue,
                }}>
                {selectedEquipment.length === Object.keys(Equipment).length
                  ? 'Clear all'
                  : 'Select all'}
              </Text>
            </TouchableOpacity>
            <Divider />
          </View>
        )}
        <ScrollView
          style={{
            backgroundColor: 'white',
            height: '100%',
          }}>
          {settings === 'goal' && (
            <GoalMenu
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              selectedCardioType={selectedCardioType}
              setSelectedCardioType={setSelectedCardioType}
            />
          )}
          {settings === 'experience' && (
            <ExperienceMenu
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
            />
          )}
          {settings === 'equipment' && (
            <EquipmentMenu
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
          )}
          {settings === 'warmup' && (
            <WarmUpCoolDown
              selectedWarmup={selectedWarmup}
              setSelectedWarmUp={setSelectedWarmup}
              selectedCoolDown={selectedCoolDown}
              setSelectedCoolDown={setSelectedCoolDown}
            />
          )}
        </ScrollView>
      </BottomSheet>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
