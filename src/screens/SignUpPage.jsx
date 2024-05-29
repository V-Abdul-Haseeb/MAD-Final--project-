import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setcPassword] = useState('')
  const navigation = useNavigation()
  const [waiting, setWaiting] = useState(false)
  const storeUser = async () => {
    try {
      await AsyncStorage.setItem('email', email)
      await AsyncStorage.setItem('isLogin', 'true')
    } catch (error) {
      console.error(error)
    }
  }
  const uploadDataToFireStore = () => {
    if (name != '' && email != '' && password != '' && cPassword != '') {
      if (password == cPassword) {
        setWaiting(true)
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async () => {
            const data = await firestore()
              .collection('users')
              .doc(email.toLocaleLowerCase().trim())
              .set({
                name: name,
                emailAddress: email.toLocaleLowerCase().trim(),
              })
              .then(async () => {
                alert('Account created Successfully!')
                storeUser()
                navigation.replace('BottomTab')
                setWaiting(false)
                const get = await AsyncStorage.getItem('isLogin')
                console.log(get)
              })
              .catch(error => {
                alert('Something went Wrong, Try again!', error)
                setWaiting(false)
              })
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              alert('That email address is already in use!')
              setWaiting(false)
            }
            if (error.code === 'auth/invalid-email') {
              alert('That email address is invalid!')
              setWaiting(false)
            }
            // console.error(error)
          })
      } else {
        alert('Passwords do not match!')
      }
    } else {
      alert('Provide Data in all the Fields')
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Icon
          name='angle-left'
          color='black'
          size={23}
          style={styles.iconBack}
          onPress={() => navigation.replace('LoginPage')}
        />
        <View style={styles.secondaryContainer}>
          <Image
            source={require('../assets/images/AppIcon.png')}
            style={styles.image}
          />
          <Text style={styles.tagline}>Create New Account!</Text>
          <View style={styles.textInputField}>
            <Icon name='user' color='grey' size={23} style={styles.icon} />
            <TextInput
              placeholder='Full Name'
              placeholderTextColor='grey'
              style={styles.TextInput}
              onChangeText={mail => setName(mail)}
            />
          </View>
          <View style={styles.textInputField}>
            <Icon name='envelope' color='grey' size={23} style={styles.icon} />
            <TextInput
              placeholder='Email Address'
              placeholderTextColor='grey'
              style={styles.TextInput}
              onChangeText={mail => setEmail(mail)}
            />
          </View>
          <View style={styles.textInputField}>
            <Icon name='lock' color='grey' size={30} style={styles.icon} />
            <TextInput
              secureTextEntry
              placeholder='Password'
              placeholderTextColor='grey'
              style={styles.TextInput}
              onChangeText={mail => setPassword(mail)}
            />
          </View>
          <View style={styles.textInputField}>
            <Icon
              name='lock'
              color='grey'
              size={30}
              style={[styles.icon, {left: 7}]}
            />
            <TextInput
              placeholder='Confirm Password'
              placeholderTextColor='grey'
              style={styles.TextInput}
              onChangeText={mail => setcPassword(mail)}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={uploadDataToFireStore}>
            <Text style={styles.ButtonText}>Sign Up!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {waiting && <Loader marginTop={0} />}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 50,
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputField: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
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
  iconBack: {
    position: 'absolute',
    top: 12,
    left: 5,
  },
  secondaryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  tagline: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    marginBottom: 30,
    fontSize: 20,
  },
  forgot: {
    textAlign: 'left',
    width: '100%',
    color: 'grey',
    fontFamily: 'Poppins-Medium',
  },
  button: {
    marginTop: 20,
    width: 333,
    backgroundColor: '#008080',
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

export default SignUpPage
