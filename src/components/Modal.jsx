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
      onRequestClose={closeModal}
      style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={closeModal}
        style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{marginVertical: 4}}>
              <TouchableOpacity
                className="items-center justify-center"
                onPress={() =>
                  Linking.openURL('https:www.quranurdu.com/tafa/')
                }>
                <Icon name="earth-americas" size={35} color="rgba(0,0,0,0.9)" />
              </TouchableOpacity>
            </View>
            <View className="border border-gray-800 px-7"></View>
            <View style={{marginVertical: 4}}>
              <TouchableOpacity
                className="items-center justify-center"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Contact');
                }}>
                <Icon name="envelope" size={35} color="rgba(0,0,0,0.9)" />
              </TouchableOpacity>
            </View>
            <View className="border border-gray-800 px-7"></View>
            <View style={{margin: 4}}>
              <TouchableOpacity
                className="items-center justify-center"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('About');
                }}>
                <Icon name="file-alt" size={35} color="rgba(0,0,0,0.9)" />

                {/* <Icon icon="fa-file-alt" size={35} color="#0274B3" /> */}
              </TouchableOpacity>
            </View>

            {/* <Button title="Close Modal" onPress={closeModal} /> */}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    // flex: 1,
    paddingTop: 60,
    // paddingEnd: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'rgba(149, 129, 69, 0.7)',
    marginEnd: 10,
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    // elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
