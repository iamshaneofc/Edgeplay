import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import { moderateScale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, RADIUS, FONT_SIZE, SPACING } from '../theme';

const CustomTextInput = ({
  icon,
  placeHolder,
  placeholder,
  password,
  secureTextEntry,
  value,
  onValueChange,
  onChangeText,
  keyboardType,
  autoCapitalize = 'none',
  label,
  error,
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTextChange = (text) => {
    if (onValueChange) onValueChange(text);
    if (onChangeText) onChangeText(text);
  };

  const isPasswordInput = password || secureTextEntry;
  const placeholderText = placeholder || placeHolder || "";

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          style
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.inputStyle}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={handleTextChange}
          secureTextEntry={isPasswordInput && !showPassword}
          placeholder={placeholderText}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPasswordInput && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={moderateScale(20)}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: moderateScale(6),
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginLeft: moderateScale(4),
  },
  container: {
    width: "100%",
    height: moderateScale(52),
    paddingHorizontal: moderateScale(14),
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  containerFocused: {
    borderColor: COLORS.inputBorderActive,
    backgroundColor: COLORS.cardBg,
  },
  containerError: {
    borderColor: COLORS.danger,
  },
  iconContainer: {
    marginRight: moderateScale(10),
  },
  inputStyle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: moderateScale(4),
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    marginTop: moderateScale(4),
    marginLeft: moderateScale(4),
  }
});

export default CustomTextInput;
