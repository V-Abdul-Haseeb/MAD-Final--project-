import {useState, useEffect} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import {useNavigation} from '@react-navigation/native'
import {CustomMapFunction} from '../components/CustomMapFunction'
import firestore from '@react-native-firebase/firestore'
import Loader from '../components/Loader'

const OpenFolder = ({route}) => {
  // const jsonData = route.params.data
  // const data = JSON.parse(jsonData)
  const parent = route.params.parent
  const [folders, setFolders] = useState([])
  const navigation = useNavigation()
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    setWaiting(true)
    try {
      await firestore()
        .collection('files')
        .where('parent', '==', parent.id)
        .get()
        .then(querySnapshot => {
          setFolders([])
          querySnapshot.forEach(documentSnapshot => {
            setFolders(prev => [...prev, documentSnapshot.data()])
            setWaiting(false)
          })
        })
      console.log(folders)
      // navigation.navigate('OpenFolder', {
      //   parent: i,
      //   data: JSON.stringify(folders),
      // })

      setWaiting(false)
    } catch (error) {
      console.error(error)
      setWaiting(false)
    }
  }
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Icon
          name='angle-left'
          color={Colors.secondary}
          size={23}
          style={styles.iconBack}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.Title}>{parent.name}</Text>
      </View>
      {!waiting && (
        <View style={{width: '100%'}}>
          <CustomMapFunction data={folders} />
        </View>
      )}
      {waiting && <Loader />}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.secondary,
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.primary,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  Title: {
    fontFamily: Fonts.bold,
    fontSize: 25,
    color: Colors.secondary,
    marginLeft: 40,
  },
  iconBack: {
    position: 'absolute',
    top: 5,
    left: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
})
export default OpenFolder
