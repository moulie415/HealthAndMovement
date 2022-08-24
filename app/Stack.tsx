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
import QuickRoutineView from './components/views/QuickRoutines/QuickRoutine';
import TestResults from './components/views/Tests/TestResults';
import Tabs from './Tabs';
import Login from './components/views/Login';
import SignUp from './components/views/SignUp';
import Profile from './components/views/More/Profile';
import Notifications from './components/views/More/Notifications';
import Support from './components/views/More/Support';
import Terms from './components/views/More/Terms';
import Settings from './components/views/More/Settings';
import About from './components/views/More/About';
import SignUpFlow from './components/views/SignUpFlow/SignUpFlow';
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
import Rating from './components/views/Rating';
import WorkoutList from './components/views/Workout/WorkoutList';
import WhatArea from './components/views/Workout/WhatArea';
import PreQuickRoutine from './components/views/QuickRoutines/PreQuickRoutine';
import PreWorkout from './components/views/Workout/PreWorkout';

const Stack = createNativeStackNavigator<StackParamList>();

const StackComponent: FunctionComponent = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={({route, navigation}) => ({
          headerBackTitle: null,
          headerShown: false,
        })}>
        <Stack.Group>
          <Stack.Screen name="Loading" component={Loading} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
          <Stack.Screen name="SignUpFlow" component={SignUpFlow} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="FitnessGoal" component={FitnessGoal} />
          <Stack.Screen name="Experience" component={Experience} />
          <Stack.Screen name="WarmUp" component={WarmUp} />
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
          />
          <Stack.Screen name="PreWorkout" component={PreWorkout} />
          <Stack.Screen name="StartWorkout" component={StartWorkout} />
          <Stack.Screen name="EndWorkout" component={EndWorkout} />
          <Stack.Screen name="WorkoutSummary" component={WorkoutSummary} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Education" component={EducationTabs} />
          <Stack.Screen name="EducationArticle" component={EducationArticle} />
          <Stack.Screen name="Policies" component={Policies} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen name="TestResults" component={TestResults} />
          <Stack.Screen name="PreQuickRoutine" component={PreQuickRoutine} />
          <Stack.Screen name="QuickRoutine" component={QuickRoutineView} />
          <Stack.Screen name="EndQuickRoutine" component={EndQuickRoutine} />
          <Stack.Screen
            name="QuickRoutineSummary"
            component={QuickRoutineSummary}
          />

          <Stack.Screen name="SavedItems" component={SavedItemsTabs} />
          <Stack.Screen name="Connections" component={Connections} />
          <Stack.Screen name="AddConnection" component={AddConnection} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="WhatArea" component={WhatArea} />
          <Stack.Screen name="WorkoutList" component={WorkoutList} />
          <Stack.Screen name="Premium" component={Premium} />
          <Stack.Screen name="Rating" component={Rating} />
        </Stack.Group>
        {/* <Stack.Group screenOptions={{presentation: 'modal'}}></Stack.Group> */}
      </Stack.Navigator>
    </>
  );
};

export default StackComponent;
