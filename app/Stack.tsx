import React, {FunctionComponent} from 'react';
import {StackParamList} from './App';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Premium from './components/views/More/Premium';
import Loading from './components/views/Loading';
import ExerciseList from './components/views/Workout/ExerciseList';
import CustomizeExercise from './components/views/Workout/CustomizeExercise';
import ExerciseListHeaderRight from './components/commons/ExerciseListHeaderRight';
import ReviewExercises from './components/views/Workout/ReviewExercises';
import StartWorkout from './components/views/Workout/StartWorkout';
import EndWorkout from './components/views/Workout/EndWorkout';
import WorkoutSummary from './components/views/Workout/WorkoutSummary';
import Policies from './components/views/More/Policies';
import Test from './components/views/Tests/Test';
import QuickRoutines from './components/views/QuickRoutines/QuickRoutines';
import QuickRoutineView from './components/views/QuickRoutines/QuickRoutine';
import TestResults from './components/views/Tests/TestResults';
import Tabs from './Tabs';
import QuickRoutinesTabs from './QuickRoutinesTabs';
import Login from './components/views/Login';
import SignUp from './components/views/SignUp';
import Welcome from './components/views/Welcome';
import Profile from './components/views/More/Profile';
import Notifications from './components/views/More/Notifications';
import Support from './components/views/More/Support';
import Terms from './components/views/More/Terms';
import Settings from './components/views/More/Settings';
import About from './components/views/More/About';
import SignUpFlow from './components/views/SignUpFlow';
import SavedItemsTabs from './SavedItemsTabs';
import EndQuickRoutine from './components/views/QuickRoutines/EndQuickRoutine';
import QuickRoutineSummary from './components/views/QuickRoutines/QuickRoutineSummary';
import HeaderShareButton from './components/commons/HeaderShareButton';
import ForgotPassword from './components/views/ForgotPassword';
import DeleteAccount from './components/views/DeleteAccount';
import EducationTabs from './EducationTabs';
import EducationArticle from './components/views/Education/EducationArticle';
import FitnessGoal from './components/views/Workout/FitnessGoal';
import Experience from './components/views/Workout/Experience';
import WarmUp from './components/views/Workout/WarmUp';
import Connections from './components/views/More/Connections';
import AddConnection from './components/views/More/AddConnection';
import AddConnectionButton from './components/commons/AddConnectionButton';
import Chat from './components/views/More/Chat';
import {TouchableOpacity} from 'react-native';
import Text from './components/commons/Text';
import colors from './constants/colors';
import DevicePixels from './helpers/DevicePixels';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Stack = createNativeStackNavigator<StackParamList>();

const StackComponent: FunctionComponent = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={({route, navigation}) => ({
          headerBackTitle: null,
        })}>
        <Stack.Group>
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            options={{headerTitle: 'Forgot Password'}}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            name="DeleteAccount"
            component={DeleteAccount}
            options={{headerTitle: 'Delete Account'}}
          />
          <Stack.Screen
            name="SignUpFlow"
            component={SignUpFlow}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="FitnessGoal"
            component={FitnessGoal}
            options={{headerTitle: 'Fitness Goal'}}
          />
          <Stack.Screen
            name="Experience"
            component={Experience}
            options={{headerTitle: 'Exercise experience'}}
          />
          <Stack.Screen
            name="WarmUp"
            component={WarmUp}
            options={{headerTitle: 'Warm-up & Cool-down'}}
          />
          <Stack.Screen
            name="ExerciseList"
            component={ExerciseList}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerRight: () => (
                <ExerciseListHeaderRight navigation={navigation} />
              ),
            })}
          />
          <Stack.Screen
            name="ReviewExercises"
            component={ReviewExercises}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerRight: () => <HeaderShareButton />,
            })}
          />
          <Stack.Screen
            name="CustomizeExercise"
            component={CustomizeExercise}
            options={() => ({
              headerTitle: 'Workout',
            })}
          />
          <Stack.Screen
            name="StartWorkout"
            component={StartWorkout}
            options={({navigation}) => ({
              headerTitle: 'Workout',
            })}
          />
          <Stack.Screen
            name="EndWorkout"
            component={EndWorkout}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerLeft: null,
            })}
          />
          <Stack.Screen
            name="WorkoutSummary"
            component={WorkoutSummary}
            options={({navigation}) => ({
              headerTitle: 'Workout',
              headerLeft: null,
            })}
          />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Education" component={EducationTabs} />
          <Stack.Screen
            name="EducationArticle"
            component={EducationArticle}
            options={{headerTitle: ''}}
          />
          <Stack.Screen name="Policies" component={Policies} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen
            name="TestResults"
            component={TestResults}
            options={({navigation}) => ({
              headerTitle: '',
            })}
          />
          <Stack.Screen
            name="QuickRoutines"
            component={QuickRoutines}
            options={({navigation}) => ({
              headerTitle: 'Quick Routines',
            })}
          />
          <Stack.Screen
            name="QuickRoutinesTabs"
            component={QuickRoutinesTabs}
            options={({navigation}) => ({
              headerTitle: 'Quick Routines',
            })}
          />
          <Stack.Screen
            name="QuickRoutine"
            component={QuickRoutineView}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="EndQuickRoutine"
            component={EndQuickRoutine}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="QuickRoutineSummary"
            component={QuickRoutineSummary}
            options={({navigation}) => ({
              headerTitle: 'Quick Routine',
            })}
          />
          <Stack.Screen
            name="SavedItems"
            component={SavedItemsTabs}
            options={{headerTitle: ''}}
          />
          <Stack.Screen
            name="Connections"
            component={Connections}
            options={({navigation}) => ({
              headerRight: () => (
                <AddConnectionButton navigation={navigation} />
              ),
            })}
          />
          <Stack.Screen
            name="AddConnection"
            options={{headerTitle: 'Add Connection'}}
            component={AddConnection}
          />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="Premium"
            component={Premium}
            options={({navigation}) => ({
              headerLeft: () => (
                <TouchableOpacity
                  style={{padding: DevicePixels[10]}}
                  onPress={() => navigation.goBack()}>
                  <Text style={{color: colors.appBlue}}>Cancel</Text>
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export default StackComponent;
