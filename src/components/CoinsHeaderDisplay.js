import React, { useEffect, useState } from "react";
import Modal from 'react-native-modal';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { moderateScale } from "react-native-size-matters";
import { initUser, addCoins } from '../redux/features/userSlice';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Betcoin from "../assets/betcoin.png";
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from "@apollo/client";
import { ADD_COINS } from '../graph-operations';
import analytics from "@react-native-firebase/analytics";
import { RewardedAd, AdEventType, TestIds, RewardedAdEventType } from 'react-native-google-mobile-ads';
import AdsModal from "./AdsModal";
import { COLORS, RADIUS, FONT_SIZE, SPACING } from '../theme';

const adUnitId = Platform.OS === "ios" ? "ca-app-pub-4856517983898537/6949691507" : "ca-app-pub-4856517983898537/1049974470";

const CoinsHeaderDisplay = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [modal, setModal] = useState({
    isMainModalVisible: false,
    isLoadingRewardedAdsModalVisible: false,
    isModalErrorVisible: false
  });

  const [rewardEarned, setRewardsEarned] = useState({ status: false, amount: 0 });

  const [sendCoins] = useMutation(ADD_COINS, {
    onCompleted(data) {
      console.log("Add coins complete : ", data);
      setRewardsEarned({ amount: 0, status: false });
    },
    onError(error) {
      console.log("Error ", error);
    }
  });

  const toggleModal = async () => {
    try {
      await analytics().logEvent('click_on_add_coin');
    } catch (e) {
      console.log("Analytics error", e);
    }
    setModal({ ...modal, isMainModalVisible: !modal.isMainModalVisible });
  };

  const showAds = async () => {
    try {
      await analytics().logEvent('click_on_watch_ads');
    } catch (e) {
      console.log("Analytics error", e);
    }

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: [],
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("LOADED");
      rewarded.show();
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        sendCoins({
          variables: {
            jsWebToken: user.jsWebToken,
            amount: reward.amount
          }
        });
        dispatch(addCoins({
          coins: reward.amount
        }));
      },
    );

    const unsubscribedClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log("should close all modal");
      setModal({ ...modal, isLoadingRewardedAdsModalVisible: false, isMainModalVisible: false, isModalErrorVisible: false });
    });

    const unsubscribedError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Ad failed to load with error: ', error);
      setModal({ ...modal, isModalErrorVisible: true, isLoadingRewardedAdsModalVisible: false, isMainModalVisible: false });
    });

    rewarded.load();
    setModal({ ...modal, isMainModalVisible: false, isLoadingRewardedAdsModalVisible: true, isModalErrorVisible: false });
  };

  const coinsValue = user && user.coins ? parseFloat(user.coins).toFixed(2) : "0.00";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggleModal} style={styles.container}>
      <View style={styles.addBtnContainer}>
        <MaterialIcons name="add" size={moderateScale(18)} color="#0B0E17" />
      </View>
      <View style={styles.coinCountContainer}>
        <Image style={styles.imageStyle} source={Betcoin} />
        <Text style={styles.textStyle}>{coinsValue}</Text>
      </View>
      <Modal
        isVisible={modal.isMainModalVisible || modal.isModalErrorVisible || modal.isLoadingRewardedAdsModalVisible}
        onBackButtonPress={() => setModal({ ...modal, isMainModalVisible: false, isLoadingRewardedAdsModalVisible: false, isModalErrorVisible: false })}
        onBackdropPress={() => setModal({ ...modal, isMainModalVisible: false, isLoadingRewardedAdsModalVisible: false, isModalErrorVisible: false })}
      >
        {modal.isModalErrorVisible && (
          <AdsModal
            title={"Ads Unavailable"}
            close={() => setModal({ ...modal, isModalErrorVisible: false })}
            buttonText={"OK"}
            text={"No ads are available right now. Please try again later to collect free coins!"}
            onPress={() => setModal({ ...modal, isMainModalVisible: false, isModalErrorVisible: false })}
          />
        )}

        {modal.isMainModalVisible && (
          <AdsModal
            title={"Earn Free Coins"}
            close={() => setModal({ ...modal, isMainModalVisible: false })}
            buttonText={"Watch Ad"}
            text={"Watch a quick sponsored ad to add extra prediction coins to your EdgePlay balance instantly!"}
            onPress={showAds}
          />
        )}

        {modal.isLoadingRewardedAdsModalVisible && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.round,
    height: moderateScale(34),
    paddingRight: moderateScale(12),
    paddingLeft: moderateScale(4),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  addBtnContainer: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: "contain",
    marginRight: moderateScale(6)
  },
  textStyle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  coinCountContainer: {
    flexDirection: "row",
    marginLeft: moderateScale(8),
    alignItems: "center"
  },
});

export default CoinsHeaderDisplay;
