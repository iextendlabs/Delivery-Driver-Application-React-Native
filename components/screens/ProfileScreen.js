import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Button,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginUrl, TokenUrl } from "../config/Api";
import axios from 'axios';
import messaging from "@react-native-firebase/messaging";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [error, setError] = useState();
  const [loginButtonText, setLoginButtonText] = useState("Login");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const requestNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        setNotificationsEnabled(true);
        await AsyncStorage.setItem('@notifications', true);
        const fcmToken = await messaging().getToken();
        return fcmToken;
      } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
        // Handle denied permission
      }
    } catch (error) {
      console.error("Error while requesting notification permission:", error);
      // Handle any errors that may occur during the permission request.
    }
    return null;
  };

  const toggleNotificationPermission = async () => {
    try {
      const userId = await AsyncStorage.getItem("@user_id");
      let device_token = '';
      if (notificationsEnabled) {
        // You can implement logic to disable notifications here
        setNotificationsEnabled(false);
        await AsyncStorage.removeItem('@notifications');
        await messaging().deleteToken();
      } else {
        device_token = requestNotificationPermission();
      }
      device_token = (typeof device_token === 'string' && device_token) || null;
      const response = await axios.post(TokenUrl, {
        user_id: userId,
        device_token: device_token,
      });

      if (response.status === 200) {
        Alert.alert('Notifications', 'Notifications Are Enabled');
      } else {
        Alert.alert('Notifications', 'Unable to Activate!');
      }
    } catch (error) {
      Alert.alert('Notifications', 'Unable to Activate!');
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      checkAuthentication();
      isAuthenticated && requestNotificationPermission();
    }, [])
  );

  useEffect(() => {
    checkAuthentication();
    try {

      messaging()
        .getToken()
        .then(fcmToken => {
          setFcmToken(fcmToken);
        });
    } catch (error) {

    }
  }, []);

  const checkAuthentication = async () => {
    try {
      const userId = await AsyncStorage.getItem("@user_id");
      setIsAuthenticated(!!userId);
    } catch (error) {
      setIsAuthenticated(false);
      console.log("Error retrieving user ID:", error);
    }
  };
  const handleLogin = async () => {
    setLoginButtonText("loading...");
    try {
      const response = await axios.post(LoginUrl, {
        username: username,
        password: password,
        fcmToken: fcmToken,
      });

      if (response.status === 200) {
        const userId = response.data.user.id;
        const accessToken = response.data.access_token;

        // Store access token in AsyncStorage
        await AsyncStorage.setItem('@access_token', accessToken);
        await AsyncStorage.setItem('@user_id', String(userId));
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        navigation.reset({
          index: 0,
          routes: [{ name: 'OrderList' }],
        });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("These credentials do not match our records.");
      // console.log("Error occurred during login:", error);
    }
    setLoginButtonText("Login");
  };

  const handleLogout = async () => {
    try {
      // Remove the user_id from AsyncStorage
      await AsyncStorage.removeItem('@user_id');
      await AsyncStorage.removeItem('@access_token');
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error occurred during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error}</Text>
      {isAuthenticated ? ( // Conditionally render the login form or logout button
        <>
          <Text>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotificationPermission}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{loginButtonText}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
