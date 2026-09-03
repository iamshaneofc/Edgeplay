import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import defaultImage from "../assets/default_team.png";
import { COLORS, FONT_SIZE, RADIUS } from "../theme";

const TeamName = ({ left, teamName, teamLogo }) => {
  const correctUrl = teamLogo && Platform.OS === 'ios'
    ? teamLogo.split("?")[0].replace("http", "https")
    : teamLogo;

  return (
    <View style={[styles.container, left && styles.containerRight]}>
      {!left && (
        <View style={styles.imageWrapper}>
          {teamLogo ? (
            <Image style={styles.image} source={{ uri: correctUrl }} />
          ) : (
            <Image style={styles.image} source={defaultImage} />
          )}
        </View>
      )}
      <Text adjustsFontSizeToFit numberOfLines={2} style={styles.text}>
        {teamName}
      </Text>
      {left && (
        <View style={styles.imageWrapper}>
          {teamLogo ? (
            <Image style={styles.image} source={{ uri: correctUrl }} />
          ) : (
            <Image style={styles.image} source={defaultImage} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: moderateScale(130),
  },
  containerRight: {
    justifyContent: "flex-end",
  },
  imageWrapper: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.cardBgLighter,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: moderateScale(6),
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  image: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: RADIUS.round,
    resizeMode: "contain",
  },
  text: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: FONT_SIZE.xs,
    width: moderateScale(70),
    textAlign: "center",
  },
});

export default TeamName;
