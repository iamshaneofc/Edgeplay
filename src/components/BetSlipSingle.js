import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { truncate } from "../utils";
import { COLORS, RADIUS, FONT_SIZE, SPACING, SHADOWS } from "../theme";

const betType = (typeNumber) => {
  switch (typeNumber) {
    case 1:
      return "1x2";
    case 2:
      return "Handicap";
    case 3:
      return "Handicap Half";
    case 4:
      return "Total";
    default:
      return "Match";
  }
};

const BetSlipSingle = ({ eventIsOver, item }) => {
  const isWon = item.outcome === 1;
  const isLost = item.outcome === 0 || item.outcome === 2;
  const isPending = item.outcome === null || item.outcome === undefined;

  let statusText = "Pending";
  let statusBg = 'rgba(0, 229, 255, 0.15)';
  let statusColor = COLORS.secondary;

  if (eventIsOver || !isPending) {
    if (isWon) {
      statusText = "Won";
      statusBg = 'rgba(0, 230, 118, 0.15)';
      statusColor = COLORS.success;
    } else if (isLost) {
      statusText = "Lost";
      statusBg = 'rgba(255, 82, 82, 0.15)';
      statusColor = COLORS.danger;
    }
  }

  const oddVal = item.odd ? parseFloat(item.odd).toFixed(2) : "1.00";
  const bidVal = item.bid ? parseFloat(item.bid).toFixed(2) : "0.00";
  const winVal = (parseFloat(bidVal) * parseFloat(oddVal)).toFixed(2);

  return (
    <View style={[styles.container, SHADOWS.card]}>
      <View style={styles.topRow}>
        <View style={styles.infoCol}>
          <Text style={styles.pickName}>
            {item.pickName + `${item.spread ? ` (${item.spread})` : ""}`}
          </Text>
          <Text style={styles.betTypeLabel}>
            {`${betType(item.betType)}: ${item.pickName} ${item.spread ? `(${item.spread})` : ""}`}
          </Text>
          <Text adjustsFontSizeToFit style={styles.teamsName}>
            {truncate(item.teams || "", moderateScale(35))}
          </Text>
        </View>
        
        <View style={styles.statusCol}>
          <Text style={styles.oddValue}>{oddVal}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.bottomRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Odds</Text>
          <Text style={styles.statValue}>{oddVal}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Stake</Text>
          <Text style={styles.statValue}>{bidVal} Ƀ</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{eventIsOver ? statusText : "Potential Payout"}</Text>
          <Text style={[styles.statValue, { color: isWon ? COLORS.success : COLORS.primary }]}>
            {winVal} Ƀ
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    marginBottom: moderateScale(10),
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  pickName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: moderateScale(2),
  },
  betTypeLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: moderateScale(2),
  },
  teamsName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  statusCol: {
    alignItems: "flex-end",
  },
  oddValue: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    marginBottom: moderateScale(6),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    width: "100%",
    marginVertical: moderateScale(10),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginBottom: moderateScale(2),
  },
  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});

export default BetSlipSingle;
