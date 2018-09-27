
var config = {
  apiKey: "AIzaSyDmXwGEFHTkGom_hhusiQUQ1YL1Eiz1i_4",
  authDomain: "recipeapp-fd.firebaseapp.com",
  databaseURL: "https://recipeapp-fd.firebaseio.com",
  projectId: "recipeapp-fd",
  storageBucket: "recipeapp-fd.appspot.com",
  messagingSenderId: "42896755050"
};


firebase.initializeApp(config);

var userSignedIn = false;
var favShow = 'none';
var database = firebase.database();

var api = {}
var userProfile = {}
function apiKeyUpdate(){
  api = getApiKeys();
}

function getApiKeys(){
  return retrieveData('/api/')
}

function updateUserProfile(){
  rst = {};
  database.ref('/users/' + getUid()).once('value', function(snap){
    snap.forEach(function(child){
      rst[child.key] = child.val();
    })
  }).then(function(){
    userProfile = rst;
  })
}

function retrieveData(path){
  rst = {};
  database.ref(path).once('value', function(snap){
    snap.forEach(function(child){
      rst[child.key] = child.val();
    })
  }).then(function(){
    return rst;
  })
}

document.getElementById("signout-button").addEventListener("click", function(){
  signOut();
})

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirctUrl){
      return true;
    },
    uiShown: function(){
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup',
  signInSuccessUrl: './index.html',
  signInOptions:[
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
}

ui.start('#firebaseui-auth-container', uiConfig);

// When the user sign in or sign out, this function will be triggered.
firebase.auth().onAuthStateChanged(function(user){

  let elements = {
    // to-be disappeared when sign in
    // to-be appeared when sign out
    signin : [document.getElementById("firebaseui-auth-container")],
    // to-be disappeared when sign out
    // to-be appeared when sign in
    signout : [document.getElementById("signout-button"),
                document.getElementById("showFav"),
                document.getElementById("favorite")
              ]
  }
 
  // mp: code redundant
  if (user){
    userSignedIn = true;
    favShow = 'block';
    elements.signin.forEach((e) => {
      e.style.display = "none";
    });
    elements.signout.forEach((e) => {
      e.style.display = "block"
    });
    // $('#showFav').show();
    addUserProfile(user);
    
  } else {
    userSignedIn = false;
    userProfile = {};
    favShow = 'none'
    elements.signin.forEach((e) => {
      e.style.display = "block"
    });
    elements.signout.forEach((e) => {
      e.style.display = "none"
    });
    // $('#showFav').hide()
  }
})

// return current user object from firebase.auth
function getUser(){
  return firebase.auth().currentUser;
}

// returns uid of current loged in user
function getUid(){
  return getUser().uid;
}

function getUemail(){
  return getUser().email;
}

function signOut(){
  firebase.auth().signOut();
}

function pushProfile(){
  database.ref('/users/'+getUid()).set(userProfile);
}

function addUserProfile(user){
  let existing = false;
  database.ref('/users/').once('value', function(snap){
    snap.forEach(function(child){
      if (child.key == user.uid){
        existing = true;
      }
    })
  }).then(function(){
    if (existing){
      updateUserProfile();
    } else {
      database.ref('/users/' + user.uid).set(constructUser(user));
      updateUserProfile();
    }
  })
}

function constructUser(user){
  return {
    name: user.displayName,
    uid: user.uid,
    email: user.email,
    favoirts: ["placeholder"]
  }
}

$(document).ready(function(){
  if (userSignedIn){
    updateUserProfile();
  }
})
