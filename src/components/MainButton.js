import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View
} from "react-native";
import { moderateScale } from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, RADIUS, FONT_SIZE, SHADOWS } from '../theme';

const MainButton = ({
  text,
  title,
  arrow,
  color,
  textColor,
  onClick,
  onPress,
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const buttonText = title || text || "";
  const handlePress = onPress || onClick;
  const buttonColor = color || COLORS.primary;
  const contentColor = textColor || (buttonColor === COLORS.primary ? "#0B0E17" : COLORS.textPrimary);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: buttonColor },
        disabled && styles.disabled,
        SHADOWS.glow,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <FontAwesome
              name={icon}
              size={moderateScale(18)}
              color={contentColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: contentColor }, textStyle]}>
            {buttonText}
          </Text>
          {arrow && <Image source={arrow} style={styles.arrow} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: moderateScale(50),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: moderateScale(8),
    borderRadius: RADIUS.lg,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: moderateScale(8),
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginHorizontal: moderateScale(6),
  },
  arrow: {
    marginLeft: moderateScale(8),
  },
  disabled: {
    opacity: 0.5,
  }
});

export default MainButton;
