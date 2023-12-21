import React, {useEffect} from 'react';
import moment from 'moment';
import colors from '../../../constants/colors';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {Alert, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import useThrottle from '../../../hooks/UseThrottle';
import Table from '../../commons/Table';
import PercentileTable from '../../commons/PercentileTable';
import {keyHasValue} from '../../../helpers/table';
import TestResultText from './TestResultText';
import Divider from '../../commons/Divider';
import Profile from '../../../types/Profile';
import {SavedTest} from '../../../types/SavedItem';
import Test from '../../../types/Test';
import Modal from '../../commons/Modal';

const TestResultsModal: React.FC<{
  profile: Profile;
  test: Test;
  testResult?: number;
  seconds: number;
  visible: boolean;
  onRequestClose: () => void;
}> = ({profile, testResult, seconds, test, visible, onRequestClose}) => {
  // const table = profile.gender === 'male' ? test.mens : test.womens;
  const age = profile.dob && moment().diff(profile.dob, 'years');

  const gender = profile.gender;

  const noGender = !gender;

  const showMens = gender === 'male';

  const showWomens = gender === 'female';

  const score = testResult || seconds;

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '95%',
          borderRadius: 10,
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 22,
            fontWeight: 'bold',
            padding: 10,
            textAlign: 'center',
          }}>
          Compare result
        </Text>
        <View>
          <View style={{padding: 10, paddingTop: 0}}>
            {showMens &&
              test.mens &&
              'age' in test.mens &&
              keyHasValue(test.mens, 'age') && (
                <Table
                  score={score}
                  table={test.mens}
                  metric={test.metric}
                  title="Mens table"
                />
              )}
            {showWomens &&
              test.womens &&
              'age' in test.womens &&
              keyHasValue(test.womens, 'age') && (
                <Table
                  score={score}
                  table={test.womens}
                  metric={test.metric}
                  title="Women's table"
                />
              )}
            {showMens &&
              test.mens &&
              '10th' in test.mens &&
              test.mens['10th'] && (
                <PercentileTable
                  score={score}
                  table={test.mens}
                  title="Mens percentile table"
                />
              )}
            {showWomens &&
              test.womens &&
              '10th' in test.womens &&
              test.womens['10th'] && (
                <PercentileTable
                  score={score}
                  table={test.womens}
                  title="Women's percentile table"
                />
              )}
          </View>

          <Divider style={{marginBottom: 10}} />

          {!noGender && test.mens && test.womens && (
            <TestResultText
              table={showMens ? test.mens : test.womens}
              score={score}
            />
          )}
        </View>

        <Button text="Close" style={{marginTop: 20}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: MyRootState) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps)(TestResultsModal);
