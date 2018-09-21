
var config = {
  apiKey: "AIzaSyDmXwGEFHTkGom_hhusiQUQ1YL1Eiz1i_4",
  authDomain: "recipeapp-fd.firebaseapp.com",
  databaseURL: "https://recipeapp-fd.firebaseio.com",
  projectId: "recipeapp-fd",
  storageBucket: "recipeapp-fd.appspot.com",
  messagingSenderId: "42896755050"
};


firebase.initializeApp(config);

var database = firebase.database();

var api;

database.ref('/api/').on('value', function(snapshot){
  api = snapshot.val();
});
console.log(api);

// var signInButton = document.getElementById("signIn")
// signInButton.addEventListener("click", signIn);

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
    signin : [document.getElementById("firebaseui-auth-container"),
              document.getElementById("first-main-display")],
    // to-be appeared when sign out
    // to-be disappeared when sign 
    signout : [document.getElementById("signout-button")]
  }
 
  // mp: code redundant
  if (user){
    elements.signin.forEach((e) => {
      e.style.display = "none"
    });
    elements.signout.forEach((e) => {
      e.style.display = "block"
    });
    addUserProfile(user);
    
  } else {
    elements.signin.forEach((e) => {
      e.style.display = "block"
    });
    elements.signout.forEach((e) => {
      e.style.display = "none"
    });
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

function addUserProfile(user){
  if (user.uid in database.ref('/users/')){
  } else {
    database.ref('/users/' + user.uid).set(constructUser(user));
  }
}

function constructUser(user){
  return {
    name: user.displayName,
    uid: user.uid,
    email: user.email,
    favoirts: ["placeholder"]
  }
}
