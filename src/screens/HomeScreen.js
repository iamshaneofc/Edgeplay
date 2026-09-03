import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { moderateScale } from "react-native-size-matters";
import HomeInfoBox from "../components/HomeInfoBox";
import BetCardSingle from "../components/BetCardSingle";
import QuickPicksModal from "../components/QuickPicksModal";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_UPCOMING_GAMES, GET_ME, GET_MY_POSITION, UPDATE_USER } from "../graph-operations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import { initUser } from '../redux/features/userSlice';
import NetInfo from "@react-native-community/netinfo";
import analytics from "@react-native-firebase/analytics";
import messaging from '@react-native-firebase/messaging';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } catch (e) {
    console.log("FCM permission error", e);
  }
}

const HomeScreen = ({ navigation }) => {
  const [jsWebToken, setJsWebToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeSport, setActiveSport] = useState("football");
  const dispatch = useDispatch();

  useEffect(() => {
    getToken();
    requestUserPermission();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    messaging().onTokenRefresh(token => {
      async function updateToken() {
        const tokenVal = await AsyncStorage.getItem("jsWebToken");
        await updateUser({
          variables: {
            jsWebToken: tokenVal,
            data: {
              fcmtoken: token
            }
          }
        });
      }
      updateToken();
    });

    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("jsWebToken");
    if (token) {
      setJsWebToken(token);
      getMe({ variables: { jsWebToken: token } });
      getUpcomingGames({
        variables: {
          jsWebToken: token,
          data: { sport: activeSport }
        }
      });
      getMyPosition({
        variables: {
          jsWebToken: token,
          orderBy: { weekly_count: "desc" }
        }
      });
    }
  };

  const [isQuickPickVisible, setIsQuickPicksVisible] = useState(false);
  const [quickPicksDetails, setQuickPicksDetails] = useState({});
  const [gameDetails, setGameDetails] = useState([]);

  const [getUpcomingGames, { loading }] = useLazyQuery(GET_UPCOMING_GAMES, {
    fetchPolicy: 'no-cache',
    pollInterval: 30000,
    onCompleted(data) {
      if (data && data.upcomingGames) {
        setGameDetails(data.upcomingGames);
      }
    },
    onError() {
      if (jsWebToken) getUpcomingGames();
    }
  });

  const [getMe] = useLazyQuery(GET_ME, {
    fetchPolicy: 'no-cache',
    pollInterval: 30000,
    onCompleted(data) {
      if (data && data.getMe) {
        dispatch(initUser({
          jsWebToken,
          id: data.getMe.id,
          name: data.getMe.name,
          coins: data.getMe.coins,
          bet_won: data.getMe.bet_won,
          bet_lost: data.getMe.bet_lost,
          bet_pending: data.getMe.bet_pending,
          invite_code: data.getMe.invite_code
        }));
      }
    }
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onError(error) {
      console.log("Error updating FCM token ", error);
    }
  });

  const [getMyPosition] = useLazyQuery(GET_MY_POSITION, {
    fetchPolicy: 'no-cache',
    pollInterval: 30000,
    onCompleted(data) {
      if (data && data.getMyPosition) {
        dispatch(initUser({
          jsWebToken,
          position: data.getMyPosition.position
        }));
      }
    }
  });

  const handleSportChange = (sport) => {
    setActiveSport(sport);
    if (jsWebToken) {
      getUpcomingGames({
        variables: {
          jsWebToken,
          data: { sport }
        }
      });
    }
  };

  const handleCloseModal = (navigate) => {
    closeModal();
    if (navigate) navigation.navigate("Bet");
  };

  const handleSelection = async (info, item) => {
    setIsQuickPicksVisible(true);
    const details = { ...info, ...item, sport: activeSport };
    setQuickPicksDetails(details);
    try {
      await analytics().logEvent('click_on_odds');
    } catch (e) {
      console.log(e);
    }
  };

  const closeModal = () => {
    setIsQuickPicksVisible(false);
    setQuickPicksDetails({});
  };

  const renderCards = ({ item }) => (
    <BetCardSingle
      onOddSelected={(info) => handleSelection(info, item)}
      {...item}
      sport={activeSport}
      onPress={() => navigation.navigate("GameDetails", { ...item, country: "", sport: activeSport, matchId: item.matchId })}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
      <HomeInfoBox />

      <View style={styles.content}>
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Featured Matches</Text>
          <View style={styles.sportPicker}>
            <TouchableOpacity
              onPress={() => handleSportChange("football")}
              style={[styles.sportChip, activeSport === "football" && styles.sportChipActive]}
            >
              <Text style={[styles.sportChipText, activeSport === "football" && styles.sportChipTextActive]}>
                ⚽ Football
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSportChange("basketball")}
              style={[styles.sportChip, activeSport === "basketball" && styles.sportChipActive]}
            >
              <Text style={[styles.sportChipText, activeSport === "basketball" && styles.sportChipTextActive]}>
                🏀 Basketball
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </View>
        ) : (
          <FlatList
            data={gameDetails}
            keyExtractor={(items) => items.matchId}
            renderItem={renderCards}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="sports-soccer"
                title="No Upcoming Matches"
                description="There are currently no scheduled games for this sport category. Check back soon!"
              />
            }
          />
        )}
      </View>

      {isQuickPickVisible && (
        <QuickPicksModal
          info={quickPicksDetails}
          close={(navigate) => handleCloseModal(navigate)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sportPicker: {
    flexDirection: "row",
  },
  sportChip: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.cardBg,
    marginLeft: moderateScale(6),
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sportChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sportChipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  sportChipTextActive: {
    color: "#0B0E17",
  },
  loadingContainer: {
    flex: 1,
    marginTop: SPACING.sm,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
});

export default HomeScreen;
