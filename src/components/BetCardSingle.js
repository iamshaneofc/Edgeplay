import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import TeamName from "./TeamName";
import OddSelection from "./OddSelection";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_TEAM } from "../graph-operations";
import { useSelector } from "react-redux";
import analytics from "@react-native-firebase/analytics";
import { COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from "../theme";

const BetCardSingle = ({ status, moneyLine, homeName, awayName, homeId, awayId, homeScore, awayScore, onPress, onOddSelected, matchTime, sport, halfStartTime }) => {
  const odds = moneyLine ? moneyLine.split(",") : [];
  let basketball = sport === "basketball";
  let disabled = false;

  if (odds.length < 11) odds.unshift(0, 0, 0);
  if (odds.length <= 3) disabled = true;

  const user = useSelector(state => state.user);
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");

  const gameIsInPlay = moment() > moment.unix(matchTime);
  let currentGameTine = status === 1
    ? moment().diff(moment.unix(matchTime), "minutes")
    : moment().diff(moment.unix(halfStartTime), "minutes") + 45;

  if (parseInt(currentGameTine) > 1000) currentGameTine = "OT";

  useQuery(GET_TEAM, {
    variables: {
      jsWebToken: user.jsWebToken,
      sport,
      teamId: homeId
    },
    onCompleted(data) {
      if (data && data.getTeam) setHomeLogo(data.getTeam.logo);
    }
  });

  useQuery(GET_TEAM, {
    variables: {
      jsWebToken: user.jsWebToken,
      sport,
      teamId: awayId
    },
    onCompleted(data) {
      if (data && data.getTeam) setAwayLogo(data.getTeam.logo);
    }
  });

  const handleOnPress = async () => {
    try {
      await analytics().logEvent('click_on_game_card', {
        homeName,
        awayName
      });
    } catch (e) {
      console.log(e);
    }
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleOnPress}
      style={[styles.container, SHADOWS.card]}
    >
      <View style={styles.headerBadgeRow}>
        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{(sport || 'FOOTBALL').toUpperCase()}</Text>
        </View>
        {gameIsInPlay ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        ) : (
          <Text style={styles.timeText}>{moment.unix(matchTime).format("MMM DD • HH:mm")}</Text>
        )}
      </View>

      <View style={styles.contentTeam}>
        <TeamName teamName={homeName} teamLogo={homeLogo} />
        
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: gameIsInPlay ? COLORS.primary : COLORS.textPrimary }]}>
            {gameIsInPlay ? `${homeScore ?? 0} - ${awayScore ?? 0}` : "VS"}
          </Text>
          {gameIsInPlay && (
            <Text style={styles.matchStatusText}>
              {status === 2 ? "HT" : status === 4 ? "OT" : `${currentGameTine}'`}
            </Text>
          )}
        </View>

        <TeamName teamName={awayName} teamLogo={awayLogo} left />
      </View>

      <View style={styles.oddsContainer}>
        <OddSelection
          disabled={disabled}
          large={basketball}
          onOddSelected={() => onOddSelected && onOddSelected({ pick: { name: homeName, num: 1 }, odd: basketball ? odds[4] : odds[5], type: "1x2" })}
          selection="1"
          odd={basketball ? odds[4] : odds[5]}
        />
        {!basketball && (
          <OddSelection
            disabled={disabled}
            onOddSelected={() => onOddSelected && onOddSelected({ pick: { name: "Draw", num: 0 }, odd: odds[6], type: "1x2" })}
            selection="X"
            odd={odds[6]}
          />
        )}
        <OddSelection
          disabled={disabled}
          large={basketball}
          onOddSelected={() => onOddSelected && onOddSelected({ pick: { name: awayName, num: 2 }, odd: basketball ? odds[5] : odds[7], type: "1x2" })}
          selection="2"
          odd={basketball ? odds[5] : odds[7]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    marginVertical: moderateScale(6),
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  sportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: RADIUS.sm,
  },
  sportText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: RADIUS.round,
  },
  liveDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.primary,
    marginRight: moderateScale(4),
  },
  liveText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "800",
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  contentTeam: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: moderateScale(6),
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(6),
  },
  scoreText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
  },
  matchStatusText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: moderateScale(2),
  },
  oddsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: moderateScale(10),
  },
});

export default BetCardSingle;
