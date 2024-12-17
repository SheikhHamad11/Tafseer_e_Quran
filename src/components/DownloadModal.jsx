import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FileViewer from 'react-native-file-viewer';

const DownloadCompleteModal = ({visible, onClose, surahName, downloadDest}) => {
  const handleOpenFile = async () => {
    try {
      await FileViewer.open(downloadDest);
      console.log('File opened successfully');
    } catch (error) {
      console.log('Error opening file:', error);
      Alert.alert('Error', 'Could not open the downloaded audio file.');
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Download Complete</Text>
          <Text
            style={
              styles.message
            }>{`${surahName} has been downloaded successfully!`}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.openButton}
              onPress={handleOpenFile}>
              <Text style={styles.openButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  openButton: {
    backgroundColor: 'rgba(187, 148, 87, 0.8)', // green color for "Open"
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'black', // red color for "Cancel"
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DownloadCompleteModal;
