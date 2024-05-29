import React, {useState, useRef} from 'react'
const {useEffect} = React
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Modal,
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
import {sendNotification} from '../functions/pushNotifications'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNFetchBlob from 'rn-fetch-blob'

export const CustomMapFunction = ({data}) => {
  // console.log(data);
  const navigation = useNavigation()
  const [selected, setSelected] = useState([])
  const [waiting, setWaiting] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [newName, setNewName] = useState('')
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [button, setButton] = useState('')
  const refRBSheet = useRef()
  // const Array = Object.keys(data).map(key => ({id: key, ...data[key]}))
  const sortByType = (a, b) => {
    if (a.type < b.type) return 1
    if (a.type > b.type) return -1
    return 0
  }
  let sortedArray = data.sort(sortByType)

  const [dataArray, setDataArray] = useState([])
  const [userEmail, setUserEmail] = useState('')
  const [name, setName] = useState('')

  const getUser = async () => {
    const login = await AsyncStorage.getItem('email')
    setUserEmail(login.toLocaleLowerCase())
    const data = await singleDocData('users', login.toLocaleLowerCase())
    setName(`${data.name?.split(' ')[0]} ${data.name?.split(' ')[1]}`)
  }
  useEffect(() => {
    getUser()
  }, [userEmail])

  const press = () => {
    setTimeout(() => {
      setDataArray(sortedArray)
      console.log('here', sortedArray)
    })
  }

  useEffect(() => {
    press()
  }, [sortedArray])
  const navigateFunction = async i => {
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
      setWaiting(true)
      console.log(i.id)
      try {
        if (i.type == 'file') {
          try {
            const data = await firestore().collection('files').doc(i.id).get()
            const inter = data.data().interactions + 1

            console.log(inter)
            await firestore()
              .collection('files')
              .doc(i.id)
              .update({interactions: inter})
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
      <MaterialIcons
        name={item.status == 'public' ? 'public' : 'public-off'}
        size={15}
        color={item.status == 'public' ? Colors.secondary : Colors.private}
        style={
          item.type == 'file' ? styles.publicFileIndicator : styles.publicIcon
        }
      />
      <Text style={styles.Title}>{item.name}</Text>
    </TouchableOpacity>
  )

  const shareFile = async () => {
    console.log('Rename Pressed for: ', selected.name)
    await firestore()
      .collection('users')
      .where('emailAddress', '==', newName.trim().toLowerCase())
      .get()
      .then(async documentSnapshot => {
        if (!documentSnapshot.empty) {
          const data = await firestore()
            .collection('files')
            .doc(selected.id)
            .get()
          const emails = await data.data().sharedWith
          const newArr = [...emails, newName.split('@')[0].toLowerCase()]
          firestore()
            .collection('files')
            .doc(selected.id)
            .update({
              sharedWith: newArr,
            })
            .then(async () => {
              setShowUpdateModal(false)
              setTitle('Success')
              setMessage('File Shared with: ' + newName)
              setButton('Done!')
              setShowAlert(true)
              await sendNotification(
                newName.toLocaleLowerCase().trim(),
                `${
                  selected.type.charAt(0).toUpperCase() + selected.type.slice(1)
                } Received`,
                `${name} shared a ${
                  selected.type.charAt(0).toUpperCase() + selected.type.slice(1)
                } "${selected.name}" with you!`,
                selected,
              )
              console.log('User updated!')
            })
        } else if (documentSnapshot.empty) {
          setTitle('Operation failed!')
          setMessage(newName + " doesn't exist in the database!")
          setButton('Try again!')
          setShowAlert(true)
        }
      })
  }
  const deleteFile = async () => {
    console.log('Delete Pressed for: ', selected.name)
    setWaiting(true)
    await firestore()
      .collection('files')
      .doc(selected.id)
      .get()
      .then(async response => {
        // console.log(response.data().owner);
        const owner = response.data().owner
        if (userEmail.split('@')[0].toLowerCase() == owner) {
          await firestore()
            .collection('recycleBin')
            .doc(selected.id)
            .set(selected)

          await firestore()
            .collection('files')
            .doc(selected.id)
            .delete()
            .then(async () => {
              const updatedArray = dataArray.filter(
                obj => obj.id !== selected.id,
              )
              refRBSheet.current.close()
              setDataArray(updatedArray)
              setWaiting(false)
              setSelected('')
              setTitle('Success')
              setMessage(
                'Item Successfully deleted, but can be found in the recycle bin!',
              )
              setButton('Done!')
              setShowAlert(true)
            })
            .catch(error => {
              setWaiting(false)
              console.error(error)
            })
        }
      })
  }
  const changeStatus = async () => {
    await firestore()
      .collection('files')
      .doc(selected.id)
      .get()
      .then(async response => {
        setWaiting(true)
        const indexToUpdate = sortedArray.findIndex(
          obj => obj.id === selected.id,
        )

        const owner = response.data().owner
        if (userEmail.split('@')[0].toLowerCase() == owner) {
          await firestore()
            .collection('files')
            .doc(selected.id)
            .update({
              status: response.data().status == 'public' ? 'private' : 'public',
            })
            .then(async () => {
              setWaiting(false)
              const updatedArray = dataArray.map(obj => {
                if (obj.id === selected.id) {
                  return {
                    ...obj,
                    status:
                      response.data().status == 'public' ? 'private' : 'public',
                  }
                }
                return obj
              })
              setDataArray(updatedArray)
              setTitle('Success')
              setMessage('File Status Changed!')
              setButton('Done!')
              setShowAlert(true)
            })
            .catch(() => {
              console.error(error)
              setWaiting(false)
            })
        } else {
          setWaiting(false)
          setTitle('Access Denied')
          setMessage('You can not change the status of the file.')
          setButton('Go back!')
          setShowAlert(true)
        }
      })
  }
  const download = async () => {
    if (selected.type == 'file') {
      setWaiting(true)
      console.log('Download Pressed for: ', selected.name)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1
      const currentDay = currentDate.getDate()
      const body = selected.content.join('<br/>')
      const regex = /[^\w\s]/g
      var fileName = selected.name.replace(regex, ' ')

      let options = {
        html: `<div>
      <h3>${selected.name}</h3>
      <p>${body}</p>
      <p>Downloaded at: ${currentYear}/${currentMonth}/${currentDay} by ${name}</p>
      </div>
      `,
        fileName: fileName,
        directory: 'Documents',
        base64: true,
        height: 700,
        width: 500,
      }
      let file = await RNHTMLtoPDF.convert(options)
      let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName + '.pdf'
      RNFetchBlob.fs
        .writeFile(filePath, file.base64, 'base64')
        .then(response => {
          setWaiting(false)
          setTitle('Success!')
          setMessage('File Saved in Downloads Directory of your device!')
          setButton('Done!')
          setShowAlert(true)
        })
        .catch(error => {
          setWaiting(false)
          setTitle('Failed!')
          setMessage('Something went wrong! ' + error)
          setButton('Done!')
          setShowAlert(true)
          console.error(error)
        })
    } else {
      setTitle('Operation Failed')
      setMessage('Selected Item is a Folder!')
      setButton('Go Back!')
      setShowAlert(true)
    }
  }
  return (
    <View>
      {data != [] && (
        <>
          <FlatList
            data={dataArray}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{marginBottom: 10, width: '100%'}}
            // scrollEnabled={false}
            numColumns={4}
            contentContainerStyle={{justifyContent: 'space-between'}}
          />
        </>
      )}
      {data.length < 1 && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '30%',
          }}>
          <Image
            source={require('../assets/images/empty.png')}
            style={{width: 200}}
            resizeMode='contain'
          />
        </View>
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
        customModalProps={{
          animationType: 'fade',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
        <View style={{padding: 20}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Ionicons name={'settings'} size={19} color={Colors.primary} />
            <Text
              style={{
                color: Colors.text,
                textAlign: 'center',
                fontFamily: Fonts.medium,
                fontSize: 19,
                marginLeft: 5,
                marginTop: 1,
              }}>
              File Settings
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowUpdateModal(true)
            }}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: Colors.text,
                textAlign: 'center',
                fontFamily: Fonts.medium,
                fontSize: 19,
                marginLeft: 5,
                marginTop: 1,
              }}>
              Share
            </Text>
            <MaterialIcons name={'share'} size={19} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={download}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: Colors.text,
                textAlign: 'center',
                fontFamily: Fonts.medium,
                fontSize: 19,
                marginLeft: 5,
                marginTop: 1,
              }}>
              Download
            </Text>
            <MaterialIcons name={'download'} size={19} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={changeStatus}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: Colors.text,
                textAlign: 'center',
                fontFamily: Fonts.medium,
                fontSize: 19,
                marginLeft: 5,
                marginTop: 1,
              }}>
              {selected.status == 'public' ? 'Make Private' : 'Make Public'}
            </Text>
            <MaterialIcons
              name={selected.status == 'public' ? 'public-off' : 'public'}
              size={19}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}
            onPress={deleteFile}>
            <Text
              style={{
                color: Colors.text,
                textAlign: 'center',
                fontFamily: Fonts.medium,
                fontSize: 19,
                marginLeft: 5,
                marginTop: 1,
              }}>
              Delete File
            </Text>
            <MaterialIcons name={'delete'} size={19} color={Colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.primary,
              textAlign: 'center',
              fontFamily: Fonts.bold,
              fontSize: 19,
              marginLeft: 5,
              marginTop: 1,
            }}>
            Selected: {selected.name}
          </Text>
        </View>
      </RBSheet>
      {showUpdateModal && (
        <CustomAlert
          title={'Share'}
          textInput={'Share with'}
          value={newName}
          onChange={setNewName}
          buttonSuccess={'Share'}
          buttonCancel={true}
          onPressSuccess={shareFile}
          onPressCancel={() => {
            setShowUpdateModal(false)
          }}
        />
      )}
      {showAlert && (
        <CustomAlert
          title={title}
          message={message}
          buttonSuccess={button}
          onPressSuccess={() => {
            setShowAlert(false)
          }}
          onPressCancel={() => {
            setShowAlert(false)
          }}
        />
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
})
