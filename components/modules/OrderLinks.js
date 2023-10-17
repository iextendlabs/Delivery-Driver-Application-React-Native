import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import MainStyles from "../styles/Main";
const styles = StyleSheet.create(MainStyles);
import { useNavigation } from "@react-navigation/native";

const OrderLinks = () => {
  const navigation = useNavigation();

  const DriveToPickOrder = () => {
    navigation.navigate("OrderList", { status: "Drive to pick" });
  };

  const PendingOrder = () => {
    navigation.navigate("OrderList", { status: "Pending" });
  };

  const PickedOrder = () => {
    navigation.navigate("OrderList", { status: "Picked" });
  };

  const DropOrder = () => {
    navigation.navigate("OrderList", { status: "Drop" });
  };

  const WaitingOrder = () => {
    navigation.navigate("OrderList", { status: "Waiting" });
  };

  const AcceptedOrder = () => {
    navigation.navigate("OrderList", { status: "Accepted" });
  };

  return (
    <View>
      <View style={styles.screenContainer}>
        <TouchableHighlight style={styles.button} onPress={PendingOrder}>
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={AcceptedOrder}>
          <Text style={styles.buttonText}>Accepted</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={DriveToPickOrder}>
          <Text style={styles.buttonText}>Drive to pick</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.screenContainer}>
        <TouchableHighlight style={styles.button} onPress={PickedOrder}>
          <Text style={styles.buttonText}>Picked</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={DropOrder}>
          <Text style={styles.buttonText}>Drop</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={WaitingOrder}>
          <Text style={styles.buttonText}>Waiting</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default OrderLinks;
