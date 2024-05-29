import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Loader from '../components/Loader';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../configs/Colors';
import CustomAlert from '../components/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const storeUser = async () => {
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('isLogin', 'true');
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogin = async () => {
    if (email == '' || password == '') {
      setModalVisible(true);
    } else {
      setWaiting(true);
      auth()
        .signInWithEmailAndPassword(email.trim(), password)
        .then(async () => {
          storeUser();
          navigation.replace('BottomTab');
          setWaiting(false);
          const get = await AsyncStorage.getItem('isLogin');
          console.log(get);
        })
        .catch(error => {
          if (error.code === 'auth/network-request-failed') {
            setWaiting(false);
            Alert.alert('Please check your Internet Connection!');
          } else {
            setWaiting(false);
            Alert.alert('InValid Email Address or Password!');
          }
        });
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.secondaryContainer}>
          <Image
            source={require('../assets/images/AppIcon.png')}
            style={styles.image}
          />
          <Text style={styles.tagline}>Sign in to Your Account</Text>
          <View style={styles.textInputField}>
            <Icon name="envelope" color="grey" size={23} style={styles.icon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="grey"
              style={styles.TextInput}
              onChangeText={mail => setEmail(mail)}
            />
          </View>
          <View style={styles.textInputField}>
            <Icon
              name="lock"
              color="grey"
              size={30}
              style={[styles.icon, {left: 7}]}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="grey"
              style={styles.TextInput}
              onChangeText={mail => setPassword(mail)}
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            style={{width: 325}}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={{width: '100%'}}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.ButtonText}>Login!</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.tagline,
              {fontSize: 10, marginTop: 20, marginBottom: 10},
            ]}>
            Don't have an Account?
          </Text>
          <Text
            onPress={() => {
              navigation.replace('SignUpPage');
            }}
            style={[
              styles.tagline,
              {
                fontSize: 18,
                marginTop: 1,
                fontFamily: 'Poppins-Medium',
                textDecorationLine: 'underline',
              },
            ]}>
            Sign Up Now!
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {waiting && <Loader marginTop={0} />}
      {modalVisible && (
        <CustomAlert
          title={'Error'}
          message={'Please Enter data in All Fields'}
          buttonSuccess={'Ok!'}
          buttonCancel={false}
          onPressSuccess={() => {
            setModalVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    width: '90%',
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
    fontFamily: 'Poppins-Medium',
    marginBottom: 30,
    fontSize: 16,
  },
  forgot: {
    textAlign: 'left',
    width: '100%',
    color: 'grey',
    fontFamily: 'Poppins-Medium',
  },
  button: {
    marginTop: 20,
    width: '93%',
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
});

export default LoginPage;
