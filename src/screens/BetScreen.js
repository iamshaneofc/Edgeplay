import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BetSlipSingle from "../components/BetSlipSingle";
import EmptyState from "../components/EmptyState";
import { useLazyQuery } from '@apollo/client';
import { GET_BET } from '../graph-operations';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContext } from "../context";
import NetInfo from '@react-native-community/netinfo';
import InAppReview from 'react-native-in-app-review';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistAppReviewLastTime } from '../redux/features/userSlice';
import moment from "moment";
import { COLORS, FONT_SIZE, SPACING } from "../theme";

const Tab = createMaterialTopTabNavigator();

const ActiveBet = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const [betData, setBetData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getBet();

      async function showInAppReview() {
        try {
          const totalBetCount = await AsyncStorage.getItem("totalBetCount");
          const appReviewLastTime = await AsyncStorage.getItem("appReviewLastTime");

          if (totalBetCount > 5) {
            if (!appReviewLastTime) {
              InAppReview.RequestInAppReview()
                .then((hasFlowFinishedSuccessfully) => {
                  if (hasFlowFinishedSuccessfully) {
                    dispatch(persistAppReviewLastTime({ appReviewLastTime: moment().toString() }));
                  }
                })
                .catch((error) => console.log(error));
            } else {
              if (moment().diff(moment(appReviewLastTime), "days") >= 10) {
                InAppReview.RequestInAppReview()
                  .then((hasFlowFinishedSuccessfully) => {
                    if (hasFlowFinishedSuccessfully) {
                      dispatch(persistAppReviewLastTime({ appReviewLastTime: moment().toString() }));
                    }
                  })
                  .catch((error) => console.log(error));
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      showInAppReview();
    }, [])
  );

  const [getBet, { loading }] = useLazyQuery(GET_BET, {
    fetchPolicy: 'no-cache',
    variables: {
      jsWebToken: user.jsWebToken,
      pending: true
    },
    onCompleted(data) {
      if (data && data.getBet) setBetData(data.getBet);
    }
  });

  const renderCards = ({ item }) => (
    <BetSlipSingle item={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={betData}
        keyExtractor={(items) => items.id.toString()}
        renderItem={renderCards}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="query-builder"
            title="No Active Predictions"
            description="You don't have any pending predictions right now. Explore upcoming matches to place a prediction!"
          />
        }
      />
    </View>
  );
};

const EndedBet = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const [betData, setBetData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBet();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [getBet, { loading }] = useLazyQuery(GET_BET, {
    fetchPolicy: 'no-cache',
    variables: {
      jsWebToken: user.jsWebToken,
      pending: false
    },
    onCompleted(data) {
      if (data && data.getBet) setBetData(data.getBet);
    }
  });

  const renderCards = ({ item }) => (
    <BetSlipSingle eventIsOver item={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={betData}
        keyExtractor={(items) => items.id.toString()}
        renderItem={renderCards}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title="No Prediction History"
            description="You haven't completed any match predictions yet."
          />
        }
      />
    </View>
  );
};

const BetScreen = ({ navigation }) => {
  return (
    <View style={styles.backgroundColor}>
      <NavigationContext.Provider value={navigation}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textMuted,
            tabBarStyle: {
              backgroundColor: COLORS.cardBg,
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.cardBorder,
            },
            tabBarIndicatorStyle: {
              backgroundColor: COLORS.primary,
              height: 3,
            },
            tabBarLabelStyle: {
              fontWeight: "700",
              fontSize: FONT_SIZE.xs,
            },
          }}
        >
          <Tab.Screen name="Pending" component={ActiveBet} />
          <Tab.Screen name="Completed" component={EndedBet} />
        </Tab.Navigator>
      </NavigationContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  backgroundColor: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: SPACING.xl,
  }
});

export default BetScreen;
