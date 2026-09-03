import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { GET_SCHEDULED_GAMES_COUNT } from "../graph-operations";
import { moderateScale } from "react-native-size-matters";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { truncate } from '../utils';
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const EventListSingle = ({ request, text, icon, liveCount, onPress }) => {
  const [gamesCount, setGameCount] = useState(0);
  const user = useSelector(state => state.user);

  useEffect(() => {
    getScheduledGamesCount();
  }, []);

  const [getScheduledGamesCount] = useLazyQuery(GET_SCHEDULED_GAMES_COUNT, {
    fetchPolicy: 'no-cache',
    pollInterval: 900000,
    skip: !request,
    variables: {
      jsWebToken: user.jsWebToken,
      sport: text ? text.toLowerCase() : "football"
    },
    onCompleted(data) {
      if (request && data) {
        setGameCount(data.scheduledGamesCount);
      }
    }
  });

  const countValue = request ? gamesCount : liveCount;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.container, SHADOWS.card]}>
      <View style={styles.leftRow}>
        <View style={styles.iconContainer}>
          {request ? (
            <Image style={styles.sportImageStyle} source={icon} />
          ) : (
            <Image style={styles.sportImageStyle} source={{ uri: icon }} />
          )}
        </View>
        <Text adjustsFontSizeToFit style={styles.text}>
          {truncate(text || "", 26)}
        </Text>
      </View>

      <View style={styles.rightRow}>
        <View style={styles.liveCount}>
          <Text style={styles.liveCountText}>{countValue ?? 0}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} style={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    height: moderateScale(56),
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: RADIUS.lg,
    marginBottom: moderateScale(8),
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.cardBgLighter,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  sportImageStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "contain",
  },
  text: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveCount: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    borderRadius: RADIUS.round,
    justifyContent: "center",
    alignItems: "center",
  },
  liveCountText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: FONT_SIZE.xs,
  },
  arrowIcon: {
    marginLeft: moderateScale(6),
  }
});

export default EventListSingle;
