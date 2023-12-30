import React from 'react';
import { TouchableOpacity, View, Text, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const WhatsAppElement = ({ phoneNumber, showNumber }) => {

  const openWhatsAppMessage = () => {
    try {
      Linking.openURL(`https://wa.me/${phoneNumber}`);
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    }
  };

  return (
    <TouchableOpacity onPress={openWhatsAppMessage} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="logo-whatsapp" size={40} color="green" style={{marginRight: 10}} />
      { showNumber && <Text style={{ marginLeft: 8 }}>{phoneNumber}</Text> }
    </TouchableOpacity>
  );
};

export default WhatsAppElement;
