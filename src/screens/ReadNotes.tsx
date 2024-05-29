import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../configs/Colors';
import {Fonts} from '../configs/Fonts';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReadNotesProps {
  route: {
    params: {
      data: any;
    };
  };
}

const ReadNotes: React.FC<ReadNotesProps> = ({route}) => {
  const data_ = route.params.data;
  const dataArray = Object.keys(data_).map(key => ({id: key, ...data_[key]}));
  const data = dataArray[0];
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [bookmark, setBookMark] = useState(false);
  const [bookmarkIcon, setIcon] = useState('bookmarks');
  const [waiting, setWaiting] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [like, setLike] = useState(false);
  const [likeIcon, setLikeIcon] = useState('like1');
  const [totalLikes, setTotalLikes] = useState(data.likes);
  const [views, setViews] = useState(0);
  const URLS = [
    'https://youtu.be/3aY-iI1in0o?si=s6d7TqxilDFFMvsA',
    'https://oblador.github.io/react-native-vector-icons/',
  ];

  const getUser = async () => {
    const login = await AsyncStorage.getItem('email');
    setUserEmail(login.toLocaleLowerCase());
    if (data.owner == userEmail.split('@')[0].toLowerCase().trim()) {
      setIsOwner(true);
    }
    if (data?.bookmarks.includes(userEmail.split('@')[0].toLowerCase().trim())) {
      setBookMark(true);
      setIcon('bookmarks');
    } else if (!data?.bookmarks.includes(userEmail.split('@')[0].toLowerCase().trim())) {
      setBookMark(false);
      setIcon('bookmarks-outline');
    }

    if (data?.likedBy.includes(userEmail.split('@')[0].toLowerCase().trim())) {
      setLike(true);
      setLikeIcon('like1');
    } else if (!data?.likedBy.includes(userEmail.split('@')[0].toLowerCase().trim())) {
      setLike(false);
      setLikeIcon('like2');
    }
  };

  useEffect(() => {
    getUser();
  }, [userEmail]);

  useEffect(() => {
    let views_ = parseFloat(data.interactions) + 1;
    if (views_ < 1000) {
      setViews(views_);
    } else if (views_ >= 1000) {
      if (views_ < 1000000) {
        views_ = views_ / 1000;
        setViews(`${views_.toFixed(1)} K`);
      } else if (views_ >= 1000000) {
        if (views_ < 1000000000) {
          views_ = views_ / 1000000;
          setViews(`${views_.toFixed(1)} M`);
        } else {
          views_ = views_ / 1000000000;
          setViews(`${views_.toFixed(1)} B`);
        }
      }
    }
  }, [views]);

  const bookmarks = async () => {
    setWaiting(true);
    setEmails(data?.bookmarks);
    let newArr: string[] = [];
    if (emails !== null && bookmark == false) {
      newArr = [...emails, userEmail.split('@')[0].toLowerCase()];
    } else if (emails !== null && bookmark == true) {
      const index = emails.indexOf(userEmail.split('@')[0].toLowerCase().trim());
      emails.splice(index, 1);
      newArr = emails;
    }
    await firestore()
      .collection('files')
      .doc(data.id)
      .update({
        bookmarks: newArr,
      })
      .then(() => {
        if (bookmark == false) {
          setWaiting(false);
          setBookMark(true);
          setIcon('bookmarks');
          ToastAndroid.show('File Added to Bookmarks', ToastAndroid.SHORT);
        } else {
          setWaiting(false);
          setBookMark(false);
          setIcon('bookmarks-outline');
          ToastAndroid.show('File Removed from Bookmarks', ToastAndroid.SHORT);
        }
      });
  };

  const likePressed = async () => {
    let likes_ = totalLikes;
    setWaiting(true);
    const likedBy = data.likedBy;
    let newArr: string[] = [];
    if (likedBy !== null && like == false) {
      likes_ = likes_ + 1;
      newArr = [...likedBy, userEmail.split('@')[0].toLowerCase()];
    } else if (likedBy !== null && like == true) {
      likes_ = likes_ - 1;
      const index = likedBy.indexOf(userEmail.split('@')[0].toLowerCase().trim());
      likedBy.splice(index, 1);
      newArr = likedBy;
    }
    await firestore()
      .collection('files')
      .doc(data.id)
      .update({
        likedBy: newArr,
        likes: likes_,
      })
      .then(() => {
        if (like == false) {
          setWaiting(false);
          setTotalLikes(likes_);

          setLike(true);
          setLikeIcon('like1');
        } else {
          setTotalLikes(likes_);
          setWaiting(false);
          setLike(false);
          setLikeIcon('like2');
        }
      });
  };

  const roundOff = (v: number) => {
    let value = parseFloat(v.toString());
    if (value < 999) {
      return `${value}`;
    } else if (value >= 1000 && value <= 999999) {
      value = value / 1000;
      return `${value.toFixed(1)} K`;
    } else if (value >= 1000000 && value <= 999999999) {
      value = value / 1000000;
      return `${value.toFixed(1)} M`;
    } else {
      value = value / 1000000000;
      return `${value.toFixed(1)} B`;
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      {!waiting && (
        <View>
          <View style={styles.header}>
            <Icon
              name="angle-left"
              color={Colors.secondary}
              size={23}
              style={styles.iconBack}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.Title}>{data.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                width: 70,
                justifyContent: isOwner ? 'flex-end' : 'space-between',
                alignItems: 'center',
                marginRight: 20,
              }}>
              <TouchableOpacity onPress={bookmarks}>
                <Ionicons name={bookmarkIcon} size={23} color="#fff" />
              </TouchableOpacity>
              {!isOwner && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Reports', {
                      data: data,
                      user: userEmail,
                    })
                  }>
                  <Ionicons name="alert-circle" size={28} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView style={styles.ScrollView}>
            <View style={styles.headingView}>
              <Feather name="align-left" color={Colors.primary} size={23} />
              <Text style={styles.headings}>Main Content</Text>
            </View>
            <ScrollView style={{width: '100%', marginTop: 10, marginBottom: 20}}>
              {data.content.map((item: string, index: number) => (
                <Text key={index} style={styles.body}>{item}</Text>
              ))}
            </ScrollView>
            <View style={styles.headingView}>
              <Feather name="link" color={Colors.primary} size={23} />
              <Text style={styles.headings}>URLs</Text>
            </View>
            <ScrollView style={{width: '100%', marginTop: 10, marginBottom: 20}}>
              {URLS.map((item, index) => (
                <Text
                  key={index}
                  style={[
                    styles.body,
                    {color: 'blue', textDecorationLine: 'underline'},
                  ]}>
                  {item}
                </Text>
              ))}
            </ScrollView>
            <View style={styles.headingView}>
              <Feather name="tag" color={Colors.primary} size={23} />
              <Text style={styles.headings}>Tags</Text>
            </View>
            <ScrollView style={{width: '100%', marginTop: 10, marginBottom: 20}} horizontal>
              {data.keywords.map((item: string, index: number) => (
                <Text key={index} style={styles.tags}>{item}</Text>
              ))}
            </ScrollView>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.bottomInnerContainer}>
              <TouchableOpacity onPress={likePressed}>
                <AntDesign
                  name={likeIcon}
                  size={23}
                  color={Colors.primary}
                  style={styles.iconSpacing}
                />
              </TouchableOpacity>
              <View style={styles.bottomTextView}>
                <Text style={styles.bottomText}>{roundOff(totalLikes)}</Text>
                <Text style={styles.bottomSubText}>Likes</Text>
              </View>
            </View>
            <View style={styles.bottomInnerContainer}>
              <TouchableOpacity>
                <Ionicons
                  name="eye-outline"
                  size={23}
                  color={Colors.primary}
                  style={styles.iconSpacing}
                />
              </TouchableOpacity>
              <View style={styles.bottomTextView}>
                <Text style={styles.bottomText}>{views}</Text>
                <Text style={styles.bottomSubText}>Views</Text>
              </View>
            </View>
            <View style={styles.bottomInnerContainer}>
              <TouchableOpacity>
                <Ionicons
                  name="document-outline"
                  size={23}
                  color={Colors.primary}
                  style={styles.iconSpacing}
                />
              </TouchableOpacity>
              <View style={styles.bottomTextView}>
                <Text style={styles.bottomText}>{data.notes}</Text>
                <Text style={styles.bottomSubText}>Notes</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.headerBackground,
    height: 60,
    paddingHorizontal: 15,
  },
  iconBack: {
    padding: 5,
  },
  Title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.headerText,
  },
  ScrollView: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  headings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 10,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
    marginVertical: 5,
  },
  tags: {
    fontSize: 14,
    color: Colors.tagText,
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: Colors.tagBackground,
    borderRadius: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.footerBackground,
    height: 60,
  },
  bottomInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomTextView: {
    marginLeft: 10,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.footerText,
  },
  bottomSubText: {
    fontSize: 14,
    color: Colors.footerText,
  },
  iconSpacing: {
    marginRight: 5,
  },
});

export default ReadNotes;
