import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
  title: string | null;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  position?: 'middle' | 'bottom';
  ok?: string | null;
  cancel?: string | null;
  cancelDisplayed?: boolean;
  visible : boolean
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  position = 'middle',
  ok = 'OK',
  cancel = 'Cancel',
  cancelDisplayed = false,
  visible = false
}) => {

  return (
    <View>

      {position == 'bottom' ?
       (<Modal
    isVisible={visible}
    backdropOpacity={0.4}
    animationIn={'slideInUp'}
    animationOut={'slideOutDown'}
    style={styles.bottomModal}
    >
      
      <View style={styles.alertBoxb}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainerb}>
          <TouchableOpacity
            style={styles.buttonb}
            onPress={() => {
              onConfirm?.();
            }}
          >
            {cancelDisplayed && (
            <TouchableOpacity
              style={[styles.buttonb, styles.cancelButtonb]}
              onPress={() => {
                onCancel?.();
              }}
            >
              <Text style={styles.cancelTextb}>{cancel}</Text>
            </TouchableOpacity>
          )}

          
            <Text style={styles.confirmTextb}>{ok}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>) : (<Modal
    isVisible={visible}
    backdropOpacity={0.4}
    animationIn={ 'zoomIn'}
    animationOut={ 'zoomOut'}
    style={ undefined}
    >
      
      <View style={styles.alertBox}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainer}>
          {cancelDisplayed && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                onCancel?.();
              }}
            >
              <Text style={styles.cancelText}>{cancel}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onConfirm?.();
            }}
          >
            <Text style={styles.confirmText}>{ok}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>)}
    </View>
    
  );
};
export default CustomAlert;
const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.85,
    alignSelf: 'center',
    marginBottom: 30,
  },alertBoxb: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: Dimensions.get('window').width ,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },buttonContainerb: {
    flexDirection: 'column',
    gap: 10,
    width: "100%"
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },buttonb: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center'
   },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },confirmTextb: {
    color: '#fc0000fe',
    fontWeight: 'bold',
    textAlign: "center"
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },cancelButtonb: {

  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center'
  },cancelTextb: {
    color: '#1803ff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
})