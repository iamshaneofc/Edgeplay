import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from "react-native";
import BackgroundImage from "../assets/background_football_head.jpg";
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { moderateScale } from 'react-native-size-matters';
import analytics from '@react-native-firebase/analytics';

import OnBoardingInfoBox from "../components/onboardings/OnBoardingInfoBox";
import OnBoardingFooter from "../components/onboardings/OnBoardingFooter";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initUser } from "../redux/features/userSlice";
import { COLORS, FONT_SIZE, SPACING } from "../theme";

const Onboardings = ({ navigation }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("jsWebToken");
    setToken(token);

    if (token) {
      dispatch(initUser({ jsWebToken: token }));
      setIsFirstRun(true);
    } else {
      setIsFirstRun(false);
    }
  };

  if (isFirstRun === "") {
    return (
      <View style={{ backgroundColor: COLORS.bgPrimary, flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const onNextButton = async () => {
    try {
      await analytics().logEvent('next_button_slider');
    } catch (e) {
      console.log(e);
    }

    setSlideNumber(slideNumber + 1);
    if (slideNumber + 1 === 3) {
      try {
        await analytics().logEvent('finish_button_slider');
      } catch (e) {
        console.log(e);
      }
      navigation.navigate("ConnectOptions");
    }
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <LinearGradient
        colors={['rgba(11, 14, 23, 0.75)', 'rgba(11, 14, 23, 0.95)']}
        style={styles.linearGradient}
      />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>EDGE<Text style={styles.brandHighlight}>PLAY</Text></Text>
        </View>
        
        <View style={styles.infoWrapper}>
          <OnBoardingInfoBox slideNumber={slideNumber} />
        </View>
        
        <OnBoardingFooter currentPage={slideNumber} numPages={3} onPress={onNextButton} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingTop: getStatusBarHeight() + SPACING.lg,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flex: 1,
    justifyContent: "space-between",
  },
  brandRow: {
    marginTop: moderateScale(30),
    alignItems: "center",
  },
  brandText: {
    fontSize: FONT_SIZE.hero,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  brandHighlight: {
    color: COLORS.primary,
  },
  infoWrapper: {
    width: "100%",
    marginVertical: SPACING.xl,
  },
});

export default Onboardings;
