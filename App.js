import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
  const [iconColor, setIconColor] = useState("#000");

  const getNotificationsEnabled = async () => {
    const userId = await AsyncStorage.getItem("@notifications");
    return !!(userId);
  };

  const notificationsEnabled = getNotificationsEnabled(); // Implement this function to get the user's preference

if (notificationsEnabled) {
  try {
    messaging().onMessage(async (remoteMessage) => {
      const { body, title } = remoteMessage.notification;
            Alert.alert(`${title}`, `${body}`);
      // Handle in-foreground notifications
    });
  } catch (error) {
      
  }
}
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
