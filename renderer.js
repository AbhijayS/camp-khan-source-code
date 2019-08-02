'use strict'

const firebase = require('firebase')
// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA9pWVfM8Ftdvr3AmP7gxCiSjOKwOn_GBw",
  authDomain: "clip-it-firebase.firebaseapp.com",
  databaseURL: "https://clip-it-firebase.firebaseio.com",
  projectId: "clip-it-firebase",
  storageBucket: "clip-it-firebase.appspot.com",
  messagingSenderId: "920610207312"
});

window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

/*
  Google Auth Functions
*/
const txt_email = $('#txtEmail');
const txt_pass = $('#txtPassword');
const btn_login = $('#btnLogin');
const btn_sign_up = $('#btnSignUp');
const btn_log_out = $('#btnLogOut');
const btn_g_oauth = $('#btnOAuth');

// Sign Up event
btn_sign_up.click(function() {
  console.log(txt_email.val(), txt_pass.val());
  firebase.auth().createUserWithEmailAndPassword(txt_email.val(), txt_pass.val()).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});

// Sign In event
btn_login.click(function() {
  firebase.auth().signInWithEmailAndPassword(txt_email.val(), txt_pass.val()).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});

// Log Out event
btn_log_out.click(function() {
  firebase.auth().signOut();
});

// Google auth
var provider = new firebase.auth.GoogleAuthProvider();
btn_g_oauth.click(function() {
  firebase.auth().signInWithRedirect(provider);
});

firebase.auth().getRedirectResult().then(function(result) {
  // The signed-in user info.
  var user = result.user;
  console.log("SUCCESS REDIRECT");
  console.log(user);

  var credential = result.credential;
  console.log(credential);

  var operationType = result.operationType;
  console.log(operationType);

}).catch(function(error) {
  console.log("FAILED REDIRECT");
  // Handle Errors here.
  var errorCode = error.code;
  console.log(errorCode);
  var errorMessage = error.message;
  console.log(errorMessage);
  // The email of the user's account used.
  var email = error.email;
  console.log(email);
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  console.log(credential);
  // ...

  if (errorCode === 'auth/email-already-in-use') {
    auth.fetchProvidersForEmail(email).then(function(providers) {
      // The returned 'providers' is a list of the available providers
      // linked to the email address. Please refer to the guide for a more
      // complete explanation on how to recover from this error.
      console.log("Email in use");
      console.log(providers);
    });
  }
});


// Add a realtime listener
firebase.auth().onAuthStateChanged(user => {
  if(user) {
    console.log(user);
    console.log(user.displayName, user.email);
    btn_log_out.removeClass('d-none');
  }else{
    console.log("Not logged in");
    btn_log_out.addClass('d-none');
  }
});
