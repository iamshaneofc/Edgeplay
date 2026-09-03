import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import EventListSingle from "../components/EventListSingle";
import BallIcon from "../assets/soccer_icon.png";
import BasketBall from "../assets/basketball_icon.png";
import NetInfo from '@react-native-community/netinfo';
import analytics from "@react-native-firebase/analytics";
import { COLORS, SPACING } from '../theme';

const EventsScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleFootballPress = async () => {
    try {
      await analytics().logEvent('click_on_football_event');
    } catch (e) {
      console.log(e);
    }
    navigation.navigate("Leagues", { sport: "football" });
  };

  const handleBasketballPress = async () => {
    try {
      await analytics().logEvent('click_on_basketball_event');
    } catch (e) {
      console.log(e);
    }
    navigation.navigate("Leagues", { sport: "basketball" });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <EventListSingle request={true} onPress={handleFootballPress} text={"FOOTBALL"} icon={BallIcon} />
        <EventListSingle request={true} onPress={handleBasketballPress} text={"BASKETBALL"} icon={BasketBall} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  }
});

export default EventsScreen;
