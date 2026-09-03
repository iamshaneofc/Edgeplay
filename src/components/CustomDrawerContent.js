import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import React from "react";
import {
  View,
  StyleSheet,
  Text, Image
} from 'react-native';
import { moderateScale } from "react-native-size-matters";
import profilePhotos2 from "../assets/example_profile.jpg";
import { useSelector } from 'react-redux';
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

const CustomDrawerContent = (props) => {
  const user = useSelector(state => state.user);
  return (
    <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>EDGE<Text style={styles.brandHighlight}>PLAY</Text></Text>
        </View>

        <View style={styles.profileContainer}>
          <Image style={styles.avatar} source={profilePhotos2} />
          <View style={styles.profileInfo}>
            <Text style={styles.headerText}>{user.name ? user.name : "Predictor"}</Text>
            <Text style={styles.subText}>{user.email ? user.email : "Pro Member"}</Text>
          </View>
        </View>
      </View>

      <DrawerItemList {...props} />

      <View style={styles.separator} />

      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate("Profile")}
        inactiveTintColor={COLORS.textPrimary}
        activeBackgroundColor={COLORS.cardBg}
        icon={({ focused, color, size }) => (
          <AntDesignIcons name="user" size={moderateScale(18)} color={COLORS.primary} />
        )}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerScrollView: {
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    backgroundColor: COLORS.cardBg,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  brandRow: {
    marginBottom: SPACING.md,
  },
  brandText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  brandHighlight: {
    color: COLORS.primary,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    marginLeft: SPACING.sm,
  },
  headerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  subText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: SPACING.sm,
  }
});

export default CustomDrawerContent;
