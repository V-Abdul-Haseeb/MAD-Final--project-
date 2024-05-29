import {useState, useRef, useEffect} from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Dimensions,
} from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RBSheet from 'react-native-raw-bottom-sheet'
import {useNavigation} from '@react-navigation/native'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import {singleDocData} from '../functions/singleDocData'
import Loader from './Loader'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {firebase} from '@react-native-firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import CustomAlert from './Alert'
import {TextInput} from 'react-native-gesture-handler'

export const SearchMapFunction = ({data}) => {
  const navigation = useNavigation()
  const [folders, setFolders] = useState([])
  const [selected, setSelected] = useState([])
  const [waiting, setWaiting] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [newName, setNewName] = useState('')
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [button, setButton] = useState('')
  const refRBSheet = useRef()
  const Array = Object.keys(data).map(key => ({id: key, ...data[key]}))
  const sortByType = (a, b) => {
    if (a.type < b.type) return 1
    if (a.type > b.type) return -1
    return 0
  }
  const dataArray = Array.sort(sortByType)
  const [userEmail, setUserEmail] = useState('')
  const getUser = async () => {
    const login = await AsyncStorage.getItem('email')
    setUserEmail(login.toLocaleLowerCase())
  }
  useEffect(() => {
    getUser()
  }, [userEmail])

  const navigateFunction = async i => {
    setWaiting(true)
    if (i.type == 'folder') {
      console.log(i.id)
      try {
        navigation.navigate('OpenFolder', {
          parent: i,
        })

        setWaiting(false)
      } catch (error) {
        console.error(error)
        setWaiting(false)
      }
      setWaiting(false)
    } else {
      console.log(i.id)
      try {
        if (i.type == 'file') {
          try {
            const data = await firestore().collection('files').doc(i.id).get()
            navigation.navigate('ReadNotes', {data: data})
            setWaiting(false)
          } catch (error) {
            console.log(error)
          }
        }

        setWaiting(false)
      } catch (error) {
        console.error(error)
        setWaiting(false)
      }
      setWaiting(false)
    }
  }

  useEffect(() => {
    console.log(selected)
  }, [selected])

  const renderItem = ({item}) => <Item item={item} />
  const Item = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateFunction(item)}
      onLongPress={() => {
        setSelected(item)
        refRBSheet.current.open()
      }}>
      {item.type == 'file' && (
        <Image
          source={require('../assets/images/file.png')}
          style={{height: 80, width: 100}}
          resizeMode='contain'
        />
      )}

      {item.type == 'folder' && (
        <Image
          source={require('../assets/images/FolderIcon.png')}
          style={{height: 80, width: 100}}
          resizeMode='contain'
        />
      )}
      {/* <MaterialIcons
        name={item.status == 'public' ? 'public' : 'public-off'}
        size={15}
        color={item.status == 'public' ? Colors.secondary : Colors.private}
        style={
          item.type == 'file' ? styles.publicFileIndicator : styles.publicIcon
        }
      /> */}
      <Text style={styles.Title}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View>
      {data != [] && (
        <FlatList
          data={dataArray}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{marginBottom: 10, width: '100%'}}
          // scrollEnabled={false}
          numColumns={4}
          contentContainerStyle={{justifyContent: 'space-between'}}
        />
      )}
      {data.length <= 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 300,
          }}>
          <Image
            source={require('../assets/images/empty.png')}
            style={{width: 200}}
            resizeMode='contain'
          />
        </View>
      )}

      {waiting && <Loader />}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 5,
    paddingVertical: 5,
    width: '22.45%',
    alignItems: 'center',
    marginHorizontal: 5,
    height: 130,
  },
  Title: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
    textAlign: 'center',
  },
  status: {
    fontFamily: Fonts.regular,
    color: Colors.text,
    fontSize: 10,
  },
  date: {
    fontFamily: Fonts.light,
    color: Colors.text,
    fontSize: 10,
    marginTop: -14,
  },
  detailsContainer: {
    width: '75%',
    justifyContent: 'center',
  },
  threeDots: {
    position: 'absolute',
    right: 4,
    top: 25,
  },
  publicIcon: {
    position: 'absolute',
    bottom: 54,
    right: 9,
  },
  publicFileIndicator: {
    position: 'absolute',
    bottom: 54,
    right: 9,
  },
  text: {color: Colors.text, fontFamily: Fonts.regular},
})
