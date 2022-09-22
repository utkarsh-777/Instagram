import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentScreen from "./components/main/Comment";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import Header from "./components/home/Header";

const Stack = createStackNavigator();
const App = ({ navigation }) => {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoaded(true);
    });
  }, []);
  return (
    <>
      {!loaded ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {!loggedIn ? (
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen
                  name="Landing"
                  component={LandingScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          ) : (
            <Provider store={store}>
              <View style={styles.container}>
                <NavigationContainer theme={MyTheme}>
                  <Header />
                  <Stack.Navigator initialRouteName="Instagram">
                    <Stack.Screen
                      name="Instagram"
                      component={MainScreen}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Add"
                      component={AddScreen}
                      navigation={navigation}
                    />
                    <Stack.Screen
                      name="Comment"
                      component={CommentScreen}
                      navigation={navigation}
                    />
                    <Stack.Screen
                      name="Make post"
                      component={SaveScreen}
                      navigation={navigation}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </View>
            </Provider>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    marginTop: 35,
  },
});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "black",
    text: "white",
    background: "black",
  },
};

export default App;
