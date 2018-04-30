// use Firebase as our database
import Firebase from 'firebase'

// configure database
var config = {
    apiKey: "AIzaSyDECfyTBZ5XOphpY1soN5n64DleE06JzzU",
    authDomain: "analyzer-201403.firebaseapp.com",
    databaseURL: "https://analyzer-201403.firebaseio.com",
    projectId: "youtube-analyzer-201403",
    storageBucket: "youtube-analyzer-201403.appspot.com",
    messagingSenderId: "506098299233"
  };
// connect to database
export const db = Firebase.initializeApp(config).database();
export const analysisRef = db.ref('/analysis');
export const searchRef = db.ref('/searched');