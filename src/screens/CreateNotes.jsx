import firestore from '@react-native-firebase/firestore'
import {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {TextInput} from 'react-native-gesture-handler'
import {Colors} from '../configs/Colors'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Fonts} from '../configs/Fonts'
import CheckBox from '@react-native-community/checkbox'
const keyword_extractor = require('keyword-extractor')

const CreateNotes = () => {
  const [userEmail, setUserEmail] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState('')
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const getUser = async () => {
    const login = await AsyncStorage.getItem('email')
    setUserEmail(login)
  }
  useEffect(() => {
    getUser()
  }, [])

  function makeId (length) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
  }

  const File = {
    id: makeId(40),
    name: 'Facebook',
    type: 'file',
    status: 'public',
    keywords: [],
    content: 'body',
    parent: 'EobmKhad13ebsYgzMWUSHoe3J9uPxPDnQa7PFYjH',
    path: [],
    interactions: 5,
    strikeStatus: null,
    createdAt: Date.now(),
    deleteAt: Date.now(),
    modifiedAt: Date.now(),
    owner: userEmail.split('@')[0].toLocaleLowerCase(),
    sharedWith: [],
    editors: [],
    bookmarks: [],
    viewers: [],
    size: null,
    Url: [],
  }
  const extractKeywords = () => {
    return keyword_extractor.extract(body, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    })
  }
  const sendData = async () => {
    // await firestore().collection('files').doc(Files.id).set(File)
  }

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New</Text>
      </View>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            value={title}
            onChangeText={i => setTitle(i)}
            style={styles.inputTitle}
            placeholder='Enter the name of the file'
            placeholderTextColor={Colors.darkGrey}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.title}>Content</Text>
          <TextInput
            value={title}
            onChangeText={i => setTitle(i)}
            style={styles.inputBody}
            placeholder='Enter the content here ....'
            placeholderTextColor={Colors.darkGrey}
            multiline
          />
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.title,{marginTop: 5}]}>Private </Text>
          <CheckBox
            value={toggleCheckBox}
            onValueChange={newValue => {
              setToggleCheckBox(newValue)
              if(newValue == true){
                setStatus('private')
              }
              else if(newValue == false){
                setStatus('public')
              }
              }}
            tintColors={{
              true: Colors.primary,
              false: Colors.text,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    color: Colors.secondary,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputTitle: {
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 5,
  },
  inputView: {
    marginBottom: 20,
  },
  inputBody: {
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 380,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})
export default CreateNotes
