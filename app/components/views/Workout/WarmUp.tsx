import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity, Switch} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {connect} from 'react-redux';
import {CoolDown, MyRootState, WarmUp} from '../../../types/Shared';
import Divider from '../../commons/Divider';
import ImageLoader from '../../commons/ImageLoader';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';
import { setCoolDown, setWarmUp } from '../../../reducers/exercises';

const WarmUpAndCoolDown: React.FC<{
  warmUp: WarmUp[];
  coolDown: CoolDown[];
  setWarmUpAction: (warmUp: WarmUp[]) => void;
  setCoolDownAction: (coolDown: CoolDown[]) => void;
}> = ({warmUp, coolDown, setWarmUpAction, setCoolDownAction}) => {
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
    1: true,
  });

  const toggleWarmUp = (item: WarmUp) => {
    setWarmUpAction(
      warmUp.includes(item)
        ? warmUp.filter(warmup => warmup !== item)
        : [...warmUp, item],
    );
  };

  const toggleCoolDown = (item: CoolDown) => {
    setCoolDownAction(
      coolDown.includes(item)
        ? coolDown.filter(cooldown => cooldown !== item)
        : [...coolDown, item],
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: !itemsCollapsed[0], 1: true});
          }}
          style={{flex: 1, marginBottom: 5}}>
          <ImageLoader
            source={require('../../../images/1st_Carousel_image_targeted_workouts.jpeg')}
            overlay
            style={{width: '100%', flex: 1}}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Warm-up</Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[0]}>
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.CIRCULATORY)}
            title="Circulatory Warm-up"
            description="Gradually elevating your heart rate will increase the amount of blood in
            your muscles and fluid in your joints, helping you get the most out of
            your training session. A brisk walk/jog or a light cycle until you’re
            sweating should suffice."
            accessoryRight={
              <Switch
                value={warmUp.includes(WarmUp.CIRCULATORY)}
                onValueChange={checked => toggleWarmUp(WarmUp.CIRCULATORY)}
              />
            }
          />
          <Divider />
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.SOFT_TISSUE)}
            title="Soft-tissue Preparation"
            description="Applying pressure to the major muscles in the body in the form of a foam
            roller or a similar myofascial release tool will help to soften muscular
            tension and decrease areas of stiffness.."
            accessoryRight={
              <Switch
                value={warmUp.includes(WarmUp.SOFT_TISSUE)}
                onValueChange={checked => toggleWarmUp(WarmUp.SOFT_TISSUE)}
              />
            }
          />
          <Divider />
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.DYNAMIC_STRETCHING)}
            title="Dynamic Stretching"
            description="Engaging in mobility drills can be a great way to introduce movement to
            muscles, ligaments and joints, and prepare your vascular and nervous
            system to meet the demands of the workout."
            accessoryRight={
              <Switch
                value={warmUp.includes(WarmUp.DYNAMIC_STRETCHING)}
                onValueChange={checked =>
                  toggleWarmUp(WarmUp.DYNAMIC_STRETCHING)
                }
              />
            }
          />
        </Collapsible>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: true, 1: !itemsCollapsed[1], 2: true});
          }}
          style={{flex: 1, marginBottom: 5}}>
          <ImageLoader
            source={require('../../../images/2nd_carousel_image_fitness_tracking.jpeg')}
            overlay
            style={{width: '100%', flex: 1}}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 20,
              justifyContent: 'center',
            }}>
            <Text style={[{color: '#fff'}]}>Cool-down</Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[1]}>
          <ListItem
            onPress={() => toggleCoolDown(CoolDown.CIRCULATORY)}
            title="Circulatory Cool-down"
            description="Engaging in activity similar to a warm-up such as a light walk or cycle
            will help safely bring your heart and breathing rate down to resting
            levels, and will also help to redistribute fluids that have accumulated
            during the workout."
            accessoryRight={
              <Switch
                value={coolDown.includes(CoolDown.CIRCULATORY)}
                onValueChange={checked => toggleCoolDown(CoolDown.CIRCULATORY)}
              />
            }
          />
          <Divider />
          <ListItem
            onPress={() => toggleCoolDown(CoolDown.STATIC_STRETCHING)}
            title="Static Stretching"
            description="Stretching after a workout can help to give your muscles that loose
            feeling and improve your movement by reducing areas that feel tight and
            restricted.."
            accessoryRight={
              <Switch
                value={coolDown.includes(CoolDown.STATIC_STRETCHING)}
                onValueChange={checked =>
                  toggleCoolDown(CoolDown.STATIC_STRETCHING)
                }
              />
            }
          />
        </Collapsible>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  warmUp: exercises.warmUp,
  coolDown: exercises.coolDown,
});

const mapDispatchToProps = {
  setWarmUpAction: setWarmUp,
  setCoolDownAction: setCoolDown,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarmUpAndCoolDown);
