import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import {SearchMapFunction} from '../components/SearchMapFunction'
import Loader from '../components/Loader'

const SearchScreen = () => {
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [waiting, setWaiting] = useState(false)

  const handleSearch = async () => {
    console.log(search)
    setWaiting(true)
    setData([])

    await firestore()
      .collection('files')
      .where('keywords', 'array-contains', search.toLowerCase().trim())
      .where('status', '==', 'public')
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setData([])
          setWaiting(false)
          console.log('Heres')
        } else {
          setData([])
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.data())
            setData(prev => [...prev, documentSnapshot.data()])
            setWaiting(false)
          })
        }
      })
  }
  return (
    <SafeAreaView style={{flex: 1}}>
        {!waiting && (
          <View style={styles.infoContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder='search'
                placeholderTextColor={Colors.darkGrey}
                value={search}
                onChangeText={i => setSearch(i)}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name={'search'} size={25} color={Colors.darkGrey} />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Search Results</Text>
            <View style={{width: '100%'}}>
              <SearchMapFunction data={data} />
            </View>
          </View>
        )}
        {waiting && (
          <View style={styles.infoContainer}>
            <Loader />
          </View>
        )}
        
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 70,
  },
  text: {color: Colors.text, fontFamily: Fonts.regular},
  input: {
    color: Colors.text,
    fontFamily: Fonts.regular,
    width: '80%',
    paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.darkGrey,
    fontSize: 16,
  },
  inputContainer: {
    margin: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor:Colors.darkGrey,
    paddingTop: 10,
    paddingBottom: 8,
    borderRadius: 30, borderWidth: 1,
  },
})
export default SearchScreen
