import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StackParamList} from './App';
import colors from './constants/colors';
import Home from './components/views/Home';
import FitnessTesting from './components/views/Tests/FitnessTesting';
import More from './components/views/More/More';
import MoreIcon from './components/commons/unread/MoreIcon';
import Plan from './components/views/Plan/Plan';
import WhatEquipment from './components/views/Workout/WhatEquipment';
import {connect} from 'react-redux';
import {MyRootState} from './types/Shared';
import Profile from './types/Profile';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import {AttachStep} from '@stackbuilders/react-native-spotlight-tour';
import {View, TouchableOpacity} from 'react-native';
import DevicePixels from './helpers/DevicePixels';

const Tab = createBottomTabNavigator<StackParamList>();

const color = new Color(colors.appWhite);

const Tabs: React.FC<{
  profile: Profile;
  plansEnabled: boolean;
  startTour: () => void;
}> = ({profile, plansEnabled, startTour}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.appWhite,
        tabBarInactiveTintColor: color.darken(0.4).toString(),
        tabBarStyle: {borderTopWidth: 0, backgroundColor: colors.appGrey},
        lazy: false,
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="home" />
          ),
          headerShown: false,
        }}
        name="Home"
        key="Home"
        children={props => <Home {...props} startTour={startTour} />}
      />
      {(profile.admin || plansEnabled) && (
        <Tab.Screen
          options={{
            tabBarLabel: 'Plan',
            tabBarIcon: ({color, size}) => (
              <Icon color={color} size={size} name="calendar-alt" />
            ),
            headerShown: false,
          }}
          name="Plan"
          key="Plan"
          component={Plan}
        />
      )}
      <Tab.Screen
        options={{
          tabBarLabel: 'Workout',
          tabBarButton: props => (
            <AttachStep index={0}>
              <TouchableOpacity {...props} activeOpacity={1} />
            </AttachStep>
          ),
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="dumbbell" />
          ),
          headerShown: false,
        }}
        name="Workout"
        key="Workout"
        component={WhatEquipment}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({color, size}) => (
            <Icon color={color} size={size} name="heartbeat" />
          ),
          headerShown: false,
        }}
        key="Fitness"
        name="Fitness"
        component={FitnessTesting}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color, size}) => <MoreIcon color={color} size={size} />,
          headerShown: false,
        }}
        key="More"
        name="More"
        component={More}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  profile: profile.profile,
  plansEnabled: settings.plansEnabled,
});

export default connect(mapStateToProps)(Tabs);
