// use Firebase as our database
import Firebase from 'firebase'

// configure and connect to database
var config = {
    apiKey: "AIzaSyDECfyTBZ5XOphpY1soN5n64DleE06JzzU",
    authDomain: "analyzer-201403.firebaseapp.com",
    databaseURL: "https://analyzer-201403.firebaseio.com",
    projectId: "youtube-analyzer-201403",
    storageBucket: "youtube-analyzer-201403.appspot.com",
    messagingSenderId: "506098299233"
  };
var fbApp = Firebase.initializeApp(config)

// global reference to remote database app
export const db = fbApp.database()
// global reference to remote storage
//export const storageRef = fbApp.storage().ref()

export const searchesRef = db.ref('/searched');

export const usersRef = db.ref('/users');

export const analysisRef = db.ref('/analysis');