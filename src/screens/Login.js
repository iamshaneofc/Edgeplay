import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import BackgroundImage from "../assets/jobil.jpg";
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { moderateScale } from 'react-native-size-matters';
import { StackActions } from '@react-navigation/native';
import CustomTextInput from "../components/CustomTextInput";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainButton from "../components/MainButton";
import arrowImage from "../assets/arrow.png";
import { LOGIN_USER, SAVE_DEVICE_INFO } from "../graph-operations";
import { useMutation } from "@apollo/client";
import { initUserPersit } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import analytics from "@react-native-firebase/analytics";
import { getDeviceInfo } from "../utils";
import messaging from "@react-native-firebase/messaging";
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCompletion, setErrorCompletion] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        if (token) setFcmToken(token);
      })
      .catch(err => console.log("FCM error", err));
  }, []);

  const [login] = useMutation(LOGIN_USER, {
    onCompleted: async (data) => {
      if (data && data.login) {
        const { token, user } = data.login;
        dispatch(initUserPersit({
          jsWebToken: token,
          id: user.id,
          name: user.name,
          coins: user.coins,
          bet_won: user.bet_won,
          bet_lost: user.bet_lost,
          bet_pending: user.bet_pending
        }));

        try {
          const info = await getDeviceInfo();
          saveDeviceInfo({
            variables: {
              jsWebToken: token,
              ...info
            }
          });
        } catch (e) {
          console.log(e);
        }

        navigation.dispatch(StackActions.popToTop());
        setLoading(false);
        navigation.dispatch(StackActions.replace('Home'));
      }
    },
    onError(error) {
      setLoading(false);
      setErrorUser(true);
    }
  });

  const [saveDeviceInfo] = useMutation(SAVE_DEVICE_INFO, {
    onError(error) {
      console.log("Error device info ", error);
    }
  });

  const handleLogin = async () => {
    if (!emailValue || !passwordValue || loading)
      return setErrorCompletion(true);

    setLoading(true);
    login({
      variables: {
        email: emailValue.toLowerCase(),
        password: passwordValue,
        fcmtoken: fcmToken
      }
    });

    try {
      await analytics().logEvent('signin_user_button');
    } catch (e) {
      console.log(e);
    }
  };

  const handleNewUser = async () => {
    try {
      await analytics().logEvent('new_registered_user');
    } catch (e) {
      console.log(e);
    }
    navigation.navigate("Register");
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <LinearGradient
        colors={['rgba(11, 14, 23, 0.85)', 'rgba(11, 14, 23, 0.98)']}
        style={styles.linearGradient}
      />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>EDGE<Text style={styles.brandHighlight}>PLAY</Text></Text>
              <Text style={styles.welcomeText}>Welcome back, Predictor</Text>
            </View>

            <View style={[styles.loginCard, SHADOWS.card]}>
              <CustomTextInput
                value={emailValue}
                onValueChange={(v) => {
                  setErrorCompletion(false);
                  setErrorUser(false);
                  setEmailValue(v);
                }}
                placeHolder="Email Address"
                icon={<Feather name="at-sign" size={18} color={COLORS.textMuted} />}
                keyboardType="email-address"
              />

              <CustomTextInput
                value={passwordValue}
                onValueChange={(v) => {
                  setErrorCompletion(false);
                  setErrorUser(false);
                  setPasswordValue(v);
                }}
                password
                placeHolder="Password"
                icon={<AntDesign name="lock" size={18} color={COLORS.textMuted} />}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("ResetPassword")}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgetText}>Forgot password?</Text>
              </TouchableOpacity>

              {errorUser && <Text style={styles.errorText}>Incorrect email or password.</Text>}
              {errorCompletion && <Text style={styles.errorText}>Please enter both email and password.</Text>}

              <MainButton
                onClick={handleLogin}
                loading={loading}
                text="SIGN IN"
                color={COLORS.primary}
                textColor="#0B0E17"
                arrow={arrowImage}
                style={styles.signInBtn}
              />

              <TouchableOpacity onPress={handleNewUser} style={styles.newUserBtn}>
                <Text style={styles.newUserText}>
                  Don't have an account? <Text style={styles.highlightText}>Create One</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: getStatusBarHeight() + SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandRow: {
    alignItems: "center",
    marginBottom: SPACING.xl,
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
  welcomeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: "600",
  },
  loginCard: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginVertical: SPACING.xs,
  },
  forgetText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  signInBtn: {
    marginTop: SPACING.md,
  },
  newUserBtn: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  newUserText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
    marginVertical: SPACING.xs,
    textAlign: "center",
  }
});

export default Login;
