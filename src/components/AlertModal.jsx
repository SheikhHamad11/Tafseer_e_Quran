import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const CustomAlert = ({visible, onClose, onResume, surahName}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Resume Playback</Text>
          <Text style={styles.alertMessage}>
            Would you like to resume
            <Text style={{color: ' rgba(187, 148, 87, 1)'}}>
              {' '}
              "{surahName}"{' '}
            </Text>
            from where you left off?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.yesButton} onPress={onResume}>
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton} onPress={onClose}>
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Example styles for the custom alert
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'rgba(20, 20, 20, 1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  alertMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  yesButton: {
    backgroundColor: 'white', // green color for "Yes"
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  yesButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  noButton: {
    // backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white', // red color for "No"
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  noButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
