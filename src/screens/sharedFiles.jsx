import {useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import {NavBar} from '../components/Navbar'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'
import {CustomMapFunction} from '../components/CustomMapFunction'
// import {singleDocData} from './../functions/singleDocData'
import {firebase} from '@react-native-firebase/database'
import firestore, {Filter} from '@react-native-firebase/firestore'
import Loader from '../components/Loader'
import {singleDocData} from '../functions/singleDocData'
import CustomAlert from '../components/Alert'

const SharedFiles = () => {
  const navigation = useNavigation()
  const [waiting, setWaiting] = useState(false)
  const [name, setName] = useState('')
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const getUser = async () => {
    const login = await AsyncStorage.getItem('email')
    setUserEmail(login.toLocaleLowerCase())
    const data = await singleDocData('users', login.toLocaleLowerCase())
    setName(`${data.name?.split(' ')[0]} ${data.name?.split(' ')[1]}`)
  }
  useEffect(() => {
    getUser()
  }, [2])

  useEffect(() => {
    getFiles(userEmail.split('@')[0].toLocaleLowerCase())
  }, [userEmail])

  const [realtimeData, setRealTimeData] = useState([])
  const getFiles = email => {
    try {
      setRealTimeData([])
      setWaiting(true)
      firestore()
        .collection('files')
        .where(
          'sharedWith',
          'array-contains',
          userEmail.split('@')[0].toLowerCase(),
        )
        .get()
        .then(querySnapshot => {
          setRealTimeData([])
          if (!querySnapshot.empty) {
            querySnapshot.forEach(documentSnapshot => {
              setRealTimeData(prev => [...prev, documentSnapshot.data()])
              setWaiting(false)
            })
          } else {
            setWaiting(false)
          }
        })
    } catch (error) {
      setWaiting(false)
      console.error(error)
    }
  }
  return (
    <>
      <SafeAreaView style={styles.infoContainer}>
        <View style={{marginBottom: 10}}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Shared with me</Text>
          </View>
          <View style={{paddingHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{color: Colors.text, fontFamily: Fonts.medium}}>
                Files (Shared with {name})
              </Text>
            </View>
            {!waiting && (
              <View>
                <CustomMapFunction data={realtimeData} />
              </View>
            )}
            {waiting && <Loader />}
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
    // width: '100%',
    // paddingHorizontal: 10,
  },
  banner: {
    // flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
  },
  bannerText: {
    color: Colors.secondary,
    fontFamily: Fonts.bold,
    fontSize: 25,
    marginLeft: 20,
    margin: 7,
    textAlign: 'center',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  bannerImage: {height: 50, width: 50, borderRadius: 100},
})
export default SharedFiles
