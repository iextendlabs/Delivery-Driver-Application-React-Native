import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStyles from "./components/styles/Main";
import OrderList from "./components/screens/OrderList";
import Notification from "./components/screens/Notification";
import ProfileScreen from "./components/screens/ProfileScreen";
import messaging from "@react-native-firebase/messaging";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();
const App = () => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [iconColor, setIconColor] = useState("#000");
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
      const userId = await AsyncStorage.getItem("@user_id");
      if (!userId) {
        setIsAuthenticated(false);
      }
      try {
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log(token);
            });
        } else {
          console.log("Failed token status", authStatus);
        }
        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then(async (remoteMessage) => {
            if (remoteMessage) {
              console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
              );
            }
          });

        // Assume a message-notification contains a "type" property in the data payload of the screen to open

        messaging().onNotificationOpenedApp(async (remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        });

        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
        });

        messaging().onMessage(async (remoteMessage) => {
          const { body, title } = remoteMessage.notification;
          Alert.alert(`${title}`, `${body}`);
        });
      } catch (error) { }
    };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Drawer.Navigator unmountInactiveRoutes={true}>
          <Drawer.Screen
            name="OrderList"
            options={({ navigation }) => ({
              title: "Home",
              headerRight: () => (
                <Icon
                  name="notifications-outline"
                  size={24}
                  color={iconColor}
                  style={{ marginRight: 10 }}
                  onPress={() => navigation.navigate("Notification")} // Navigate to Notification screen
                />
              ),
            })}
            component={OrderList}
          />
          <Drawer.Screen
            name="Notification"
            options={({ navigation }) => ({
              headerRight: () => (
                <Icon
                  name="home-outline"
                  size={24}
                  color="#000"
                  style={{ marginRight: 10 }}
                  onPress={() => navigation.navigate("OrderList")} // Navigate to Notification screen
                />
              ),
            })}
            component={Notification}
          />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create(MainStyles);

export default App;
