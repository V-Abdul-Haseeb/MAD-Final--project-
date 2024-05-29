import {View, StyleSheet, Pressable} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useNavigation} from '@react-navigation/native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
export const NavBar = ({home, search, bookMarks, settings, share}) => {
  const navigation = useNavigation()
  const Home = () => {
    navigation.replace('HomeScreen')
  }
  const Share = () => {
    navigation.replace('SharedScreen')
  }
  const Search = () => {
    navigation.replace('SearchScreen')
  }
  const BookMarks = () => {
    navigation.replace('BookMarksScreen')
  }
  const Settings = () => {
    navigation.replace('Settings')
  }
  return (
    <View style={styles.navbar}>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        style={styles.Pressable}
        onPress={Home}>
        <Ionicons name={home} size={25} color='#ffff' />
      </Pressable>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        style={styles.Pressable}
        onPress={Share}>
        <Ionicons name={share} size={28} color='#fff' />
      </Pressable>
      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        style={styles.Pressable}
        onPress={Search}>
        <Ionicons name={search} size={25} color='#fff' />
      </Pressable>

      <Pressable
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        style={styles.Pressable}
        onPress={BookMarks}>
        <Ionicons name={bookMarks} size={23} color='#fff' />
      </Pressable>

      <Pressable
        hitSlop={{top: 40, bottom: 20, left: 20, right: 20}}
        style={styles.Pressable}
        onPress={Settings}>
        <Ionicons name={settings} size={25} color='#fff' />
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  navbar: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    height: 60,
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  Pressable: {
    padding: 5,
  },
})
