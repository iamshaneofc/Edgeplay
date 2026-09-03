import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { COLORS, RADIUS, FONT_SIZE } from "../theme";

const OddSelection = ({ selection, odd, onOddSelected, disabled, large }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onOddSelected}
      style={[
        styles.container,
        disabled && styles.disabled,
        { width: large ? "48%" : "31%" }
      ]}
    >
      <Text style={styles.selectionText}>{selection}</Text>
      <Text style={styles.oddText}>{odd || "-"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateScale(34),
    alignItems: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardBgLighter,
    flexDirection: "row",
    paddingHorizontal: moderateScale(10),
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  disabled: {
    opacity: 0.4,
    backgroundColor: COLORS.bgSecondary,
  },
  selectionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  oddText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});

export default OddSelection;
