import {View, TouchableOpacity, Dimensions} from 'react-native';
import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import colors from '../../constants/colors';
import Text from './Text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Goal, Level, MyRootState} from '../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {getWeeklyItems} from '../../actions/profile';
import {WeeklyItems} from '../../reducers/profile';
import QuickRoutine from '../../types/QuickRoutines';
import Tile from './Tile';
import {ScrollView} from 'react-native-gesture-handler';
import Dumbbell from '../../images/dumbbell.svg';
import Time from '../../images/time.svg';
import Fire from '../../images/fire.svg';
import {SvgProps} from 'react-native-svg';
import {getGoalsData} from '../../helpers/goals';
import {SettingsState} from '../../reducers/settings';

interface GoalSet {
  title: string;
  key: string;
  goal: number;
  score: number;
  icon: React.FC<SvgProps>;
}

const GoalCircle: React.FC<{
  title: string;
  goal: number;
  score: number;
  icon: React.FC<SvgProps>;
}> = ({title, goal, score, icon: Icon}) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    setFill((100 / goal) * score);
  }, [setFill, goal, score]);
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexBasis: '50%',
        marginBottom: 10,
      }}>
      <AnimatedCircularProgress
        style={{alignSelf: 'center'}}
        size={80}
        width={9}
        backgroundWidth={7}
        fill={fill}
        tintColor={score >= goal ? colors.appGreen : colors.appBlue}
        // tintColorSecondary={colors.appBlueFaded}
        backgroundColor={colors.textGrey}
        arcSweepAngle={240}
        rotation={240}
        lineCap="round">
        {fill => <Icon />}
      </AnimatedCircularProgress>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 14,
          textAlign: 'center',
          alignSelf: 'center',
          marginTop: -10,
        }}>
        {`${score}/${goal}`}
      </Text>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 12,
          width: 150,
          marginHorizontal: 10,
          textAlign: 'center',
          alignSelf: 'center',
          marginBottom: 5,
          marginTop: 5,
        }}>
        {title}
      </Text>
    </View>
  );
};

const GoalSummaries: React.FC<{
  profile: Profile;
  getWeeklyItemsAction: () => void;
  weeklyItems: WeeklyItems;
  quickRoutinesObj: {[key: string]: QuickRoutine};
  settings: SettingsState;
}> = ({
  profile,
  getWeeklyItemsAction,
  weeklyItems,
  quickRoutinesObj,
  settings,
}) => {
  useEffect(() => {
    getWeeklyItemsAction();
  }, [getWeeklyItemsAction]);

  const {
    calories,
    mins,
    workoutLevelScore,
    caloriesGoal,
    workoutGoal,
    minsGoal,
    workoutLevelTitleString,
  } = getGoalsData(
    profile.goal || Goal.ACTIVE,
    weeklyItems,
    quickRoutinesObj,
    settings,
  );

  const goals: GoalSet[] = [
    {
      title: 'Minutes spent training',
      key: 'mins',
      goal: minsGoal,
      score: mins,
      icon: Time,
    },
    {
      title: `${workoutLevelTitleString} workouts completed`,
      key: 'workoutLevel',
      icon: () => (
        <Icon
          name="tachometer-alt"
          size={25}
          color={colors.button}
          style={{
            marginHorizontal: 15,
          }}
        />
      ),
      score: workoutLevelScore,
      goal: workoutGoal,
    },
    {
      title: 'Calories burned',
      key: 'calories',
      goal: caloriesGoal,
      score: Math.round(calories),
      icon: Fire,
    },
  ];

  return (
    <Tile
      style={{
        width: Dimensions.get('window').width - 40,
        marginBottom: 20,
        alignSelf: 'center',
        padding: 10,
      }}>
      <Text
        style={{
          color: colors.appWhite,
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
          marginVertical: 10,
        }}>
        Weekly Targets
      </Text>
      <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
        {goals.map(({goal, score, title, key, icon}) => {
          return (
            <GoalCircle
              title={title}
              key={key}
              icon={icon}
              goal={goal}
              score={score}
            />
          );
        })}
      </View>
    </Tile>
  );
};

const mapStateToProps = ({profile, quickRoutines, settings}: MyRootState) => ({
  profile: profile.profile,
  weeklyItems: profile.weeklyItems,
  quickRoutinesObj: quickRoutines.quickRoutines,
  settings,
});

const mapDispatchToProps = {
  getWeeklyItemsAction: getWeeklyItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummaries);
