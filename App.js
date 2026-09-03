import React from "react";
import type { Node } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import store from "./src/redux/store";
import { Provider } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import { rootDrawerNavigator } from "./src/routes";
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import { Platform } from "react-native";
import { ANDROID_API_HOST, IOS_API_HOST } from "@env";
import analytics from '@react-native-firebase/analytics';
import mobileAds from 'react-native-google-mobile-ads';
import SplashScreen from "react-native-splash-screen";
import { COLORS } from './src/theme';

const customFetch = async (uri, options, retries = 2) => {
  try {
    const response = await fetch(uri, options);
    const contentType = response.headers ? response.headers.get("content-type") : "";

    if (response.status === 503 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return customFetch(uri, options, retries - 1);
    }

    if (!response.ok || (contentType && !contentType.includes("application/json"))) {
      const text = await response.text();
      if (text.startsWith("<") || (contentType && !contentType.includes("application/json"))) {
        return new Response(
          JSON.stringify({
            errors: [
              {
                message: `Server is spinning up. Please tap Create Account again in a few seconds.`
              }
            ]
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return customFetch(uri, options, retries - 1);
    }
    return new Response(
      JSON.stringify({
        errors: [
          {
            message: "Unable to connect to server. Please check your internet connection."
          }
        ]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const httpLink = createHttpLink({
  uri: Platform.OS === "ios" ? IOS_API_HOST : ANDROID_API_HOST,
  fetch: customFetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

mobileAds()
  .initialize()
  .then(adapterStatuses => console.log("Admob initialized", adapterStatuses))
  .catch(err => console.log("Admob init error", err));

const Drawer = createDrawerNavigator();

const App: () => Node = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            if (navigationRef.current && navigationRef.current.getCurrentRoute()) {
              routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }
          }}
          onStateChange={async () => {
            if (navigationRef.current && navigationRef.current.getCurrentRoute()) {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current.getCurrentRoute().name;

              if (previousRouteName !== currentRouteName) {
                try {
                  await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName,
                  });
                } catch (e) {
                  console.log(e);
                }
              }
              routeNameRef.current = currentRouteName;
            }
          }}
        >
          <Drawer.Navigator
            initialRouteName="EdgePlay"
            screenOptions={{
              gestureEnabled: false,
              swipeEnabled: false,
              drawerStyle: {
                backgroundColor: COLORS.bgPrimary,
                width: 280,
              },
              drawerActiveTintColor: COLORS.primary,
              drawerInactiveTintColor: COLORS.textSecondary,
            }}
            drawerContent={(props) => (<CustomDrawerContent {...props} />)}
          >
            <Drawer.Screen
              name="EdgePlay"
              component={rootDrawerNavigator}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <FontAwesome5Icons name="trophy" size={moderateScale(16)} color={COLORS.primary} />
                ),
                headerShown: false
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
