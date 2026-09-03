import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TopTierLeaderBoards from "../components/TopTierLeaderBoard";
import LeadersBoardsSingle from "../components/LeadersBoardSingle";
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_STANDING, SAVE_LOCATION, SAVE_CONTACTS } from "../graph-operations";
import numeral from 'numeral';
import Geolocation from 'react-native-geolocation-service';
import Contacts from 'react-native-contacts';
import { COLORS, FONT_SIZE, SPACING } from '../theme';

const Tab = createMaterialTopTabNavigator();

const WeeklyBoards = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const [standingData, setStandingData] = useState([]);
  const [topStandingData, setTopStandingData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStanding();
    });
    return () => unsubscribe();
  }, []);

  const [getStanding, { loading }] = useLazyQuery(GET_STANDING, {
    fetchPolicy: 'no-cache',
    pollInterval: 60000,
    variables: {
      jsWebToken: user.jsWebToken,
      orderBy: { weekly_count: "desc" },
      take: 500
    },
    onCompleted(data) {
      if (data && data.standing) {
        const fullList = [...data.standing];
        setTopStandingData(fullList.slice(0, 3));
        setStandingData(fullList.slice(3));
      }
    }
  });

  const renderItems = ({ item, index }) => (
    <LeadersBoardsSingle position={index + 4} name={item.user_name} coins={numeral(item.weekly_count).format("0,0[.]00")} />
  );

  if (loading || topStandingData.length <= 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopTierLeaderBoards weekly topData={topStandingData} />
      <FlatList
        data={standingData}
        keyExtractor={(items) => items.id.toString()}
        renderItem={renderItems}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const MonthlyBoards = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const [standingData, setStandingData] = useState([]);
  const [topStandingData, setTopStandingData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStanding();
    });
    return () => unsubscribe();
  }, []);

  const [getStanding, { loading }] = useLazyQuery(GET_STANDING, {
    fetchPolicy: 'no-cache',
    pollInterval: 60000,
    variables: {
      jsWebToken: user.jsWebToken,
      orderBy: { monthly_count: "desc" },
      take: 500
    },
    onCompleted(data) {
      if (data && data.standing) {
        const fullList = [...data.standing];
        setTopStandingData(fullList.slice(0, 3));
        setStandingData(fullList.slice(3));
      }
    }
  });

  const renderItems = ({ item, index }) => (
    <LeadersBoardsSingle position={index + 4} name={item.user_name} coins={numeral(item.monthly_count).format("0,0[.]00")} />
  );

  if (loading || topStandingData.length <= 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopTierLeaderBoards monthly topData={topStandingData} />
      <FlatList
        data={standingData}
        keyExtractor={(items) => items.id.toString()}
        renderItem={renderItems}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const AllTimeBoards = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const [standingData, setStandingData] = useState([]);
  const [topStandingData, setTopStandingData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStanding();
    });
    return () => unsubscribe();
  }, []);

  const [getStanding, { loading }] = useLazyQuery(GET_STANDING, {
    fetchPolicy: 'no-cache',
    pollInterval: 60000,
    variables: {
      jsWebToken: user.jsWebToken,
      orderBy: { alltime_count: "desc" },
      take: 500
    },
    onCompleted(data) {
      if (data && data.standing) {
        const fullList = [...data.standing];
        setTopStandingData(fullList.slice(0, 3));
        setStandingData(fullList.slice(3));
      }
    }
  });

  const renderItems = ({ item, index }) => (
    <LeadersBoardsSingle position={index + 4} name={item.user_name} coins={numeral(item.alltime_count).format("0,0[.]00")} />
  );

  if (loading || topStandingData.length <= 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopTierLeaderBoards alltime topData={topStandingData} />
      <FlatList
        data={standingData}
        keyExtractor={(items) => items.id.toString()}
        renderItem={renderItems}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const LeadersBoards = () => {
  const user = useSelector(state => state.user);

  useEffect(() => {
    getLocation();
    getAllContacts();
  }, []);

  const [saveLocation] = useMutation(SAVE_LOCATION, {
    onError(error) {
      console.log("Error location ", error);
    }
  });

  const [saveContacts] = useMutation(SAVE_CONTACTS, {
    onError(error) {
      console.log("Error contacts ", error);
    }
  });

  const getLocation = async () => {
    try {
      let perm = false;
      if (Platform.OS === "ios") {
        await Geolocation.requestAuthorization("whenInUse");
        perm = true;
      } else {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (hasPermission) perm = true;
      }

      if (perm) {
        Geolocation.watchPosition(
          (position) => {
            saveLocation({
              variables: {
                jsWebToken: user.jsWebToken,
                accuracy: position.coords.accuracy.toString(),
                altitude: position.coords.altitude.toString(),
                heading: position.coords.heading.toString(),
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString(),
                speed: position.coords.speed.toString(),
              }
            });
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, forceRequestLocation: true, showLocationDialog: false }
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAllContacts = async () => {
    try {
      if (Platform.OS === "ios") {
        await Contacts.checkPermission();
        await Contacts.getAll()
          .then((contacts) => {
            saveContacts({
              variables: {
                jsWebToken: user.jsWebToken,
                data: contacts
              }
            });
          })
          .catch(err => console.log(err));
      } else {
        const userResponse = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
        if (PermissionsAndroid.RESULTS.GRANTED === userResponse) {
          await Contacts.getAll()
            .then((contacts) => {
              saveContacts({
                variables: {
                  jsWebToken: user.jsWebToken,
                  data: contacts
                }
              });
            })
            .catch(err => console.log(err));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
          fontSize: FONT_SIZE.xs,
          fontWeight: "700",
        }
      }}
    >
      <Tab.Screen name="Weekly" component={WeeklyBoards} />
      <Tab.Screen name="Monthly" component={MonthlyBoards} />
      <Tab.Screen name="All-Time" component={AllTimeBoards} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.md,
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

export default LeadersBoards;
