import firebase from 'firebase';


//Paste your firebase configuration here
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};


firebase.initializeApp(config);

const ref = firebase.database();

const auth = firebase.auth();
const storage = firebase.storage();

export {auth, storage, firebase};

export default ref;