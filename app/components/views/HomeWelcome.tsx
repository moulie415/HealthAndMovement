import React from 'react';
import {View, Dimensions, ImageSourcePropType, Platform} from 'react-native';
import Carousel, {
  Pagination,
  ParallaxImage,
  // @ts-ignore
  AdditionalParallaxProps,
} from 'react-native-snap-carousel';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {viewedWelcome} from '../../actions/profile';
import {connect} from 'react-redux';
import globalStyles from '../../styles/globalStyles';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';

interface CarouselItem {
  title: string;
  description: string;
  image: ImageSourcePropType;
  icon: string;
}

const items: CarouselItem[] = [
  {
    title: 'Targeted Workouts',
    description:
      'Create custom workouts to target specific areas of the body and types of fitness.',
    image: require('../../images/1st_Carousel_image_targeted_workouts.jpeg'),
    icon: 'dumbbell',
  },
  {
    title: 'Track Progress',
    description: `Monitor your activity and track your fitness with your with ${
      Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
    }`,
    image: require('../../images/2nd_carousel_image_fitness_tracking.jpeg'),
    icon: 'chart-line',
  },
  {
    title: 'Test Fitness',
    description:
      'Measure fitness across 4 key areas, and get recommendations to improve',
    image: require('../../images/3rd_carousel_image_fitness_testing.jpeg'),
    icon: 'heartbeat',
  },
  {
    title: 'Quick routines',
    description:
      'select from a variety of exercise routines designed to target specific body parts',
    image: require('../../images/4th_carousel_image_quick_routine.jpeg'),
    icon: 'sync',
  },
];

const {width, height} = Dimensions.get('screen');
const HomeWelcome: React.FC<{setHasViewedWelcome: () => void}> = ({
  setHasViewedWelcome,
}) => {
  return (
    <Layout style={{flex: 1, marginVertical: '10%'}}>
      <Carousel
        layoutCardOffset={18}
        data={items}
        sliderWidth={width}
        itemWidth={width - DevicePixels[50]}
        hasParallaxImages
        // @ts-ignore
        renderItem={(
          {item, index}: {item: CarouselItem; index: number},
          parallaxProps?: AdditionalParallaxProps,
        ) => {
          return (
            <Layout
              style={[
                {
                  width: width - DevicePixels[50],
                  height: height / 2,
                  backgroundColor: '#fff',
                  borderRadius: DevicePixels[8],
                },
                globalStyles.boxShadow,
              ]}>
              <ParallaxImage
                containerStyle={{
                  flex: 1,
                  marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
                  backgroundColor: 'white',
                  borderTopLeftRadius: DevicePixels[8],
                  borderTopRightRadius: DevicePixels[8],
                }}
                style={{resizeMode: 'cover'}}
                parallaxFactor={0.1}
                source={item.image}
                {...parallaxProps}
              />
              <Pagination activeDotIndex={index} dotsLength={items.length} />
              <Divider />
              <Layout
                style={{
                  padding: DevicePixels[10],
                  borderBottomLeftRadius: DevicePixels[8],
                  borderBottomRightRadius: DevicePixels[8],
                }}>
                <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Icon
                    size={DevicePixels[20]}
                    name={item.icon}
                    color={colors.appBlack}
                    style={{textAlign: 'center'}}
                  /> */}
                  <Text category="h4" style={{flex: 1, textAlign: 'center'}}>
                    {item.title}
                  </Text>
                </Layout>
                <Text>{item.description}</Text>
                {index === items.length - 1 && (
                  <Button
                    onPress={setHasViewedWelcome}
                    // status="control"
                    style={{alignSelf: 'flex-end', margin: DevicePixels[5]}}>
                    Finish
                  </Button>
                )}
              </Layout>
            </Layout>
          );
        }}
      />
    </Layout>
  );
};

const mapDispatchToProps = {
  setHasViewedWelcome: viewedWelcome,
};

export default connect(null, mapDispatchToProps)(HomeWelcome);
