import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initUser } from '../redux/features/userSlice';
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreens from '../screens/Onboardings';
import { moderateScale } from "react-native-size-matters";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getHeaderTitle, Home } from "./";
import CoinsHeaderDisplay from '../components/CoinsHeaderDisplay';
import ConnectOptions from '../screens/ConnectOptions';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ResetPasswordScreen from '../screens/ResetPassword';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import ProfileScreen from "../screens/ProfileScreen";
import { COLORS, FONT_SIZE } from '../theme';

export const rootDrawerNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [isFirstRun, setIsFirstRun] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const tokenVal = await AsyncStorage.getItem("jsWebToken");
    setToken(tokenVal);

    if (tokenVal) {
      dispatch(initUser({ jsWebToken: tokenVal }));
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

  return (
    <Stack.Navigator
      initialRouteName={isFirstRun ? 'Home' : 'onBoardings'}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgPrimary,
        },
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontWeight: "800",
          fontSize: FONT_SIZE.md,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ConnectOptions" component={ConnectOptions} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="onBoardings" component={OnBoardingScreens} options={{ headerShown: false }} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ route }) => ({
          headerShown: getHeaderTitle(route),
          title: "",
          headerLeft: () => (
            <View style={{ marginLeft: moderateScale(4) }}>
              <Text style={{ color: COLORS.textPrimary, fontSize: FONT_SIZE.md, fontWeight: "900", letterSpacing: 0.5 }}>
                {getHeaderTitle(route) || "EDGEPLAY"}
              </Text>
            </View>
          ),
          headerRight: () => (<CoinsHeaderDisplay />),
          headerTintColor: COLORS.textPrimary,
        })}
      />
      <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({ navigation }) => ({
          headerTitle: "Match Prediction",
          headerTintColor: COLORS.textPrimary,
          headerRight: () => (<CoinsHeaderDisplay />),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: moderateScale(4) }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <MaterialIcons name="arrow-back" size={moderateScale(24)} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: "My Profile",
          headerTintColor: COLORS.textPrimary,
          headerRight: () => (<CoinsHeaderDisplay />),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: moderateScale(4) }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <MaterialIcons name="arrow-back" size={moderateScale(24)} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
