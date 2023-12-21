import React, {useEffect, useState} from 'react';
import {ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Purchases, {
  PACKAGE_TYPE,
  CustomerInfo,
  PurchasesPackage,
  PurchasesEntitlementInfo,
} from 'react-native-purchases';
import colors from '../../../constants/colors';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {logError} from '../../../helpers/error';
import Text from '../../commons/Text';
import Header from '../../commons/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {FlatList} from 'react-native';
import PremiumProduct from '../../commons/PremiumProduct';
import {SettingsState} from '../../../reducers/settings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import Profile from '../../../types/Profile';
import {navigationRef} from '../../../RootNavigation';
import Button from '../../commons/Button';
import {setPremium} from '../../../reducers/profile';

const Premium: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Premium'>;
  setPremiumAction: (
    premium: false | {[key: string]: PurchasesEntitlementInfo},
  ) => void;
  settings: SettingsState;
  route: RouteProp<StackParamList, 'Premium'>;
  profile: Profile;
}> = ({navigation, setPremiumAction, settings, route, profile}) => {
  const [selected, setSelected] = useState('');
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [info, setInfo] = useState<CustomerInfo>();
  const [loading, setLoading] = useState(false);
  const onActivated = route.params?.onActivated;
  useEffect(() => {
    const getOfferings = async () => {
      try {
        const purchaserInfo = await Purchases.getCustomerInfo();
        setInfo(purchaserInfo);
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          // offerings.current.availablePackages.forEach(pkg => {
          //   console.log(pkg.product.productCategory);
          // });
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        // @ts-ignore
        Alert.alert('Error fetching Premium offerings', e.message);
        logError(e);
      }
    };
    getOfferings();
  }, []);

  useEffect(() => {
    if (packages && packages.length) {
      const initialSelected = packages[0]?.identifier;
      if (initialSelected) {
        setSelected(initialSelected);
      }
    }
  }, [packages]);

  const onPurchase = async (p?: PurchasesPackage) => {
    if (p) {
      try {
        setLoading(true);
        const {customerInfo, productIdentifier} =
          await Purchases.purchasePackage(p);
        if (typeof customerInfo.entitlements.active.Premium !== 'undefined') {
          setLoading(false);
          navigationRef.goBack();
          setPremiumAction(customerInfo.entitlements.active);
          Snackbar.show({text: 'Premium activated!'});
          if (onActivated) {
            onActivated();
          }
        }
      } catch (e) {
        setLoading(false);
        // @ts-ignore
        if (!e.userCancelled) {
          logError(e);
          // @ts-ignore
          Alert.alert('Error', e.message);
        }
      }
    }
  };

  const premiumActive = info && info.activeSubscriptions[0];
  const hasUsedTrial = info && info.entitlements.all[0];

  return (
    <>
      <FastImage
        source={require('../../../images/Equipment-minimal.jpeg')}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          height: '50%',
          left: 0,
          right: -200,
        }}
      />

      <Header hasBack absolute />
      <LinearGradient
        colors={['rgba(54, 57, 68,0)', colors.appGrey]}
        style={{
          position: 'absolute',
          right: 0,
          bottom: '65%',
          left: 0,
          height: 200,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          height: '65%',
          backgroundColor: colors.appGrey,
        }}>
        <ScrollView>
          <Text
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
              fontSize: 30,
              color: colors.appWhite,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            FIT FOR LIFE!
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  style={{width: 40}}
                  size={20}
                  color={colors.appWhite}
                  name="dumbbell"
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.appWhite,
                }}>
                Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> on-demand
                workouts & fitness tests
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  style={{width: 40}}
                  size={20}
                  color={colors.appWhite}
                  name="book-open"
                />
              </View>

              <Text
                style={{
                  fontSize: 14,
                  color: colors.appWhite,
                }}>
                Unlock <Text style={{fontWeight: 'bold'}}>ALL</Text> educational
                content
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  style={{width: 40}}
                  size={20}
                  color={colors.appWhite}
                  name="calendar-alt"
                />
              </View>

              <Text
                style={{
                  fontSize: 14,
                  color: colors.appWhite,
                }}>
                Request custom workouts from Christian
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Icon
                  style={{width: 40}}
                  size={20}
                  color={colors.appWhite}
                  name="comment"
                  solid
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.appWhite,
                }}>
                In-app real time trainer-to-client messaging
              </Text>
            </View>
          </View>
          {packages.length ? (
            <>
              {premiumActive ? (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: 40,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    🎉 Premium active 🎉
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(info.managementURL || '')}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.appWhite,
                        textDecorationLine: 'underline',
                      }}>
                      Manage subscription
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {packages.map(item => {
                    return (
                      <PremiumProduct
                        p={item}
                        key={item.identifier}
                        selected={selected === item.identifier}
                        setSelected={setSelected}
                      />
                    );
                  })}

                  <Button
                    text="subscribe"
                    onPress={() =>
                      onPurchase(packages.find(p => p.identifier === selected))
                    }
                    disabled={!selected}
                    style={{margin: 20, marginBottom: 10}}
                  />
                </>
              )}

              <TouchableOpacity
                onPress={async () => {
                  try {
                    setLoading(true);
                    const restore = await Purchases.restorePurchases();
                    if (
                      typeof restore.entitlements.active.Premium !== 'undefined'
                    ) {
                      setLoading(false);
                      navigation.goBack();
                      setPremiumAction(restore.entitlements.active);
                      Snackbar.show({text: 'Premium re-activated'});
                    } else {
                      setLoading(false);
                      Snackbar.show({
                        text: 'No previous active subscription found',
                      });
                    }
                  } catch (e) {
                    logError(e);
                    setLoading(false);
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                    padding: 10,
                    color: colors.appWhite,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  Restore purchases
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </ScrollView>
      </View>

      <AbsoluteSpinner loading={loading} />
    </>
  );
};
const mapStateToProps = ({settings, profile}: MyRootState) => ({
  settings,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setPremiumAction: setPremium,
};

export default connect(mapStateToProps, mapDispatchToProps)(Premium);
