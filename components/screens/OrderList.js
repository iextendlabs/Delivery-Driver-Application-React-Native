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
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderListStyle from "../styles/OrderListStyle";
import Icon from "react-native-vector-icons/Ionicons";
import { OrderDriverStatusUpdateUrl } from "../config/Api";
import LocationElement from "../modules/LocationElement";
import WhatsAppElement from "../modules/WhatsappElement";
import PhoneNumber from "../modules/PhoneNumber";
import OrderChatModal from "./OrderChatModal";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";

const OrderList = ({ initialParams }) => {
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderChatModalVisible, setOrderChatModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState('');
  const navigation = useNavigation();
  const [displayOrder, setDisplayOrder] = useState([]);
  const driverStatusActions = {
    "Pick me": "Accepted",
    "Accepted": "Coming",
    "Coming": "Arrived for pick",
    "Arrived for pick": "Traveling",
    "Traveling": "Dropped",
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  useEffect(() => {
    if (JSON.stringify(orders) !== JSON.stringify(displayOrder)) {
      setDisplayOrder(orders);
    }
  }, [orders]);

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
    const reloadApp = () => {
      !orderChatModalVisible && navigation.isFocused() && fetchOrders();
    };
    const intervalId = setInterval(reloadApp, 3000); // Reload every 2 seconds
    return () => clearInterval(intervalId);
  }, [orderChatModalVisible]);

  const fetchOrders = async () => {
    const userId = await AsyncStorage.getItem("@user_id");
    if (userId) {
      try {
        const response = await axios.get(
          `${OrderUrl}user_id=${userId}`
        );
        const { data } = response;
        setOrders(data.orders);
        setNotification(data.notification);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }],
      });
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
          <Text style={styles.heading}> ID: {item.id}</Text>
          <Text style={styles.heading}>{item.staff_name}</Text>
          <Text style={styles.text}>
            {item.city}, {item.area}, {item.buildingName}, {item.flatVilla},{" "}
            {item.street}
          </Text>
          <Text style={styles.text}>{item.time_slot_value}</Text>
          <Text style={styles.status}>{item.driver_status}</Text>
        </View>
        <View style={styles.OrderLinks}>
          <WhatsAppElement showNumber={false} phoneNumber={item.staff_whatsapp} />
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

          <Icon
            name="chatbubble-ellipses-outline"
            size={25}
            color="blue" // Change this to your desired color for 'Pending' status.
            style={styles.icons}
            onPress={() => handleOrderChatStatus(item)}
          />

          {item.driver_status in driverStatusActions && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOrderStatus(item, driverStatusActions[item.driver_status])}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Other order fields */}
      </TouchableOpacity>
    );
  };

  const handleOrderChatStatus = (order) => {
    // console.log(order.id);
    setSelectedOrder(order.id);
    setOrderChatModalVisible(true);
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
          },
        },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setOrderChatModalVisible(false);
    fetchOrders();
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
          data={displayOrder}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <OrderChatModal
        visible={orderChatModalVisible}
        order={selectedOrder}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create(OrderListStyle);

export default OrderList;
