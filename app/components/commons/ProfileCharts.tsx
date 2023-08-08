import {View, Dimensions, TouchableOpacity, Alert} from 'react-native';
import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {PERCENTAGES} from '../../constants';
import colors from '../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState, Sample} from '../../types/Shared';
import {getSamples} from '../../actions/profile';
import {getBMIItems, getSampleItems} from '../../helpers';
import Button from './Button';
import MetricExplained from './MetricExplained';
import Color from 'color';
import Modal from './Modal';
import ReanimatedGraph, {
  ReanimatedGraphPublicMethods,
} from '@birdwingo/react-native-reanimated-graph';

const Chart: React.FC<{
  title: string;
  current?: number;
  suffix?: string;
  minY?: number;
  maxY?: number;
  ranges: number[];
  colors: string[];
  labels: string[];
  y: number[];
  x: number[];
  onPress?: () => void;
}> = ({
  title,
  current,
  minY,
  maxY,
  suffix,
  ranges,
  colors: colorsArr,
  labels,
  onPress,
  x,
  y,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const graphRef = useRef<ReanimatedGraphPublicMethods>(null);

  useEffect(() => {
    const updateGraphData = () => {
      // Call this function to update the data displayed on the graph
      if (graphRef.current) {
        graphRef.current.updateData({xAxis: x, yAxis: y});
      }
    };
    updateGraphData();
  }, [x, y]);
  const data = {
    // Your data points here
    xAxis: [0, 1, 2, 3, 4],
    yAxis: [0, 5, 2, 7, 4],
  };

  console.log(title, x, y);

  return (
    <>
      <View style={{alignItems: 'center'}}>
        <MetricExplained
          onPress={onPress}
          onPressViewHistorical={() => setModalVisible(true)}
          suffix={suffix}
          current={current}
          ranges={
            minY !== undefined && !!maxY && !!ranges
              ? [minY, ...ranges, maxY]
              : []
          }
          title={title}
          colors={colorsArr}
          labels={labels}
        />
      </View>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.appGrey,

            width: '90%',
            padding: 20,
          }}>
          <View style={{height: 200, flex: 1}}>
            <ReanimatedGraph
              containerStyle={{backgroundColor: colors.appGrey}}
              ref={graphRef}
              xAxis={data.xAxis}
              yAxis={data.yAxis}
              height={200}

              // Add any other props as needed
            />
          </View>
          <Button text="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

const ProfileCharts: React.FC<{
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneMassSamples: Sample[];
  setShowBodyFatPercentageModal: (show: boolean) => void;
  setShowMuscleMassModal: (show: boolean) => void;
  setShowBoneMassModal: (show: boolean) => void;
  setShowWeightModal: (show: boolean) => void;
  setShowHeightModal: (show: boolean) => void;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
}> = ({
  weightSamples,
  heightSamples,
  bodyFatPercentageSamples,
  muscleMassSamples,
  boneMassSamples,
  setShowBodyFatPercentageModal,
  setShowBoneMassModal,
  setShowMuscleMassModal,
  weight,
  height,
  bodyFatPercentage,
  muscleMass,
  boneMass,
  setShowHeightModal,
  setShowWeightModal,
}) => {
  const [filter, setFilter] = useState<6 | 30 | 365>(6);
  const [showCharts, setShowCharts] = useState(true);

  const weightItems: {
    x: number[];
    y: number[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getBMIItems(weight, height, weightSamples, heightSamples, filter);
  }, [weightSamples, weight, height, heightSamples, filter]);

  const bodyFatItems: {
    x: number[];
    y: number[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(bodyFatPercentage, filter, bodyFatPercentageSamples);
  }, [bodyFatPercentageSamples, filter, bodyFatPercentage]);

  const muscleMassItems: {
    x: number[];
    y: number[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(muscleMass, filter, muscleMassSamples);
  }, [muscleMassSamples, filter, muscleMass]);

  const boneMassItems: {
    x: number[];
    y: number[];
    lowest: number;
    highest: number;
  } = useMemo(() => {
    return getSampleItems(boneMass, filter, boneMassSamples);
  }, [boneMassSamples, filter, boneMass]);

  const latestBMI = weightItems?.y[weightItems.y.length - 1];

  return (
    <>
      <Chart
        x={weightItems.x}
        y={weightItems.y}
        current={latestBMI}
        title="BMI"
        minY={0}
        maxY={40}
        ranges={[18.5, 25.0, 30.0]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          colors.secondaryLight,
          colors.appRed,
        ]}
        labels={['Underweight', 'Normal', 'Overweight', 'Obesity']}
        onPress={() =>
          Alert.alert(
            'BMI',
            'Update your weight and height to determine your new BMI',
          )
        }
      />

      <Chart
        x={bodyFatItems.x}
        y={bodyFatItems.y}
        current={bodyFatPercentage}
        title="Body fat percentage"
        minY={0}
        maxY={30}
        ranges={[6.0, 13.0, 17.0, 25.0]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          colors.appBlueLight,
          colors.muscleSecondary,
          colors.appRed,
        ]}
        labels={[
          'Essential Fat',
          'Athletes',
          'Fitness',
          'Acceptable',
          'Obesity',
        ]}
        suffix="%"
        onPress={() => setShowBodyFatPercentageModal(true)}
      />
      <Chart
        x={muscleMassItems.x}
        y={muscleMassItems.y}
        current={muscleMass}
        minY={0}
        maxY={70}
        title="Muscle mass"
        suffix="kg"
        ranges={[44.0, 52.4]}
        colors={[
          colors.appBlueDark,
          colors.appGreen,
          new Color(colors.appGreen).darken(0.4).toString(),
        ]}
        onPress={() => setShowMuscleMassModal(true)}
        labels={['Low', 'Normal', 'High']}
      />
      <Chart
        x={boneMassItems.x}
        y={boneMassItems.y}
        current={boneMass}
        title="Bone mass"
        suffix="kg"
        minY={0}
        maxY={10}
        ranges={[2.09, 3.48]}
        colors={[
          colors.secondaryLight,
          colors.appGreen,
          new Color(colors.appGreen).darken(0.4).toString(),
        ]}
        onPress={() => setShowBoneMassModal(true)}
        labels={['Below average', 'Average', 'Above average']}
      />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
  bodyFatPercentageSamples: profile.bodyFatPercentageSamples,
  muscleMassSamples: profile.muscleMassSamples,
  boneMassSamples: profile.boneMassSamples,
});

export default connect(mapStateToProps)(ProfileCharts);
