import React from 'react';
import styles from '../../styles/views/FitnessTesting';
import FitnessTestingProps from '../../types/views/FitnessTesting';
import {TouchableOpacity, View, Image} from 'react-native';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {Layout, Text} from '@ui-kitten/components';
import globalStyles from '../../styles/globalStyles';
import ImageLoader from '../commons/ImageLoader';

const FitnessTesting: React.FC<FitnessTestingProps> = ({navigation, tests}) => {
  return (
    <Layout style={{flex: 1}}>
      <Layout style={{flex: 1}}>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            resizeMode="cover"
            source={require('../../images/strength.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, margin: 5}}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Strength
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={300}
            resizeMode="cover"
            source={require('../../images/balance.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 5}}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Balance
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={600}
            resizeMode="cover"
            source={require('../../images/cardio.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, margin: 5}}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Cardio
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={900}
            resizeMode="cover"
            source={require('../../images/flexibility.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 5}}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Flexibility
            </Text>
          </View>
        </TouchableOpacity>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(FitnessTesting);
