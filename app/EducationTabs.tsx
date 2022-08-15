import React, {useState} from 'react';
import General from './components/views/Education/General';
import Exercise from './components/views/Education/Exercise';
import Nutritional from './components/views/Education/Nutritional';
import {
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './components/commons/Header';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import colors from './constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import DevicePixels from './helpers/DevicePixels';
import Text from './components/commons/Text';
import {ScrollView} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from './App';

const EducationTabs: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({navigation}) => {
  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    general: () => <General navigation={navigation} />,
    exercise: () => <Exercise navigation={navigation} />,
    nutritional: () => <Nutritional navigation={navigation} />,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'general', title: 'General Lifestyle'},
    {key: 'exercise', title: 'Exercise Articles'},
    {key: 'nutritional', title: 'Nutritional Info'},
  ]);
  return (
    <ImageBackground
      source={require('./images/old-black-background-grunge.png')}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Education" />
        <TabView
          renderTabBar={props => {
            return (
              <ScrollView horizontal style={{flexGrow: 0}}>
                <TabBar
                  {...props}
                  renderTabBarItem={props => {
                    return (
                      <TouchableOpacity onPress={props.onPress}>
                        <LinearGradient
                          colors={
                            props.key === routes[index].key
                              ? [colors.appBlueLight, colors.appBlueDark]
                              : ['transparent', 'transparent']
                          }
                          style={{
                            height: DevicePixels[45],
                            paddingHorizontal: DevicePixels[20],
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: DevicePixels[25],
                          }}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: '#fff',
                              textAlign: 'center',
                            }}>
                            {props.route?.title}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  }}
                  labelStyle={{textTransform: 'none', color: colors.appBlack}}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  contentContainerStyle={{marginBottom: DevicePixels[20]}}
                  indicatorStyle={{backgroundColor: 'transparent'}}
                />
              </ScrollView>
            );
          }}
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default EducationTabs;
