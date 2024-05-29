import firestore from '@react-native-firebase/firestore'
import { FCM_SERVER_KEY } from '@env';
export const sendNotification = async (
  receiverEmail,
  notificationTitle,
  notificationBody,
  file
) => {
  const user = await firestore()
    .collection('users')
    .doc(receiverEmail.trim().toLowerCase())
    .get()

  console.log(user.data().tokens)
  const myHeaders = new Headers()
  myHeaders.append('Authorization', FCM_SERVER_KEY)
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    data: {data: file},
    notification: {
      body: notificationBody,
      title: notificationTitle,
    },
    registration_ids: user.data().tokens,
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }
  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error))
}
