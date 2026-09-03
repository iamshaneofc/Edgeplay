import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Football from "../assets/soccer_icon.png";
import Basketball from "../assets/basketball_icon.png";
import { moderateScale } from 'react-native-size-matters';
import BetSelectionSingle from "../components/BetSelectionSingle";
import FootballBackground from "../assets/Football-Stadium-background.jpg";
import LinearGradient from "react-native-linear-gradient";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from 'moment';
import { GET_MATCH_ODD } from '../graph-operations';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import QuickPicksModal from '../components/QuickPicksModal';
import { roundDecimals, truncate } from '../utils';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

const Tab = createMaterialTopTabNavigator();

const GameDetailsScreen = ({ route, navigation }) => {
  const {
    country,
    leagueName,
    name,
    matchTime,
    homeName,
    awayName,
    sport,
    matchId,
    moneyLine,
  } = route.params;

  const [isQuickPickVisible, setIsQuickPicksVisible] = useState(false);
  const [quickPicksDetails, setQuickPicksDetails] = useState({});

  const handleCloseModal = (navigate) => {
    closeModal();
    if (navigate) navigation.navigate("Bet");
  };

  const handleSelection = (info) => {
    setIsQuickPicksVisible(true);
    const details = { ...info, sport, homeName, awayName, matchId };
    setQuickPicksDetails(details);
  };

  const closeModal = () => {
    setIsQuickPicksVisible(false);
    setQuickPicksDetails({});
  };

  const StatsScreen = () => (
    <View style={styles.statsContainer}>
      <AntDesignIcons name="linechart" size={moderateScale(42)} color={COLORS.primary} />
      <Text style={styles.statsTitle}>Live Match Insights</Text>
      <Text style={styles.statsDesc}>In-depth team head-to-head stats & possession data coming soon!</Text>
    </View>
  );

  const BetSelectionScreen = () => {
    const [gameOdds, setGameOdds] = useState({});
    const user = useSelector(state => state.user);

    const { loading } = useQuery(GET_MATCH_ODD, {
      fetchPolicy: 'no-cache',
      pollInterval: 60000,
      notifyOnNetworkStatusChange: true,
      variables: {
        jsWebToken: user.jsWebToken,
        sport,
        matchId: matchId,
      },
      onCompleted(data) {
        if (data && data.matchOdds) setGameOdds(data.matchOdds);
      }
    });

    if (loading || Object.keys(gameOdds).length <= 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    const odd1x2 = moneyLine ? moneyLine.split(",") : [];
    const { spread, total, handicap, handicapHalf, overUnder } = gameOdds;

    let basketSpreadOddHome, basketSpreadOddAway, basketTotalOddHome, basketTotalOddAway;
    let basketSpreadTextHome, basketSpreadTextAway, basketTotalTextHome, basketTotalTextAway;

    let footballHandicapOddHome, footballHandicapOddAway, footballHandicapTextHome, footballHandicapTextAway;
    let footballTotalTextHome, footballTotalTextAway, footballTotalOddHome, footballTotalOddAway;
    let totalSum;

    if (spread && total) {
      const spreadOdds = spread[3].split(',');
      const totalOdds = total[3].split(',');

      basketSpreadOddHome = parseFloat(spreadOdds[9]) < 1 ? parseFloat(spreadOdds[9]) + 1 : parseFloat(spreadOdds[9]);
      basketSpreadOddAway = parseFloat(spreadOdds[10]) < 1 ? parseFloat(spreadOdds[10]) + 1 : parseFloat(spreadOdds[10]);

      basketTotalOddHome = parseFloat(totalOdds[9]) < 1 ? parseFloat(totalOdds[9]) + 1 : parseFloat(totalOdds[9]);
      basketTotalOddAway = parseFloat(totalOdds[10]) < 1 ? parseFloat(totalOdds[10]) + 1 : parseFloat(totalOdds[10]);

      const modifOdds = spreadOdds[8] < 0 ? spreadOdds[8] * -1 : spreadOdds[8];
      basketSpreadTextHome = odd1x2[4] > odd1x2[5] ? '+' + modifOdds : '-' + spreadOdds[8];
      basketSpreadTextAway = odd1x2[4] > odd1x2[5] ? '-' + modifOdds : '+' + spreadOdds[8];

      basketTotalTextHome = `Over ${totalOdds[8]}`;
      basketTotalTextAway = `Under ${totalOdds[8]}`;

      totalSum = totalOdds[8];
    }

    if (handicap && handicapHalf && overUnder) {
      const handicapOdd = handicap[3].split(',');
      const overUnderOdd = overUnder[3].split(',');

      footballHandicapOddHome = parseFloat(handicapOdd[6]) < 1 ? parseFloat(handicapOdd[6]) + 1 : parseFloat(handicapOdd[6]);
      footballHandicapOddAway = parseFloat(handicapOdd[7]) < 1 ? parseFloat(handicapOdd[7]) + 1 : parseFloat(handicapOdd[7]);
      footballHandicapTextHome = handicapOdd[5] * -1;
      footballHandicapTextAway = handicapOdd[5] * 1;

      footballTotalTextHome = `Over ${roundDecimals(overUnderOdd[5])}`;
      footballTotalTextAway = `Under ${roundDecimals(overUnderOdd[5])}`;

      totalSum = overUnderOdd[5];

      footballTotalOddHome = parseFloat(overUnderOdd[6]) < 1 ? parseFloat(overUnderOdd[6]) + 1 : parseFloat(overUnderOdd[6]);
      footballTotalOddAway = parseFloat(overUnderOdd[7]) < 1 ? parseFloat(overUnderOdd[7]) + 1 : parseFloat(overUnderOdd[7]);
    }

    return (
      <ScrollView style={styles.marketsScroll} contentContainerStyle={{ padding: SPACING.md }}>
        {sport === "basketball" && (
          <>
            <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[odd1x2[4], odd1x2[5]]} type={"1x2"} title={"Winner (1x2)"} />
            {basketSpreadOddHome && <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[basketSpreadOddHome.toFixed(2), basketSpreadOddAway.toFixed(2)]} selection={[basketSpreadTextHome, basketSpreadTextAway]} type={"Handicap"} title={"Point Spread"} />}
            {basketTotalOddHome && <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[basketTotalOddHome.toFixed(2), basketTotalOddAway.toFixed(2)]} selection={[basketTotalTextHome, basketTotalTextAway]} total={roundDecimals(totalSum)} type={"Total"} title={"Total Points Over/Under"} />}
          </>
        )}

        {sport === "football" && (
          <>
            <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[odd1x2[5], odd1x2[7], odd1x2[6]]} type={"1x2"} title={"Match Result (1x2)"} />
            {footballHandicapOddHome && <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[footballHandicapOddHome.toFixed(2), footballHandicapOddAway.toFixed(2)]} type={"Handicap"} selection={[roundDecimals(footballHandicapTextHome), roundDecimals(footballHandicapTextAway)]} title={"Goal Handicap"} />}
            {footballTotalOddHome && <BetSelectionSingle homeName={homeName} awayName={awayName} onOddSelected={handleSelection} odd={[footballTotalOddHome.toFixed(2), footballTotalOddAway.toFixed(2)]} total={roundDecimals(totalSum)} type={"Total"} selection={[footballTotalTextHome, footballTotalTextAway]} title={"Over/Under Goals"} />}
          </>
        )}
      </ScrollView>
    );
  };

  const correctName = leagueName ? leagueName : name;
  const gameIsInPlay = moment() > moment.unix(matchTime);

  return (
    <View style={styles.container}>
      <ImageBackground source={FootballBackground} style={styles.imageBackground}>
        <LinearGradient
          colors={['rgba(11, 14, 23, 0.7)', 'rgba(11, 14, 23, 0.95)']}
          style={styles.linearGradient}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Image style={styles.sportImageStyle} source={sport === "football" ? Football : Basketball} />
            <Text style={styles.headerText}>{truncate(`${country ? country + " • " : ""}${correctName}`, 30)}</Text>
          </View>

          <View style={styles.teamSectionContainer}>
            <View style={styles.teamSection}>
              <Text adjustsFontSizeToFit numberOfLines={2} style={styles.teamNameText}>{homeName}</Text>
            </View>

            <View style={styles.matchTimeSection}>
              <Text style={[styles.vsText, { color: gameIsInPlay ? COLORS.primary : COLORS.textPrimary }]}>
                {gameIsInPlay ? "LIVE" : moment.unix(matchTime).format("MMM DD")}
              </Text>
              <Text style={styles.matchSubTime}>
                {gameIsInPlay ? "IN PLAY" : moment.unix(matchTime).format("HH:mm")}
              </Text>
            </View>

            <View style={styles.teamSection}>
              <Text adjustsFontSizeToFit numberOfLines={2} style={styles.teamNameText}>{awayName}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: { backgroundColor: COLORS.cardBg, elevation: 0, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 3 },
          tabBarLabelStyle: { fontWeight: "700", fontSize: FONT_SIZE.xs },
        }}
      >
        <Tab.Screen name="Markets" component={BetSelectionScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>

      {isQuickPickVisible && (
        <QuickPicksModal
          info={quickPicksDetails}
          close={(navigate) => handleCloseModal(navigate)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  imageBackground: {
    resizeMode: "cover",
    height: moderateScale(160),
    justifyContent: "center",
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    padding: SPACING.md,
    alignItems: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sportImageStyle: {
    width: moderateScale(16),
    height: moderateScale(16),
    resizeMode: "contain",
    marginRight: moderateScale(6),
  },
  headerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  teamSectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: SPACING.md,
  },
  teamSection: {
    alignItems: "center",
    width: "35%",
  },
  teamNameText: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: FONT_SIZE.md,
    textAlign: "center",
  },
  matchTimeSection: {
    alignItems: "center",
  },
  vsText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "900",
  },
  matchSubTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: moderateScale(2),
  },
  marketsScroll: {
    backgroundColor: COLORS.bgPrimary,
    flex: 1,
  },
  loadingContainer: {
    backgroundColor: COLORS.bgPrimary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    backgroundColor: COLORS.bgPrimary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  statsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  statsDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
  }
});

export default GameDetailsScreen;
