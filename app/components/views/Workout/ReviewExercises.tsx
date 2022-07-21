import {Divider, ListItem} from '@ui-kitten/components';
import React, {useCallback, useEffect, useState} from 'react';
import Image from 'react-native-fast-image';
import {TouchableOpacity, View} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import colors from '../../../constants/colors';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import Exercise from '../../../types/Exercise';
import ReviewExercisesProps from '../../../types/views/ReviewExercises';
import {truncate} from '../../../helpers';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {setWorkout} from '../../../actions/exercises';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../../helpers/DevicePixels';
import ShareModal from '../../commons/ShareModal';
import Button from '../../commons/Button';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import Text from '../../commons/Text';

const ReviewExercises: React.FC<ReviewExercisesProps> = ({
  workout,
  setWorkoutAction,
  navigation,
  profile,
  settings,
}) => {
  const {load, show, isLoaded, isClosed} = useInterstitialAd(
    UNIT_ID_INTERSTITIAL,
    {
      keywords: AD_KEYWORDS,
    },
  );

  useEffect(() => {
    if (settings.ads) {
      load();
    }
  }, [settings.ads, load]);

  useEffect(() => {
    if (isClosed && settings.ads) {
      load();
    }
  }, [isClosed, load, settings.ads]);

  useEffect(() => {
    if (isClosed) {
      navigation.navigate('StartWorkout');
    }
  }, [isClosed, navigation]);

  const renderItem = useCallback(
    ({item, index, drag, isActive}: RenderItemParams<Exercise>) => {
      return (
        <ListItem
          style={{backgroundColor: isActive ? colors.appBlue : undefined}}
          onLongPress={drag}
          title={item.name}
          onPress={() =>
            navigation.navigate('CustomizeExercise', {exercise: item})
          }
          description={truncate(item.description, 75)}
          accessoryLeft={() => (
            <Image
              style={{height: DevicePixels[50], width: DevicePixels[75]}}
              source={
                item.thumbnail
                  ? {uri: item.thumbnail.src}
                  : require('../../../images/old_man_stretching.jpeg')
              }
            />
          )}
        />
      );
    },
    [navigation],
  );

  return (
    <View style={{flex: 1}}>
      <Text style={{margin: DevicePixels[10], marginBottom: 0}}>
        Review exercises
      </Text>
      <Text style={{marginHorizontal: DevicePixels[10]}}>
        (Hold and drag to reorder)
      </Text>
      <DraggableFlatList
        data={workout}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={navigation.goBack}>
            <View
              style={{
                height: DevicePixels[50],
                width: DevicePixels[75],
                backgroundColor: colors.appBlue,
                marginLeft: DevicePixels[7],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="plus" color="#fff" size={DevicePixels[25]} />
            </View>
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: DevicePixels[10],
                color: colors.appBlue,
              }}>
              Add exercise
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        onDragEnd={({data}) => setWorkoutAction(data)}
      />
      <Button
        text="Start workout"
        onPress={() => {
          if (!profile.premium && isLoaded && settings.ads) {
            show();
          } else {
            navigation.navigate('StartWorkout');
          }
        }}
        style={{
          position: 'absolute',
          bottom: DevicePixels[30],
          left: DevicePixels[10],
          right: DevicePixels[10],
        }}
      />
      <ShareModal title="Share workout" type="workout" workout={workout} />
    </View>
  );
};

const mapStateToProps = ({exercises, profile, settings}: MyRootState) => ({
  workout: exercises.workout,
  profile: profile.profile,
  settings,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewExercises);
