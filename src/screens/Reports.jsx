import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import React from 'react'
import {Colors} from '../configs/Colors'
import {Fonts} from '../configs/Fonts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CheckBox from '@react-native-community/checkbox'
import {Touchable} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import CustomAlert from '../components/Alert'
import { useNavigation } from '@react-navigation/native';

const Reports = ({route}) => {
  const data = route.params.data
  const user = route.params.user
  console.log(user.split('@')[0].toLowerCase().trim())
  const [reportModalVisible, setReportModalVisible] = React.useState(false)
  const [toggleHate, setToggleHate] = React.useState(false)
  const [toggleIrrelevant, setToggleIrrelevant] = React.useState(false)
  const [toggleSexuality, setToggleSexuality] = React.useState(false)
  const [reason, setReason] = React.useState('')

  const navigation = useNavigation()

  const submitReport = async () => {
    let reasonsArray = []
    if (toggleHate) {
      reasonsArray.push('Promotes Hate Speech')
    }
    if (toggleIrrelevant) {
      reasonsArray.push('Irrelevant content to the topic')
    }
    if (toggleSexuality) {
      reasonsArray.push('Promotes sexuality / Harassment')
    }

    let reports
    console.log(data.strikeStatus);
    if (data.strikeStatus == null) {
      reports = 1
    } else {
      reports = data.strikeStatus + 1
      console.log(reports)
    }
    console.log(reasonsArray)
    await firestore()
      .collection('files')
      .doc(data.id)
      .update({
        strikeStatus: reports,
      })
      .then(async () => {
        await firestore()
          .collection('reports')
          .add({
            id: data.id,
            reason: reason,
            details: reason,
            reportedBy: user.split('@')[0].toLowerCase().trim(),
          })
          .then(() => {
            setReportModalVisible(true)
          })
      })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <Ionicons name={'arrow-back'} size={20} color={Colors.secondary} />
          <Text style={styles.headerText}>{data.name}</Text>
        </View>
        <View style={styles.secondaryView}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 20,
              },
            ]}>
            Report Inappropriate Content
          </Text>
          <Text
            style={[
              styles.text,
              {textAlign: 'left', marginTop: 20, marginBottom: 5},
            ]}>
            Select all those applicable
          </Text>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              disabled={false}
              value={toggleHate}
              onValueChange={newValue => setToggleHate(newValue)}
              tintColors={{
                true: Colors.primary,
                false: Colors.text,
              }}
            />
            <Text
              style={[
                styles.text,
                {textAlign: 'left', marginLeft: 10, marginTop: 3},
              ]}>
              Promotes Hate Speech
            </Text>
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              disabled={false}
              value={toggleIrrelevant}
              onValueChange={newValue => setToggleIrrelevant(newValue)}
              tintColors={{
                true: Colors.primary,
                false: Colors.text,
              }}
            />
            <Text
              style={[
                styles.text,
                {textAlign: 'left', marginLeft: 10, marginTop: 3},
              ]}>
              Irrelevant Content to the Topic
            </Text>
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              disabled={false}
              value={toggleSexuality}
              onValueChange={newValue => setToggleSexuality(newValue)}
              tintColors={{
                true: Colors.primary,
                false: Colors.text,
              }}
            />
            <Text
              style={[
                styles.text,
                {textAlign: 'left', marginLeft: 10, marginTop: 3},
              ]}>
              Promotes Sexuality / harassment
            </Text>
          </View>
          <Text
            style={[
              styles.text,
              {textAlign: 'left', marginTop: 20, marginBottom: 5},
            ]}>
            Reason:
          </Text>

          <TextInput
            style={styles.input}
            placeholder='Enter Reason'
            placeholderTextColor={Colors.darkGrey}
            multiline
            value={reason}
            onChangeText={i => setReason(i)}
          />
        </View>
      <TouchableOpacity style={styles.button} onPress={submitReport}>
        <Text style={[styles.text, {color: Colors.secondary}]}>Submit</Text>
      </TouchableOpacity>
      {reportModalVisible && (
        <CustomAlert
          title={'Report Content'}
          message={
            'The Content has been reported Successfully to the NotesLink Team!'
          }
          buttonSuccess={'Done'}
          buttonCancel={false}
          onPressSuccess={() => {
            setReportModalVisible(false)
            navigation.navigate("HomeScreen")
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingBottom: 500,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: Fonts.bold,
    color: Colors.secondary,
    marginLeft: 10,
    fontSize: 20,
  },
  text: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: 15,
    textAlign: 'center',
  },
  secondaryView: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.text,
    width: '100%',
    height: 200,
    textAlignVertical: 'top',
    fontFamily: Fonts.regular,
    color: Colors.text,
    padding: 15,
    borderRadius: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 30,
    width: '95%',
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10
  },
})

export default Reports
