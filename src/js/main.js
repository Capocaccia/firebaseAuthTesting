// var Firebase = require('firebase');
var FIREBASE_URL = 'https://buildscripts.firebaseio.com/';
var fb = new Firebase(FIREBASE_URL);
var onLoggedOut = $('.onLoggedOut');
var onLoggedIn = $('.onLoggedIn');

var loginPage = $('.login');

var registerPage = $('.register');

$('.toLoginBtn, .toRegisterBtn').click(toggleLoginRegister);
//10: on click on Login button or Register button runs the "toggleLoginRegister" function
//10: That function toggles the "hidden" class on the login div and register div
$('.doLogout').click(function () {
  fb.unauth();
  toggleContentBasedOnLogin();
})
//13-18: On click of the logout button runs fb.unauth(); which logs you out
//13-18: and runs the toggleContentBaseOnLogin function which does what it says

$('.register form').submit(function () {
  //20: selects the first form the the register div and .submit is an event handler
  var email = $('.register input[type="email"]');
  var passwords = $('.register input[type="password"]');
  //22-23: selects specific inputs since there are multiple, returns an array like thing
  var password = $(passwords[0]).val();
  var passwordCheck = $(passwords[1]).val();
  //not sure how that array value works
  //25-26: selects the empty password fields individually with their index values and .val gets the string
  //25-26: so the variables are NOT set to the query selector. They are set to the string value.
  //25-26 Caleb Notes: So, `var passwords = $('.register input[type="password"]’);` this returns an array-type thing ( this is still a little mysterious to me ) because there are more than one `input[type=“password”]` elements in the `.register` class.  So when you go to select each of the two `input[type=“password”]` elements, you have to do so using array selectors, e.g., `[0]`.  Now this returns a DOM element.  So to use the jQuery methods, in this case we want to use `.val()`, you need to wrap the DOM element in jQuery notation `$(‘’)`-style to be able to do so.  This converts the DOM element to a "jQuery object"
  if (password === passwordCheck) {
    //if password field 0 === password field 1
    fb.createUser({
      email: email.val(),
      password: password
      //33-35: creates a user using your firebase url so this is sending a request and data is returned back as
      // argument userData and if theres and error it returns it as argument err
    },function (err, userData) {
      if (err) {
        console.log(err.toString());
        //if error is returned by createUser console log the error in a string
      } else {
        toggleLoginRegister();
        // if error is not returned run the toggleLoginRegister() function
      }
    });
  } else {
    alert('The passwords do not match');
    //if password !=== passwordMatch alert above statment
  }

  event.preventDefault();
});
//lines 33-46 structure is provided by firebase docs
$('.login form').submit(function () {
  //selects the form in the login div and adds a submit click listener
  var email = $('.login input[type="email"]');
  var password = $('.login input[type="password"]');
  //selects the necessary fields and sends them back to their variables. Selects the fields not the .val
  fb.authWithPassword({
    //entire authWithPassword function provided by firebase
    email: email.val(),
    password: password.val()
    //selects the value of their respective fields and sends that to firebase which returns authData
  }, function (err, authData) {
    if (err) {
      //if the function returns an error run the following
      alert(err.toString());
      //alert the error into a string
    } else {
      toggleContentBasedOnLogin();
      var h1 = $('.onLoggedIn h1').text(`Hello ${authData.password.email}`)
      //sets var h1 to the first h1 in the onLoggedIn div and appends jquery .text method the email address
      // of the user
      email.val('');
      password.val('');
      //resets the value of the email and password fields to empty so the users info doesnt remain after logout
      $.ajax({
        method: 'PUT',
        url: `${FIREBASE_URL}/users/${authData.uid}/profile.json`,
        data: JSON.stringify(authData)
      });
      //the above "put" request sends the users email address to the firebase and adds it to their "profile".json in a string form
    }
  });

  event.preventDefault();
  //prevents the page from auto refreshing
});

toggleContentBasedOnLogin();

function toggleLoginRegister() {
  registerPage.toggleClass('hidden');
  //toggles the hidden class on registerPage when the function is called
  loginPage.toggleClass('hidden');
  //toggles the hidden class on loginPage when the function is called
}

function toggleContentBasedOnLogin() {
  var authData = fb.getAuth();
  //sets authData to a firebase request of getAuth
  if (authData) {
    onLoggedOut.addClass('hidden');
    onLoggedIn.removeClass('hidden');
  } else {
    onLoggedOut.removeClass('hidden');
    onLoggedIn.addClass('hidden');
  }
}
