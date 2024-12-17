import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

const Header = ({modalVisible, setModalVisible}) => {
  const closeModal = () => {
    setModalVisible(false);
  };
  const navigation = useNavigation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <TouchableOpacity onPressOut={closeModal} style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            className="items-center justify-center"
            onPress={() => Linking.openURL('https:www.quranurdu.com/tafa/')}>
            <Icon
              name="earth-americas"
              size={30}
              color="rgba(187, 148, 87, 1)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center justify-center"
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('Contact');
            }}>
            <Icon name="envelope" size={30} color="rgba(187, 148, 87, 1)" />
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center justify-center"
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('About');
            }}>
            <Icon name="file-alt" size={30} color="rgba(187, 148, 87, 1)" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Header;

const styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: Dimensions.get('window').height,
    paddingTop: 60,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'black',
    marginEnd: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
    elevation: 10,
  },
});
