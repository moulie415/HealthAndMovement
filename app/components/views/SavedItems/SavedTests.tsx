import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect} from 'react';
import {Alert, View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {getSavedTests} from '../../../actions/tests';
import {SavedTest} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Test from '../../../types/Test';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';

type SavedItemsNavigationProp = StackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedTests: FunctionComponent<{
  loading: boolean;
  savedTests: {[key: string]: SavedTest};
  getSavedTestsAction: () => void;
  tests: {[key: string]: Test};
  navigation: SavedItemsNavigationProp;
}> = ({loading, savedTests, getSavedTestsAction, tests, navigation}) => {
  useEffect(() => {
    getSavedTestsAction();
  }, [getSavedTestsAction]);
  return (
    <Layout>
      <List
        data={Object.values(savedTests)}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const test = tests[item.testId];
          return (
            <ListItem
              onPress={() =>
                Alert.alert('Retry test?', '', [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Yes',
                    onPress: () => {
                      navigation.navigate('Test', {id: item.testId});
                    },
                  },
                ])
              }
              title={`${test.name} - ${moment(item.createddate).format(
                'MMMM Do YYYY',
              )}`}
              description={''}
              accessoryLeft={() => (
                <ImageOverlay
                  containerStyle={{
                    height: DevicePixels[75],
                    width: DevicePixels[75],
                  }}
                  overlayAlpha={0.4}
                  source={require('../../../images/old_man_stretching.jpeg')}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: DevicePixels[12]}}>
                      {'Duration '}
                    </Text>
                    <Text category="h6" style={{color: '#fff'}}>
                      {item.seconds
                        ? moment()
                            .utc()
                            .startOf('day')
                            .add({seconds: item.seconds})
                            .format('mm:ss')
                        : 'N/A'}
                    </Text>
                  </View>
                </ImageOverlay>
              )}
            />
          );
        }}
      />
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

const mapStateToProps = ({exercises, tests}: MyRootState) => ({
  loading: exercises.loading,
  savedTests: tests.savedTests,
  tests: tests.tests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedTests);
