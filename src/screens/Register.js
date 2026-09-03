import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';
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
import { useMutation } from '@apollo/client';
import { SAVE_DEVICE_INFO, SIGNUP_USER } from "../graph-operations";
import { useDispatch } from 'react-redux';
import { initUserPersit } from '../redux/features/userSlice';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import analytics from "@react-native-firebase/analytics";
import { getDeviceInfo } from "../utils";
import messaging from '@react-native-firebase/messaging';
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const Register = ({ navigation }) => {
  const dispatch = useDispatch();
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmationValue, setPasswordConfirmationValue] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCompletion, setErrorCompletion] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorServer, setErrorServer] = useState("");
  const [fcmtoken, setFcmToken] = useState("");

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        if (token) setFcmToken(token);
      })
      .catch(err => console.log("FCM token error", err));
  }, []);

  const [signupUser] = useMutation(SIGNUP_USER, {
    onCompleted: async (data) => {
      if (data && data.signupUser) {
        const { token, user } = data.signupUser;
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
      const errStr = error.message || error.toString();
      if (errStr.includes("1") || errStr.toLowerCase().includes("username")) return setErrorUsername(true);
      if (errStr.includes("2") || errStr.toLowerCase().includes("email")) return setErrorEmail(true);
      setErrorServer(error.message || "Registration failed. Please check your network or try again.");
    }
  });

  const [saveDeviceInfo] = useMutation(SAVE_DEVICE_INFO, {
    onError(error) {
      console.log("Error ", error);
    }
  });

  const handleSignupUser = async () => {
    clearErrors();
    const trimmedEmail = emailValue ? emailValue.trim() : "";
    const trimmedPassword = passwordValue || "";
    const trimmedConfirmPassword = passwordConfirmationValue || "";
    const trimmedName = nameValue ? nameValue.trim() : "";
    const trimmedInviteCode = inviteCode ? inviteCode.trim() : "";

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword || loading)
      return setErrorCompletion(true);

    if (trimmedPassword !== trimmedConfirmPassword)
      return setErrorPasswordConfirmation(true);

    const finalName = trimmedName || trimmedEmail.split('@')[0];
    const finalInviteCode = trimmedInviteCode || null;

    setLoading(true);
    signupUser({
      variables: {
        name: finalName,
        email: trimmedEmail.toLowerCase(),
        password: trimmedPassword,
        invitedBy: finalInviteCode,
        fcmtoken: fcmtoken || null
      }
    });

    try {
      await analytics().logEvent('create_user_button');
    } catch (e) {
      console.log(e);
    }
  };

  const handleAlreadyRegistered = async () => {
    try {
      await analytics().logEvent('already_registered_user');
    } catch (e) {
      console.log(e);
    }
    navigation.navigate("Login");
  };

  const clearErrors = () => {
    setErrorUsername(false);
    setErrorEmail(false);
    setErrorCompletion(false);
    setErrorPasswordConfirmation(false);
    setErrorServer("");
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
              <Text style={styles.welcomeText}>Create Your Predictor Account</Text>
            </View>

            <View style={[styles.registerCard, SHADOWS.card]}>
              <CustomTextInput
                value={nameValue}
                onValueChange={(v) => {
                  clearErrors();
                  setNameValue(v);
                }}
                placeHolder="Username (Optional)"
                icon={<AntDesign name="user" size={18} color={COLORS.textMuted} />}
              />
              {errorUsername && <Text style={styles.errorText}>Username not available!</Text>}

              <CustomTextInput
                value={emailValue}
                onValueChange={(v) => {
                  clearErrors();
                  setEmailValue(v);
                }}
                placeHolder="Email Address"
                icon={<Feather name="at-sign" size={18} color={COLORS.textMuted} />}
                keyboardType="email-address"
              />
              {errorEmail && <Text style={styles.errorText}>An account already exists with that email!</Text>}

              <CustomTextInput
                value={passwordValue}
                onValueChange={(v) => {
                  clearErrors();
                  setPasswordValue(v);
                }}
                password
                placeHolder="Password"
                icon={<AntDesign name="lock" size={18} color={COLORS.textMuted} />}
              />

              <CustomTextInput
                value={passwordConfirmationValue}
                onValueChange={(v) => {
                  clearErrors();
                  setPasswordConfirmationValue(v);
                }}
                password
                placeHolder="Confirm Password"
                icon={<AntDesign name="lock" size={18} color={COLORS.textMuted} />}
              />
              {errorPasswordConfirmation && <Text style={styles.errorText}>Passwords do not match!</Text>}

              <CustomTextInput
                value={inviteCode}
                onValueChange={(v) => {
                  clearErrors();
                  setInviteCode(v);
                }}
                placeHolder="Invite Code (Optional)"
                icon={<AntDesign name="barcode" size={18} color={COLORS.textMuted} />}
              />

              {errorCompletion && <Text style={styles.errorText}>Please fill in all required fields.</Text>}
              {!!errorServer && <Text style={styles.errorText}>{errorServer}</Text>}

              <MainButton
                onClick={handleSignupUser}
                loading={loading}
                text="CREATE ACCOUNT"
                color={COLORS.primary}
                textColor="#0B0E17"
                arrow={arrowImage}
                style={styles.signUpBtn}
              />

              <TouchableOpacity onPress={handleAlreadyRegistered} style={styles.alreadyRegisteredBtn}>
                <Text style={styles.alreadyText}>
                  Already have an account? <Text style={styles.highlightText}>Sign In</Text>
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
    marginBottom: SPACING.lg,
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
  registerCard: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  signUpBtn: {
    marginTop: SPACING.md,
  },
  alreadyRegisteredBtn: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  alreadyText: {
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
    marginVertical: moderateScale(2),
    textAlign: "center",
  }
});

export default Register;
