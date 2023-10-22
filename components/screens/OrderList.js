import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { OrderUrl } from "../config/Api";
import { useRoute } from "@react-navigation/native";
import OrderLinks from "../modules/OrderLinks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderListStyle from "../styles/OrderListStyle";
import Icon from "react-native-vector-icons/Ionicons";
import { OrderDriverStatusUpdateUrl } from "../config/Api";
import LocationElement from "../modules/LocationElement";
import WhatsAppElement from "../modules/WhatsappElement";
import PhoneNumber from "../modules/PhoneNumber";

const OrderList = ({ initialParams }) => {
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const setSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const setError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userId = await AsyncStorage.getItem("@user_id");
    if (userId) {
      setLoading(true);
      try {
        const response = await fetch(OrderUrl + "user_id=" + userId);
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigation.navigate("Login");
    }
  };

  const renderOrder = ({ item }) => {
    const status = item.driver_status;
    let statusStyle = {};

    if (status === "Arrived for pick") {
      statusStyle = styles.arrivedPick;
    } else if (status === "Pick me") {
      statusStyle = styles.pickMe;
    } else {
      statusStyle = styles[status];
    }
    return (
      <TouchableOpacity style={[styles.orderContainer, statusStyle]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>{item.staff_name}</Text>
          <Text style={styles.heading}> ID: {item.id}</Text>
          <Text style={styles.text}>
            {item.city}, {item.area}, {item.buildingName}, {item.flatVilla},{" "}
            {item.street}
          </Text>
          <Text style={styles.text}>{item.time_slot_value}</Text>
          <Text style={styles.status}>{item.driver_status}</Text>
        </View>
        <View style={styles.OrderLinks}>
          <WhatsAppElement showNumber={false} phoneNumber={item.staff_number} />
          <PhoneNumber phoneNumber={item.staff_number} showNumber={true} />
          <LocationElement
            latitude={item.latitude}
            longitude={item.longitude}
            address={
              item.buildingName +
              " " +
              item.street +
              "," +
              item.area +
              " " +
              item.city
            }
          />
          {item.driver_status === "Pick me" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, "Accepted")}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}

          {item.driver_status === "Accepted" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, "Coming")}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
          {item.driver_status === "Coming" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, "Arrived for pick")}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}

          {item.driver_status === "Arrived for pick" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, "Traveling")}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}

          {item.driver_status === "Traveling" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, "Dropped")}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Other order fields */}
      </TouchableOpacity>
    );
  };

  const handleOrderStatus = async (order, status) => {
    const userId = await AsyncStorage.getItem("@user_id");
    Alert.alert(
      "Confirm",
      "Are you sure to change order status to " + status + "?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(
                OrderDriverStatusUpdateUrl +
                  order.id +
                  "?status=" +
                  status +
                  "&user_id=" +
                  userId
              );

              if (!response.ok) {
                throw new Error("Failed to " + status + " order.");
              }

              setSuccess("Order " + status + " successfully.");
              fetchOrders();
            } catch (error) {
              setError("Failed to " + status + " order. Please try again.");
            }
            setLoading(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.orderText}>Total Orders: {orders.length}</Text>
      {successMessage !== "" && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
      {errorMessage !== "" && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
      {orders.length === 0 ? (
        <Text style={styles.noItemsText}>No Order</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create(OrderListStyle);

export default OrderList;
