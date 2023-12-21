import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity, SafeAreaView, View, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import WorkoutProps from '../../../types/views/Workout';
import {Equipment, MyRootState, Goal} from '../../../types/Shared';
import {connect} from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';

import {capitalizeFirstLetter} from '../../../helpers';
import EquipmentMenu from './EquipmentMenu';
import ImageLoader from '../../commons/ImageLoader';
import globalStyles from '../../../styles/globalStyles';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import Divider from '../../commons/Divider';
import { setEquipment, setWorkout } from '../../../reducers/exercises';

const Workout: React.FC<WorkoutProps> = ({
  navigation,
  setWorkoutAction,
  setEquipmentAction,
  equipment,
  fitnessGoal,
  level,
  warmUp,
  coolDown,
  profile,
}) => {
  const [settings, setSetting] = useState<'equipment' | 'warmup'>();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([
    Equipment.NONE,
  ]);
  const sheetRef = useRef<BottomSheet>(null);

  const onCancel = () => {
    sheetRef.current?.close();
    setSelectedEquipment(equipment);
  };

  const onSave = () => {
    sheetRef.current?.close();
    setEquipmentAction(selectedEquipment);
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

  const getGoalString = (goal: Goal) => {
    return 'Improve my strength';
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FitnessGoal');
          }}
          style={{
            flex: 1,
            marginBottom: 5,
          }}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={200}
            resizeMode="cover"
            source={require('../../../images/3rd_carousel_image_fitness_testing.jpeg')}
            overlay
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Goal</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                right: 0,
                color: '#fff',
                marginRight: 20,
                fontWeight: 'bold',
              }}>
              {getGoalString(fitnessGoal)}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Icon name="chevron-right" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Experience');
          }}
          style={{
            flex: 1,
            marginBottom: 5,
          }}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={400}
            resizeMode="cover"
            source={require('../../../images/Fitness_testing_plank.jpeg')}
            overlay
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Exercise experience</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                right: 0,
                color: '#fff',
                marginRight: 20,
                fontWeight: 'bold',
              }}>
              {capitalizeFirstLetter(level)}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Icon name="chevron-right" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            sheetRef.current?.expand();
            setSetting('equipment');
          }}
          style={{
            flex: 1,
            marginBottom: 5,
          }}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={600}
            resizeMode="cover"
            source={require('../../../images/1st_Carousel_image_targeted_workouts.jpeg')}
            overlay
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Available Equipment</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                right: 0,
                color: '#fff',
                marginRight: 20,
                fontWeight: 'bold',
              }}>
              {availableEquipmentString()}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Icon name="chevron-right" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WarmUp');
          }}
          style={{
            flex: 1,
          }}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={800}
            resizeMode="cover"
            source={require('../../../images/Rate_the_app.jpeg')}
            overlay
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Warm-up & Cool-down</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                right: 0,
                color: '#fff',
                marginRight: 20,
                fontWeight: 'bold',
              }}>
              {warmUp.length + coolDown.length + ' selected'}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              right: 20,
              justifyContent: 'center',
            }}>
            <Icon name="chevron-right" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
        <Button
          text="Continue"
          onPress={() => {
            if (equipment.length) {
              setWorkoutAction([]);
              navigation.navigate('ExerciseList', {
                level: level,
                goal: fitnessGoal,
                equipment,
                warmUp,
                coolDown,
              });
            } else {
              Alert.alert('Sorry', 'Please specify equipment first');
            }
          }}
          style={{margin: 10}}
        />
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        enablePanDownToClose
        snapPoints={['80%']}
        index={-1}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.button,
            alignItems: 'center',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}>
          <TouchableOpacity onPress={onCancel}>
            <Text
              style={{
                color: colors.appBlue,
                padding: 10,
                fontWeight: 'bold',
              }}>
              CANCEL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Available Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave}>
            <Text
              style={{
                color: colors.appBlue,
                padding: 10,
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
              style={{padding: 10}}
              onPress={() => {
                selectedEquipment.length === Object.keys(Equipment).length
                  ? setSelectedEquipment([])
                  : setSelectedEquipment(Object.values(Equipment));
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  fontWeight: 'bold',
                  // fontSize: 20,
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
          {settings === 'equipment' && (
            <EquipmentMenu
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
          )}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  fitnessGoal: exercises.fitnessGoal,
  level: exercises.level,
  equipment: exercises.equipment,
  warmUp: exercises.warmUp,
  coolDown: exercises.coolDown,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
  setEquipmentAction: setEquipment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
