import firestore from '@react-native-firebase/firestore'
export const singleDocData = async (collection, doc) => {
  try {
    const user = await firestore().collection(collection).doc(doc).get()
    return user.data()
  } catch (error) {
    console.error(error)
    throw error
  }
}


// == How to call

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const data = await singleDocData("users", "mail")
//       console.log(data.name)
//     } catch (error) {
//       console.error(error)
//     }
//   }











//   function onResult (querySnapshot) {
//     querySnapshot.forEach(documentSnapshot => {
//       //   setData(previousData => [
//       //     ...previousData,
//       //     {
//       //       id: documentSnapshot.id,
//       //       name: documentSnapshot.data().name,
//       //       role: documentSnapshot.data().designation,
//       //       contact: documentSnapshot.data().contactNo,
//       //       email: documentSnapshot.data().emailAddress,
//       //       status: documentSnapshot.data().status,
//       //     },
//       //   ])
//       return documentSnapshot.data().name;
//     })
//   }
//   function onError (error) {
//     if (error.code === 'firestore/permission-denied') {
//     } else {
//       alert('Something Went Wrong!')
//     }
//   }
//   firestore().collection('users').onSnapshot(onResult, onError)
