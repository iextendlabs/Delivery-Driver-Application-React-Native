import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import OrderListStyle from "../styles/OrderListStyle";
import { OrderChatUrl } from "../config/Api";
import { AddOrderChatUrl } from "../config/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OrderChatModal = ({ visible, order, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChat] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const handleModalClose = () => {
    onClose();
  };

  useEffect(() => {
    if (visible && order) {
      setChat(null);
      fetchChat();
      const reloadApp = () => {
        fetchChat();
      };
      const intervalId = setInterval(reloadApp, 2000); // Reload every 2 seconds
      return () => clearInterval(intervalId);
    }
  }, [visible, order]);

  const fetchChat = async () => {
    setUserId(await AsyncStorage.getItem("@user_id"));
    try {
      const response = await axios.get(`${OrderChatUrl}order_id=${order}`);
      setChat(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const handleSubmitChat = async () => {
    if (text.trim() === "") {
      setErrorMessage("Please enter a Text.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("order_id", order);
      formData.append("text", text);
      formData.append("user_id", userId);

      const response = await axios.post(AddOrderChatUrl, formData);

      if (response.status === 200) {
        setSuccessMessage("Chat Update successfully.");
        setChat(response.data);
        setText("");
      } else {
        throw new Error("Failed to Update Chat.");
      }
    } catch (error) {
      setErrorMessage("Failed to Update Chat. Please try again.");
    }

    setIsLoading(false);
  };

  const renderChat = ({ item }) => {
    const chatStyle =
      userId === item.user_id
        ? styles.otherMessageContainer
        : styles.userMessageContainer;

    return (
      <View style={chatStyle}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageRole}>{item.role} {item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.chatModalContent}>
          <Text style={styles.modalTitle}>Chat</Text>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <FlatList
              data={chats}
              renderItem={renderChat}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text style={styles.noItemsText}>No Chat</Text>
              }
            />
          )}

          <View style={styles.commentContainer}>
            <Text style={styles.label}>Text:</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Enter your Text"
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitChat}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
            {successMessage !== "" && (
              <Text style={styles.successMessage}>{successMessage}</Text>
            )}
            {errorMessage !== "" && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleModalClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create(OrderListStyle);

export default OrderChatModal;
