import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBase,
} from 'react-native'

import Onboarding from 'react-native-onboarding-swiper'

const Dots = ({selected}) => {
  let backgroundColor

  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)'
  width = selected ? 6 : 6

  return (
    <View
      style={{
        width,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
        borderRadius: 10,
      }}
    />
  )
}

const Skip = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text
      style={{
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#008080',
        marginLeft: 15,
      }}>
      Skip
    </Text>
  </TouchableOpacity>
)

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text
      style={{
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#008080',
        marginRight: 15,
      }}>
      Next
    </Text>
  </TouchableOpacity>
)

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text
      style={{
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#008080',
        marginRight: 15,
      }}>
      Done
    </Text>
  </TouchableOpacity>
)

const OnBoarding = ({navigation}) => {
  return (
    <Onboarding
      bottomBarHeight={40}
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace('LoginPage')}
      onDone={() => navigation.replace('LoginPage')}
      pages={[
        {
          backgroundColor: '#Fff',
          image: (
            <Image
              style={styles.image}
              source={require('../assets/images/Icon.png')}
            />
          ),
          title: <Text style={styles.title}>Notes Link</Text>,
          subtitle: (
            <Text style={styles.text}>
              Effortless Knowledge Management: Capture, Summarize, Share – Your
              Notes, Your Way
            </Text>
          ),
        },
        {
          backgroundColor: '#Fff',
          image: (
            <Image
              style={styles.image}
              source={require('../assets/images/youtube.png')}
            />
          ),
          title: (
            <Text style={[styles.title, {color: 'red'}]}>
              YouTube Video Notes
            </Text>
          ),
          subtitle: (
            <Text style={styles.text}>
              Easily capture insights while watching YouTube videos. Pause,
              create notes, and save timestamps for a seamless video-to-note
              experience.
            </Text>
          ),
        },
        {
          backgroundColor: '#Fff',
          image: (
            <Image
              style={styles.image}
              source={require('../assets/images/research.png')}
            />
          ),
          title: (
            <Text style={[styles.title, {color: 'orange'}]}>
              Research Paper Notes
            </Text>
          ),
          subtitle: (
            <Text style={styles.text}>
              Effortlessly extract key content from research papers. Select and
              save text for concise summaries. Embed source links for future
              reference and credibility.
            </Text>
          ),
        },
      ]}
    />
  )
}

export default OnBoarding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 200,
    width: 200,
    marginTop: -100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#008080',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})
