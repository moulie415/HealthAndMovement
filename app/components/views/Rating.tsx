import {View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

import StarRating from 'react-native-star-rating';
import {rateApp} from '../../helpers';
import Button from '../commons/Button';
import Input from '../commons/Input';
import Snackbar from 'react-native-snackbar';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import * as api from '../../helpers/api';
import {logError} from '../../helpers/error';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../commons/Header';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../constants/colors';

const Rating: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Rating'>;
  profile: Profile;
}> = ({navigation, profile}) => {
  const [rating, setRating] = useState<number>();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <FastImage
        source={require('../../images/upper_body.jpeg')}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          height: '50%',
          left: 0,
          right: 0,
        }}
      />
      <Header hasBack absolute />
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              padding: 20,
              paddingTop: 40,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: colors.appGrey,
              height: 450,
            }}>
            <StarRating
              containerStyle={{marginHorizontal: 40}}
              fullStarColor="#FFC24C"
              emptyStarColor="#6a4f1f"
              rating={rating}
              selectedStar={star => {
                setRating(star);
              }}
            />
            <Input
              placeholder="Give us feedback here (optional)"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={{
                height: 200,
                marginVertical: 20,
                textAlignVertical: 'top',
              }}
            />
            <Button
              style={{margin: 10}}
              onPress={async () => {
                setLoading(true);
                if (rating && rating > 3) {
                  rateApp();
                } else {
                }
                navigation.goBack();
                Snackbar.show({text: 'Thank you!'});
                try {
                  if (rating) {
                    await api.sendFeedback(feedback, rating);
                  }
                } catch (e) {
                  logError(e);
                }
              }}
              text="Submit"
              loading={loading}
              disabled={!rating || loading}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Rating);
