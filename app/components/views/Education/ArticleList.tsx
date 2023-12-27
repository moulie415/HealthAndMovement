import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';

import Education from '../../../types/Education';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SettingsState} from '../../../reducers/settings';
import EducationCard from '../../commons/EducationCard';

const ArticleList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
  profile: Profile;
  filtered: Education[];
  loading: boolean;
  settings: SettingsState;
}> = ({navigation, profile, filtered, loading, settings}) => {
  const onPress = useCallback(
    (item?: Education) => {
      if (item) {
        if (!profile.premium && item.premium) {
          navigation.navigate('Premium', {});
        } else {
          navigation.navigate('EducationArticle', {education: item});
        }
      }
    },
    [profile.premium, navigation],
  );
  return filtered.length ? (
    <FlatList
      data={filtered}
      renderItem={({item}) => {
        return <EducationCard item={item} onPress={onPress} />;
      }}
    />
  ) : (
    <AbsoluteSpinner loading />
  );
};

const mapStateToProps = ({profile, education, settings}: MyRootState) => ({
  profile: profile.profile,
  loading: education.loading,
  settings,
});

export default connect(mapStateToProps)(ArticleList);
