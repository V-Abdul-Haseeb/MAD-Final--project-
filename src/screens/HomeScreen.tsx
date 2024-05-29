import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import { Colors } from '../configs/Colors';
import { Fonts } from '../configs/Fonts';
import { NavBar } from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { CustomMapFunction } from '../components/CustomMapFunction';
import { firebase } from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { singleDocData } from '../functions/singleDocData';
import CustomAlert from '../components/Alert';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

interface HomeScreenState {
  waiting: boolean;
  name: string;
  logoutModalVisible: boolean;
  userEmail: string;
  realtimeData: any[];
}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {
      waiting: false,
      name: '',
      logoutModalVisible: false,
      userEmail: '',
      realtimeData: [],
    };
  }

  async componentDidMount() {
    await this.getUser();
    this.getFiles();
  }

  getUser = async () => {
    const login = await AsyncStorage.getItem('email');
    if (login) {
      const userEmail = login.toLocaleLowerCase();
      const data = await singleDocData('users', userEmail);
      const name = `${data.name?.split(' ')[0]} ${data.name?.split(' ')[1]}`;
      this.setState({ userEmail, name });
    }
  };

  getFiles = async () => {
    const { userEmail } = this.state;
    try {
      this.setState({ realtimeData: [], waiting: true });
      const querySnapshot = await firestore()
        .collection('files')
        .where('owner', '==', userEmail.split('@')[0].toLowerCase())
        .where('parent', '==', '')
        .get();
      if (!querySnapshot.empty) {
        const files = querySnapshot.docs.map(documentSnapshot => documentSnapshot.data());
        this.setState({ realtimeData: files, waiting: false });
      } else {
        this.setState({ waiting: false });
      }
    } catch (error) {
      this.setState({ waiting: false });
      console.error(error);
    }
  };

  signOutFunction = async () => {
    try {
      await auth().signOut();
      this.setState({ logoutModalVisible: false });
      await AsyncStorage.setItem('isLogin', 'false');
      this.props.navigation.replace('LoginPage');
      ToastAndroid.show('User Log out!', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { waiting, name, logoutModalVisible, realtimeData } = this.state;
    return (
      <>
        <SafeAreaView style={styles.infoContainer}>
          {!waiting && (
            <View>
              <View style={{ marginBottom: 60 }}>
                <View style={styles.banner}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../assets/images/me.jpg')}
                      style={styles.bannerImage}
                    />
                    <Text style={styles.bannerText}>{name}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name='log-out-outline'
                      size={35}
                      color={Colors.text}
                      onPress={() => {
                        this.setState({ logoutModalVisible: true });
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: Colors.text, fontFamily: Fonts.medium }}>
                    Owned by {name}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      paddingLeft: 8,
                      borderRadius: 10,
                    }}
                  >
                    <FontAwesome name='sort' color={Colors.secondary} size={15} />
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        color: Colors.secondary,
                        marginHorizontal: 10,
                        marginTop: 1,
                      }}
                    >
                      sort
                    </Text>
                  </TouchableOpacity>
                </View>
                {!waiting && (
                  <View style={{ height: 680, flexGrow: 0 }}>
                    <CustomMapFunction data={realtimeData} />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => this.props.navigation.navigate('CreateNotes')}
                >
                  <AntDesign name='addfile' size={20} color={Colors.secondary} />
                  <Text
                    style={{
                      fontFamily: Fonts.regular,
                      fontSize: 10,
                      color: Colors.secondary,
                      marginTop: 4,
                    }}
                  >
                    New File
                  </Text>
                </TouchableOpacity>

                {logoutModalVisible && (
                  <CustomAlert
                    title={'Logout'}
                    message={'Are you sure want to logout?'}
                    buttonSuccess={'Logout'}
                    buttonCancel={true}
                    onPressSuccess={this.signOutFunction}
                    onPressCancel={() => {
                      this.setState({ logoutModalVisible: false });
                    }}
                  />
                )}
              </View>
            </View>
          )}
          {waiting && (
            <View style={styles.infoContainer0}>
              <Loader marginTop={undefined} />
            </View>
          )}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  infoContainer0: {
    backgroundColor: Colors.secondary,
    flex: 1,
    alignItems: 'center',
    padding: 10,
    height: Dimensions.get('screen').height - 30,
    paddingBottom: 70,
  },
  infoContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  banner: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 20,
    alignItems: 'center',
  },
  bannerText: {
    color: Colors.text,
    fontFamily: Fonts.medium,
    fontSize: 22,
    marginLeft: 20,
    marginTop: 7,
  },
  bannerImage: { height: 50, width: 50, borderRadius: 100 },
  addButton: {
    paddingTop: 5,
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    position: 'absolute',
    right: 10,
    bottom: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
