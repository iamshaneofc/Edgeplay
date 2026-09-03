import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { LEAGUES } from "../graph-operations";
import EventListSingle from "../components/EventListSingle";
import EmptyState from "../components/EmptyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from 'react-redux';
import analytics from "@react-native-firebase/analytics";
import { COLORS, SPACING } from "../theme";

const LeagueListScreen = ({ route, navigation }) => {
  const [leaguesList, setLeaguesList] = useState([]);
  const { sport, liveScore } = route.params;
  const [jsWebToken, setJsWebToken] = useState("");

  const user = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLeagues();
    });
    getToken();

    return () => {
      unsubscribe();
    };
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("jsWebToken");
    if (token) setJsWebToken(token);
  };

  const [getLeagues, { loading }] = useLazyQuery(LEAGUES, {
    fetchPolicy: 'no-cache',
    pollInterval: 200000,
    variables: {
      jsWebToken: user.jsWebToken,
      sport
    },
    onCompleted(data) {
      if (data && data.leagues) {
        setLeaguesList(data.leagues);
      }
    }
  });

  if (loading || !jsWebToken) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handleOnPress = async (item) => {
    if (liveScore)
      return navigation.navigate("LeagueLive", {});

    try {
      await analytics().logEvent('click_on_league', {
        country: item.country,
        leagueName: item.leagueName,
        name: item.name
      });
    } catch (e) {
      console.log(e);
    }

    navigation.navigate("GamesList", {
      matchIDs: item.matchIds,
      country: item.country,
      leagueName: item.leagueName,
      name: item.name,
      sport
    });
  };

  const renderLeague = ({ item }) => (
    <EventListSingle
      key={item.leagueId}
      request={false}
      onPress={() => handleOnPress(item)}
      text={`${item.name || item.leagueName}`}
      icon={item.logo ? item.logo.replace("http", "https") : `https://countryflagsapi.com/png/${item.country}`}
      liveCount={item.scheduledGames}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leaguesList}
        keyExtractor={(items) => items.leagueId}
        renderItem={renderLeague}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="emoji-events"
            title="No Leagues Available"
            description="There are currently no active leagues for this category."
          />
        }
      />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  }
});

export default LeagueListScreen;
