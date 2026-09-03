import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ProfileInfoBox from '../components/ProfileInfoBox';
import { moderateScale } from "react-native-size-matters";
import Emoji from 'react-native-emoji';
import StatWon from '../assets/stats_won.png';
import StatLost from '../assets/stats_lost.png';
import StatInPlay from '../assets/stats_in_play.png';
import StatPosition from '../assets/stats_rank.png';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initUser } from "../redux/features/userSlice";
import { StackActions } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../graph-operations";
import ModalConfirmation from "../components/AdsModal";
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const ProfileScreen = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await updateUser({
        variables: {
          jsWebToken: user.jsWebToken,
          data: {
            fcmtoken: ""
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

    await AsyncStorage.setItem("jsWebToken", "");
    dispatch(initUser({
      jsWebToken: "",
      id: "",
      name: "",
      coins: 0,
      bet_won: 0,
      bet_lost: 0,
      bet_pending: 0,
      invite_code: ""
    }));

    navigation.dispatch(
      StackActions.replace('ConnectOptions')
    );
  };

  const handleDeletion = async () => {
    setShowModal(false);
    try {
      await updateUser({
        variables: {
          jsWebToken: user.jsWebToken,
          data: {
            fcmtoken: "",
            deleted: true
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

    await AsyncStorage.setItem("jsWebToken", "");
    dispatch(initUser({
      jsWebToken: "",
      id: "",
      name: "",
      coins: 0,
      bet_won: 0,
      bet_lost: 0,
      bet_pending: 0,
      invite_code: ""
    }));

    navigation.dispatch(
      StackActions.replace('ConnectOptions')
    );
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    onError(error) {
      console.log("Error updating user ", error);
    }
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ProfileInfoBox />
      
      {showModal && (
        <ModalConfirmation
          title={"Delete Account"}
          close={() => { setShowModal(false); setLoadingDeleteUser(false); }}
          buttonText={"Confirm Delete"}
          text={"Are you sure you want to permanently delete your EdgePlay account? All prediction history and virtual coin balance will be deleted."}
          onPress={handleDeletion}
        />
      )}

      <View style={styles.contentPadding}>
        <View style={[styles.cardBox, SHADOWS.card]}>
          <Text style={styles.cardTitle}>Performance Statistics</Text>
          <View style={styles.statsHolder}>
            <View style={styles.statBox}>
              <Image style={styles.statIcon} source={StatWon} />
              <Text style={styles.statLabel}>Won</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]}>{user.bet_won ?? 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Image style={styles.statIcon} source={StatLost} />
              <Text style={styles.statLabel}>Lost</Text>
              <Text style={[styles.statValue, { color: COLORS.danger }]}>{user.bet_lost ?? 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Image style={styles.statIcon} source={StatInPlay} />
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={[styles.statValue, { color: COLORS.secondary }]}>{user.bet_pending ?? 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Image style={styles.statIcon} source={StatPosition} />
              <Text style={styles.statLabel}>Ranking</Text>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>#{user.position || "-"}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.cardBox, SHADOWS.card]}>
          <View style={styles.rewardHeader}>
            <Emoji name=":tada:" style={{ fontSize: moderateScale(18) }} />
            <Text style={styles.rewardTitle}>Predictor Badges</Text>
            <Emoji name=":tada:" style={{ fontSize: moderateScale(18) }} />
          </View>
          <Text style={styles.rewardDesc}>
            Rank in the Top 3 of the weekly leaderboards to unlock exclusive EdgePlay champion badges!
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout} style={[styles.optionItem, SHADOWS.card]}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="logout" size={20} color={COLORS.textPrimary} style={styles.optionIcon} />
            <Text style={styles.optionText}>Sign Out</Text>
          </View>
          {loadingLogout ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          )}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => { setShowModal(true); setLoadingDeleteUser(true); }} style={[styles.optionItem, SHADOWS.card]}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="delete-forever" size={20} color={COLORS.danger} style={styles.optionIcon} />
            <Text style={[styles.optionText, { color: COLORS.danger }]}>Delete Account</Text>
          </View>
          {loadingDeleteUser ? (
            <ActivityIndicator size="small" color={COLORS.danger} />
          ) : (
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  contentPadding: {
    padding: SPACING.md,
  },
  cardBox: {
    backgroundColor: COLORS.cardBg,
    width: "100%",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  statsHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: COLORS.cardBorder,
  },
  statIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    resizeMode: "contain",
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginTop: moderateScale(2),
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  rewardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    marginHorizontal: SPACING.xs,
  },
  rewardDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
    lineHeight: 18,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cardBg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    marginRight: SPACING.sm,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
});

export default ProfileScreen;
