import { Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import HomeImage from '../assets/new_menu_home_active.png';
import MatchImage from '../assets/new_menu_matches_active.png';
import PariImage from '../assets/new_menu_bets_active.png';
import KlasmanImage from '../assets/new_menu_leaderboard_active.png';
import CupMain from "../assets/cup_main.png";
import HomeScreen from '../screens/HomeScreen';
import BetScreen from '../screens/BetScreen';
import LeadersBoardScreen from '../screens/LeadersBoard';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MatchScreen } from "./index";
import ProfileScreen from "../screens/ProfileScreen";
import { COLORS } from '../theme';

const Tab = createMaterialBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let sourceIcon = HomeImage;
          if (route.name === 'Home') sourceIcon = HomeImage;
          else if (route.name === 'Games') sourceIcon = MatchImage;
          else if (route.name === "Bet") sourceIcon = PariImage;
          else if (route.name === "Leaderboards") sourceIcon = KlasmanImage;
          else if (route.name === "Profile") sourceIcon = CupMain;

          return (
            <Image
              style={{
                height: moderateScale(22),
                width: moderateScale(22),
                resizeMode: "contain",
                tintColor: focused ? COLORS.primary : COLORS.textMuted
              }}
              source={sourceIcon}
            />
          );
        },
      })}
      activeColor={COLORS.primary}
      inactiveColor={COLORS.textMuted}
      barStyle={{ backgroundColor: COLORS.bgSecondary, borderTopWidth: 1, borderTopColor: COLORS.cardBorder }}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Games" component={MatchScreen} options={{ tabBarLabel: 'Explore' }} />
      <Tab.Screen name="Bet" component={BetScreen} options={{ tabBarLabel: 'My Bets' }} />
      <Tab.Screen name="Leaderboards" component={LeadersBoardScreen} options={{ tabBarLabel: 'Ranks' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
