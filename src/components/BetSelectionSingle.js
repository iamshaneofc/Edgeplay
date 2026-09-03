import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { moderateScale } from "react-native-size-matters";
import AntDesign from 'react-native-vector-icons/AntDesign';
import OddSelection from "./OddSelection";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

const BetSelectionSingle = ({ title, odd, selection, onOddSelected, awayName, homeName, type, total }) => {
  const [isOpen, setIsOpen] = useState(true);

  const showSpread = type === "Handicap" || type === "Handicap Half";
  const showTotal = type === "Total";

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setIsOpen(!isOpen)} style={styles.textSection}>
        <Text style={styles.textTitle}>{title}</Text>
        <AntDesign name={isOpen ? "down" : "right"} size={moderateScale(14)} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.betSection}>
          <OddSelection
            onOddSelected={() => onOddSelected({ pick: { name: showTotal ? selection[0] : homeName, num: 1, spread: showSpread ? selection[0] : null, total: showTotal ? total : null }, odd: odd[0], type })}
            large={!odd[2]}
            selection={selection ? selection[0] : "1"}
            odd={odd[0]}
          />
          {odd[2] && (
            <OddSelection
              onOddSelected={() => onOddSelected({ pick: { name: "Draw", num: 0 }, odd: odd[2], type })}
              selection={"X"}
              odd={odd[2]}
            />
          )}
          <OddSelection
            onOddSelected={() => onOddSelected({ pick: { name: showTotal ? selection[1] : awayName, num: 2, spread: showSpread ? selection[1] : null, total: showTotal ? total : null }, odd: odd[1], type })}
            large={!odd[2]}
            selection={selection ? selection[1] : "2"}
            odd={odd[1]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    marginVertical: moderateScale(4),
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  textSection: {
    backgroundColor: COLORS.cardBgLighter,
    paddingVertical: moderateScale(12),
    paddingHorizontal: SPACING.md,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  textTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  betSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.md,
  }
});

export default BetSelectionSingle;
