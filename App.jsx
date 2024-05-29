import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useEffect, useState} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LoginPage from './src/screens/LoginPage'
import OnBoarding from './src/screens/OnBoarding'
import SignUpPage from './src/screens/SignUpPage'
import HomeScreen from './src/screens/HomeScreen'
import BookMarksScreen from './src/screens/BookmarksScreen'
import Settings from './src/screens/Settings'
import SearchScreen from './src/screens/SearchScreen'
import ReadNotes from './src/screens/ReadNotes'
import OpenFolder from './src/screens/OpenFolder'
import CreateNotes from './src/screens/CreateNotes'
import ForgotPassword from './src/screens/ForgotPassword'
import Reports from './src/screens/Reports'
import SharedFiles from './src/screens/sharedFiles'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {Colors} from './src/configs/Colors'
import {StyleSheet, Text, View} from 'react-native'
import {Fonts} from './src/configs/Fonts'
import Ionicons from 'react-native-vector-icons/Ionicons'

async function saveTokenToDatabase (token) {
  const userId = auth().currentUser.email
  console.log(userId)
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    })
}

function App () {
  const Stack = createStackNavigator()
  const Tab = createBottomTabNavigator()

  const [isLogin, setIsLogin] = useState('')
  const getUser = async () => {
    const login = await AsyncStorage.getItem('isLogin')
    setIsLogin(login)
  }

  useEffect(() => {
    getUser()
  }, [])
  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token)
      })
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token)
    })
  }, [])

  const BottomTab = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            elevation: 0,
            height: 70,
            paddingTop: 5,
            alignItems: 'center',
            backgroundColor: Colors.secondary,
            justifyContent: 'center',
            paddingBottom: 5,
            position: 'absolute',
            bottom: 0,
            borderTopColor: Colors.darkGrey,
            borderTopWidth: 1,
          },
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name='HomeScreen'
          component={HomeScreen}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <AntDesign
                  name='home'
                  size={25}
                  color={focused ? Colors.primary : Colors.darkGrey}
                />
                <Text
                  style={[
                    styles.text,
                    {color: focused ? Colors.primary : Colors.darkGrey},
                  ]}>
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='SharedScreen'
          component={SharedFiles}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons
                  name='people-outline'
                  size={27}
                  color={focused ? Colors.primary : Colors.darkGrey}
                />
                <Text
                  style={[
                    styles.text,
                    {color: focused ? Colors.primary : Colors.darkGrey},
                  ]}>
                  Shared with me
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='SearchScreen'
          component={SearchScreen}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: focused ? Colors.primary : Colors.darkGrey,
                  // height: 50,
                  // width: 50,
                  // borderWidth: 2,
                  // borderRadius: 15,
                  // borderColor: focused ? Colors.primary : Colors.secondary,
                }}>
                <AntDesign
                  name='search1'
                  size={25}
                  color={focused ? Colors.primary : Colors.darkGrey}
                />
                <Text
                  style={[
                    styles.text,
                    {color: focused ? Colors.primary : Colors.darkGrey},
                  ]}>
                  Search
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='BookMarksScreen'
          component={BookMarksScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons
                  name='bookmarks-outline'
                  size={22}
                  color={focused ? Colors.primary : Colors.darkGrey}
                />
                <Text
                  style={[
                    styles.text,
                    {color: focused ? Colors.primary : Colors.darkGrey},
                  ]}>
                  Bookmarks
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='Settings'
          component={Settings}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons
                  name='settings-outline'
                  size={23}
                  color={focused ? Colors.primary : Colors.darkGrey}
                />
                <Text
                  style={[
                    styles.text,
                    {color: focused ? Colors.primary : Colors.darkGrey},
                  ]}>
                  Settings
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    )
  }
  const Navigator = () => {
    return (
      <>
        <Stack.Screen
          name='LoginPage'
          component={LoginPage}
          options={{header: () => null}}
        />

        <Stack.Screen
          name='SignUpPage'
          component={SignUpPage}
          options={{header: () => null}}
        />
        <Stack.Screen
          name='ForgotPassword'
          component={ForgotPassword}
          options={{header: () => null}}
        />
        {/* <Stack.Screen
          name='Settings'
          component={Settings}
          options={{header: () => null}}
        /> */}
        {/* <Stack.Screen
          name='BookMarksScreen'
          component={BookMarksScreen}
          options={{header: () => null}}
        />
        <Stack.Screen
          name='SearchScreen'
          component={SearchScreen}
          options={{header: () => null}}
        /> */}
        <Stack.Screen
          name='ReadNotes'
          component={ReadNotes}
          options={{header: () => null}}
        />
        <Stack.Screen
          name='OpenFolder'
          component={OpenFolder}
          options={{header: () => null}}
        />
        {/* <Stack.Screen
          name='SharedScreen'
          component={SharedFiles}
          options={{header: () => null}}
        /> */}
        <Stack.Screen
          name='Reports'
          component={Reports}
          options={{header: () => null}}
        />
        <Stack.Screen
          name='CreateNotes'
          component={CreateNotes}
          options={{header: () => null}}
        />
      </>
    )
  }

  if (isLogin == 'true') {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}>
          <Stack.Screen
            name='BottomTab'
            component={BottomTab}
            options={{header: () => null}}
          />
          <Stack.Screen
            name='OnBoarding'
            component={OnBoarding}
            options={{header: () => null}}
          />
          {Navigator()}
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else if (isLogin == null || isLogin == 'false') {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}>
          <Stack.Screen
            name='OnBoarding'
            component={OnBoarding}
            options={{header: () => null}}
          />
          <Stack.Screen
            name='BottomTab'
            component={BottomTab}
            options={{header: () => null}}
          />
          {Navigator()}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.regular,
    fontSize: 9,
    textAlign: 'center'
  },
})
export default App
