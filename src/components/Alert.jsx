import React, {useState} from 'react'
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'

const CustomAlert = props => {
  const [modalVisible, setModalVisible] = useState(props?.visible)
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={true}
        // onRequestClose={() => {
        //   Alert.alert('Modal has been closed.')
        //   setModalVisible(!modalVisible)
        // }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{props?.title}</Text>
            {props?.message && (
              <Text style={styles.modalMessage}>{props?.message}</Text>
            )}
            {props?.textInput && (
              <TextInput
                style={{
                  borderWidth: 1,
                  marginBottom: 20,
                  width: '100%',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  fontFamily: Fonts.medium,
                  color: Colors.text,
                }}
                placeholder={props?.textInput}
                placeholderTextColor={Colors.darkGrey}
                onChangeText={i => props?.onChange(i)}
                value={props?.value}
              />
            )}
            <View
              style={[
                styles.buttonContainer,
                props?.buttonCancel
                  ? {
                      justifyContent: 'space-between',
                    }
                  : {
                      justifyContent: 'center',
                    },
              ]}>
              {props?.buttonCancel && (
                <TouchableOpacity
                  style={[styles.buttonCancel]}
                  onPress={props?.onPressCancel}>
                  <Text style={[styles.textStyle, {color: Colors.text}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={props?.onPressSuccess}>
                <Text style={styles.textStyle}>{props?.buttonSuccess}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: Colors.primary,
  },
  textStyle: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 20,
  },
  modalMessage: {
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.medium,
  },
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
  },
  buttonCancel: {
    borderRadius: 10,
    padding: 10,
    width: '45%',
    borderWidth: 1,
    borderColor: Colors.darkGrey,
  },
})

export default CustomAlert
