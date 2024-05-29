import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native'
import Loader from '../components/Loader'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Colors} from '../configs/Colors'
import CustomAlert from '../components/Alert'
import {Fonts} from '../configs/Fonts'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const navigation = useNavigation()
  const [modalMessage, setModalMessage] = useState('')
  const handleForget = async () => {
    if (email == '') {
      setModalVisible(true)
    } else {
      try {
        setWaiting(true)
        auth().sendPasswordResetEmail(email.trim())

        setWaiting(false)
        setModalMessage(
          'Password Reset Link sent to ' + email + '\nPlease check your Inbox!',
        )
        setModalVisible2(true)
      } catch (error) {
        setWaiting(false)
        console.log(error)
        if (error.message === 'Firebase: Error (auth/user-not-found).') {
          alert('There is no user corresponding to this email address.')
        } else if (errorCode == 'auth/invalid-email') {
          alert(errorMessage)
        }
      }
    }
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      {!waiting && (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.secondaryContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Ionicons
                name='arrow-back'
                color={Colors.text}
                size={26}
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.tagline}>Forgot Password</Text>
            </View>
            <View style={styles.textInputField}>
              <Icon
                name='envelope'
                color='grey'
                size={23}
                style={styles.icon}
              />
              <TextInput
                placeholder='Email Address'
                placeholderTextColor='grey'
                style={styles.TextInput}
                onChangeText={mail => setEmail(mail)}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleForget}>
              <Text style={styles.ButtonText}>Send Verification Link!</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      )}

      {waiting && <Loader marginTop={0} />}
      {modalVisible && (
        <CustomAlert
          title={'Error'}
          message={'Please Enter data in All Fields'}
          buttonSuccess={'Ok!'}
          buttonCancel={false}
          onPressSuccess={() => {
            setModalVisible(false)
          }}
        />
      )}

      {modalVisible2 && (
        <CustomAlert
          title={''}
          message={modalMessage}
          buttonSuccess={'Ok!'}
          buttonCancel={false}
          onPressSuccess={() => {
            setModalVisible(false)
          }}
        />
      )}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  textInputField: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  TextInput: {
    borderBottomWidth: 1,
    width: '100%',
    paddingLeft: 45,
    fontFamily: 'Poppins-Regular',
    borderBottomColor: 'grey',
    fontSize: 17,
    color: 'black',
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    top: 8,
    left: 5,
  },
  secondaryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    color: 'black',
    fontFamily: Fonts.bold,
    fontSize: 26,
    textAlign: 'left',
    width: 295,
    marginLeft: 10,
  },
  button: {
    marginTop: 5,
    width: 333,
    backgroundColor: Colors.primary,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  ButtonText: {
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
})

export default ForgotPassword
