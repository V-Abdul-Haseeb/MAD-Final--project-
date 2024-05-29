import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Animated,
} from 'react-native'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import {NavBar} from '../components/Navbar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {singleDocData} from '../functions/singleDocData'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomAlert from './../components/Alert'
import {useNavigation} from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {sendNotification} from '../functions/pushNotifications'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNFetchBlob from 'rn-fetch-blob'
const Settings = () => {
  const [name, setName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const navigation = useNavigation()
  const [count, setCount] = useState(0)
  const [filePath, setFilePath] = useState('');
  const getUser = async () => {
    const login = await AsyncStorage.getItem('email')
    setUserEmail(login.toLocaleLowerCase())
    const data = await singleDocData('users', login.toLocaleLowerCase())
    setName(data.name)
    try {
      const querySnapshot = await firestore()
        .collection('files')
        .where('owner', '==', userEmail.split('@')[0].toLocaleLowerCase())
        .get()

      setCount(querySnapshot.size)
    } catch (error) {
      console.error('Error fetching file count:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [2])
  console.log(count)
  const signOutFunction = () => {
    auth()
      .signOut()
      .then(async () => {
        setLogoutModalVisible(false)
        await AsyncStorage.setItem('isLogin', 'false')
        navigation.replace('LoginPage')
        ToastAndroid.show('User Log out!', ToastAndroid.SHORT)
      })
  }
  const pushNotificationTest = async () => {
    // await sendNotification(
    //   'mahed442@gmail.com',
    //   'File Shared',
    //   `${name.split(' ')[0]} shared a File with you`,
    // )
    let options = {
      html: 
      `<h1>Hello</h1>
      <p>This is a test PDF File</p>`,
      fileName: 'test',
      directory: 'Documents',
      base64: true
    }

    let file = await RNHTMLtoPDF.convert(options)
    let filePath = RNFetchBlob.fs.dirs.DownloadDir+'/test.pdf'
    RNFetchBlob.fs.writeFile(filePath,file.base64, 'base64').then(response => {

      console.log(filePath);
    }).catch(error => console.error(error))
  }
  return (
    <View style={styles.infoContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/me.jpg')}
            style={styles.image}
          />
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: Colors.primary, width: '90%', borderRadius: 10},
            ]}></Animated.View>
          <Text style={styles.storageText}>Storage</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Recycle Bin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={pushNotificationTest}>
            <Text style={styles.buttonText}>Share Feedback</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setLogoutModalVisible(true)
          }}>
          <View style={styles.logout}>
            <Ionicons
              name='log-out-outline'
              size={35}
              color={Colors.secondary}
            />
            <Text style={[styles.buttonText, {marginTop: 2}]}>Logout!</Text>
          </View>
        </TouchableOpacity>
      </View>
      {logoutModalVisible && (
        <CustomAlert
          title={'Logout'}
          message={'Are you sure want to logout?'}
          buttonSuccess={'Logout'}
          buttonCancel={true}
          onPressSuccess={signOutFunction}
          onPressCancel={() => {
            setLogoutModalVisible(false)
          }}
        />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  mainContainer: {
    flex: 0.93,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  text: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    fontSize: 25,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingVertical: 20,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.secondary,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    fontSize: 20,
  },
  logout: {
    width: '35%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  progressBar: {
    height: 20,
    width: '90%',
    backgroundColor: Colors.darkGrey,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storageText: {
    color: Colors.text,
    fontFamily: Fonts.regular,
  },
})
export default Settings
