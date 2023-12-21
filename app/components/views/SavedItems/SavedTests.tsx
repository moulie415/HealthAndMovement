import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Alert, FlatList, View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {SavedTest} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import SavedTestCard from '../../commons/SavedTestCard';
import {getSavedTests} from '../../../reducers/tests';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedTests: FunctionComponent<{
  loading: boolean;
  savedTests: {[key: string]: SavedTest};
  getSavedTestsAction: () => void;
  navigation: SavedItemsNavigationProp;
}> = ({loading, savedTests, getSavedTestsAction, navigation}) => {
  useEffect(() => {
    getSavedTestsAction();
  }, [getSavedTestsAction]);

  return (
    <>
      <View>
        <FlatList
          data={Object.values(savedTests).sort(
            (a, b) => moment(b).valueOf() - moment(a).valueOf(),
          )}
          keyExtractor={item => item.id || ''}
          renderItem={({item}) => {
            return <SavedTestCard item={item} navigation={navigation} />;
          }}
        />
      </View>
    </>
  );
};

const mapStateToProps = ({exercises, tests}: MyRootState) => ({
  loading: exercises.loading,
  savedTests: tests.savedTests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedTests);
