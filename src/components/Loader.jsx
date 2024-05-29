import LottieView from 'lottie-react-native'
import {Modal, SafeAreaView} from 'react-native'
import {View} from 'react-native'
export default Loader = ({marginTop}) => {
  return (
    <Modal animationType='fade' transparent={true} visible={true}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            marginTop: marginTop,
            width: '100%'
          }}>
          <LottieView
            source={require('../assets/loader.json')}
            autoPlay
            loop
            style={{height: 100, width: 100}}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}
