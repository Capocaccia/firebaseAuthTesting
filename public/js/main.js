// var Firebase = require('firebase');
'use strict';

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
});
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
    }, function (err, userData) {
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
      var h1 = $('.onLoggedIn h1').text('Hello ' + authData.password.email);
      //sets var h1 to the first h1 in the onLoggedIn div and appends jquery .text method the email address
      // of the user
      email.val('');
      password.val('');
      //resets the value of the email and password fields to empty so the users info doesnt remain after logout
      $.ajax({
        method: 'PUT',
        url: '' + FIREBASE_URL + '/users/' + authData.uid + '/profile.json',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksWUFBWSxHQUFHLHNDQUFzQyxDQUFDO0FBQzFELElBQUksRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRWxDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFNUIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVsQyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7O0FBRzVELENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWTtBQUMvQixJQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDWiwyQkFBeUIsRUFBRSxDQUFDO0NBQzdCLENBQUMsQ0FBQTs7OztBQUlGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZOztBQUVyQyxNQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUMvQyxNQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLE1BQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLMUMsTUFBSSxRQUFRLEtBQUssYUFBYSxFQUFFOztBQUU5QixNQUFFLENBQUMsVUFBVSxDQUFDO0FBQ1osV0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDbEIsY0FBUSxFQUFFLFFBQVE7OztBQUFBLEtBR25CLEVBQUMsVUFBVSxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFVBQUksR0FBRyxFQUFFO0FBQ1AsZUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs7T0FFN0IsTUFBTTtBQUNMLDJCQUFtQixFQUFFLENBQUM7O09BRXZCO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osTUFBTTtBQUNMLFNBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztHQUVyQzs7QUFFRCxPQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Q0FDeEIsQ0FBQyxDQUFDOztBQUVILENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWTs7QUFFbEMsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDNUMsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUM7O0FBRWxELElBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzs7QUFFbEIsU0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDbEIsWUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUU7O0FBQUEsR0FFekIsRUFBRSxVQUFVLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDMUIsUUFBSSxHQUFHLEVBQUU7O0FBRVAsV0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOztLQUV2QixNQUFNO0FBQ0wsK0JBQXlCLEVBQUUsQ0FBQztBQUM1QixVQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLFlBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUcsQ0FBQTs7O0FBR3JFLFdBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZCxjQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVqQixPQUFDLENBQUMsSUFBSSxDQUFDO0FBQ0wsY0FBTSxFQUFFLEtBQUs7QUFDYixXQUFHLE9BQUssWUFBWSxlQUFVLFFBQVEsQ0FBQyxHQUFHLGtCQUFlO0FBQ3pELFlBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztPQUMvQixDQUFDLENBQUM7O0tBRUo7R0FDRixDQUFDLENBQUM7O0FBRUgsT0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOztDQUV4QixDQUFDLENBQUM7O0FBRUgseUJBQXlCLEVBQUUsQ0FBQzs7QUFFNUIsU0FBUyxtQkFBbUIsR0FBRztBQUM3QixjQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVuQyxXQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztDQUVqQzs7QUFFRCxTQUFTLHlCQUF5QixHQUFHO0FBQ25DLE1BQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFNUIsTUFBSSxRQUFRLEVBQUU7QUFDWixlQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLGNBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDbEMsTUFBTTtBQUNMLGVBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEMsY0FBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUMvQjtDQUNGIiwiZmlsZSI6InNyYy9qcy9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcbnZhciBGSVJFQkFTRV9VUkwgPSAnaHR0cHM6Ly9idWlsZHNjcmlwdHMuZmlyZWJhc2Vpby5jb20vJztcbnZhciBmYiA9IG5ldyBGaXJlYmFzZShGSVJFQkFTRV9VUkwpO1xudmFyIG9uTG9nZ2VkT3V0ID0gJCgnLm9uTG9nZ2VkT3V0Jyk7XG52YXIgb25Mb2dnZWRJbiA9ICQoJy5vbkxvZ2dlZEluJyk7XG5cbnZhciBsb2dpblBhZ2UgPSAkKCcubG9naW4nKTtcblxudmFyIHJlZ2lzdGVyUGFnZSA9ICQoJy5yZWdpc3RlcicpO1xuXG4kKCcudG9Mb2dpbkJ0biwgLnRvUmVnaXN0ZXJCdG4nKS5jbGljayh0b2dnbGVMb2dpblJlZ2lzdGVyKTtcbi8vMTA6IG9uIGNsaWNrIG9uIExvZ2luIGJ1dHRvbiBvciBSZWdpc3RlciBidXR0b24gcnVucyB0aGUgXCJ0b2dnbGVMb2dpblJlZ2lzdGVyXCIgZnVuY3Rpb25cbi8vMTA6IFRoYXQgZnVuY3Rpb24gdG9nZ2xlcyB0aGUgXCJoaWRkZW5cIiBjbGFzcyBvbiB0aGUgbG9naW4gZGl2IGFuZCByZWdpc3RlciBkaXZcbiQoJy5kb0xvZ291dCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgZmIudW5hdXRoKCk7XG4gIHRvZ2dsZUNvbnRlbnRCYXNlZE9uTG9naW4oKTtcbn0pXG4vLzEzLTE4OiBPbiBjbGljayBvZiB0aGUgbG9nb3V0IGJ1dHRvbiBydW5zIGZiLnVuYXV0aCgpOyB3aGljaCBsb2dzIHlvdSBvdXRcbi8vMTMtMTg6IGFuZCBydW5zIHRoZSB0b2dnbGVDb250ZW50QmFzZU9uTG9naW4gZnVuY3Rpb24gd2hpY2ggZG9lcyB3aGF0IGl0IHNheXNcblxuJCgnLnJlZ2lzdGVyIGZvcm0nKS5zdWJtaXQoZnVuY3Rpb24gKCkge1xuICAvLzIwOiBzZWxlY3RzIHRoZSBmaXJzdCBmb3JtIHRoZSB0aGUgcmVnaXN0ZXIgZGl2IGFuZCAuc3VibWl0IGlzIGFuIGV2ZW50IGhhbmRsZXJcbiAgdmFyIGVtYWlsID0gJCgnLnJlZ2lzdGVyIGlucHV0W3R5cGU9XCJlbWFpbFwiXScpO1xuICB2YXIgcGFzc3dvcmRzID0gJCgnLnJlZ2lzdGVyIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpO1xuICAvLzIyLTIzOiBzZWxlY3RzIHNwZWNpZmljIGlucHV0cyBzaW5jZSB0aGVyZSBhcmUgbXVsdGlwbGUsIHJldHVybnMgYW4gYXJyYXkgbGlrZSB0aGluZ1xuICB2YXIgcGFzc3dvcmQgPSAkKHBhc3N3b3Jkc1swXSkudmFsKCk7XG4gIHZhciBwYXNzd29yZENoZWNrID0gJChwYXNzd29yZHNbMV0pLnZhbCgpO1xuICAvL25vdCBzdXJlIGhvdyB0aGF0IGFycmF5IHZhbHVlIHdvcmtzXG4gIC8vMjUtMjY6IHNlbGVjdHMgdGhlIGVtcHR5IHBhc3N3b3JkIGZpZWxkcyBpbmRpdmlkdWFsbHkgd2l0aCB0aGVpciBpbmRleCB2YWx1ZXMgYW5kIC52YWwgZ2V0cyB0aGUgc3RyaW5nXG4gIC8vMjUtMjY6IHNvIHRoZSB2YXJpYWJsZXMgYXJlIE5PVCBzZXQgdG8gdGhlIHF1ZXJ5IHNlbGVjdG9yLiBUaGV5IGFyZSBzZXQgdG8gdGhlIHN0cmluZyB2YWx1ZS5cbiAgLy8yNS0yNiBDYWxlYiBOb3RlczogU28sIGB2YXIgcGFzc3dvcmRzID0gJCgnLnJlZ2lzdGVyIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXeKAmSk7YCB0aGlzIHJldHVybnMgYW4gYXJyYXktdHlwZSB0aGluZyAoIHRoaXMgaXMgc3RpbGwgYSBsaXR0bGUgbXlzdGVyaW91cyB0byBtZSApIGJlY2F1c2UgdGhlcmUgYXJlIG1vcmUgdGhhbiBvbmUgYGlucHV0W3R5cGU94oCccGFzc3dvcmTigJ1dYCBlbGVtZW50cyBpbiB0aGUgYC5yZWdpc3RlcmAgY2xhc3MuICBTbyB3aGVuIHlvdSBnbyB0byBzZWxlY3QgZWFjaCBvZiB0aGUgdHdvIGBpbnB1dFt0eXBlPeKAnHBhc3N3b3Jk4oCdXWAgZWxlbWVudHMsIHlvdSBoYXZlIHRvIGRvIHNvIHVzaW5nIGFycmF5IHNlbGVjdG9ycywgZS5nLiwgYFswXWAuICBOb3cgdGhpcyByZXR1cm5zIGEgRE9NIGVsZW1lbnQuICBTbyB0byB1c2UgdGhlIGpRdWVyeSBtZXRob2RzLCBpbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byB1c2UgYC52YWwoKWAsIHlvdSBuZWVkIHRvIHdyYXAgdGhlIERPTSBlbGVtZW50IGluIGpRdWVyeSBub3RhdGlvbiBgJCjigJjigJkpYC1zdHlsZSB0byBiZSBhYmxlIHRvIGRvIHNvLiAgVGhpcyBjb252ZXJ0cyB0aGUgRE9NIGVsZW1lbnQgdG8gYSBcImpRdWVyeSBvYmplY3RcIlxuICBpZiAocGFzc3dvcmQgPT09IHBhc3N3b3JkQ2hlY2spIHtcbiAgICAvL2lmIHBhc3N3b3JkIGZpZWxkIDAgPT09IHBhc3N3b3JkIGZpZWxkIDFcbiAgICBmYi5jcmVhdGVVc2VyKHtcbiAgICAgIGVtYWlsOiBlbWFpbC52YWwoKSxcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgLy8zMy0zNTogY3JlYXRlcyBhIHVzZXIgdXNpbmcgeW91ciBmaXJlYmFzZSB1cmwgc28gdGhpcyBpcyBzZW5kaW5nIGEgcmVxdWVzdCBhbmQgZGF0YSBpcyByZXR1cm5lZCBiYWNrIGFzXG4gICAgICAvLyBhcmd1bWVudCB1c2VyRGF0YSBhbmQgaWYgdGhlcmVzIGFuZCBlcnJvciBpdCByZXR1cm5zIGl0IGFzIGFyZ3VtZW50IGVyclxuICAgIH0sZnVuY3Rpb24gKGVyciwgdXNlckRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAvL2lmIGVycm9yIGlzIHJldHVybmVkIGJ5IGNyZWF0ZVVzZXIgY29uc29sZSBsb2cgdGhlIGVycm9yIGluIGEgc3RyaW5nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b2dnbGVMb2dpblJlZ2lzdGVyKCk7XG4gICAgICAgIC8vIGlmIGVycm9yIGlzIG5vdCByZXR1cm5lZCBydW4gdGhlIHRvZ2dsZUxvZ2luUmVnaXN0ZXIoKSBmdW5jdGlvblxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGFsZXJ0KCdUaGUgcGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuICAgIC8vaWYgcGFzc3dvcmQgIT09PSBwYXNzd29yZE1hdGNoIGFsZXJ0IGFib3ZlIHN0YXRtZW50XG4gIH1cblxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG4vL2xpbmVzIDMzLTQ2IHN0cnVjdHVyZSBpcyBwcm92aWRlZCBieSBmaXJlYmFzZSBkb2NzXG4kKCcubG9naW4gZm9ybScpLnN1Ym1pdChmdW5jdGlvbiAoKSB7XG4gIC8vc2VsZWN0cyB0aGUgZm9ybSBpbiB0aGUgbG9naW4gZGl2IGFuZCBhZGRzIGEgc3VibWl0IGNsaWNrIGxpc3RlbmVyXG4gIHZhciBlbWFpbCA9ICQoJy5sb2dpbiBpbnB1dFt0eXBlPVwiZW1haWxcIl0nKTtcbiAgdmFyIHBhc3N3b3JkID0gJCgnLmxvZ2luIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpO1xuICAvL3NlbGVjdHMgdGhlIG5lY2Vzc2FyeSBmaWVsZHMgYW5kIHNlbmRzIHRoZW0gYmFjayB0byB0aGVpciB2YXJpYWJsZXMuIFNlbGVjdHMgdGhlIGZpZWxkcyBub3QgdGhlIC52YWxcbiAgZmIuYXV0aFdpdGhQYXNzd29yZCh7XG4gICAgLy9lbnRpcmUgYXV0aFdpdGhQYXNzd29yZCBmdW5jdGlvbiBwcm92aWRlZCBieSBmaXJlYmFzZVxuICAgIGVtYWlsOiBlbWFpbC52YWwoKSxcbiAgICBwYXNzd29yZDogcGFzc3dvcmQudmFsKClcbiAgICAvL3NlbGVjdHMgdGhlIHZhbHVlIG9mIHRoZWlyIHJlc3BlY3RpdmUgZmllbGRzIGFuZCBzZW5kcyB0aGF0IHRvIGZpcmViYXNlIHdoaWNoIHJldHVybnMgYXV0aERhdGFcbiAgfSwgZnVuY3Rpb24gKGVyciwgYXV0aERhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICAvL2lmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGFuIGVycm9yIHJ1biB0aGUgZm9sbG93aW5nXG4gICAgICBhbGVydChlcnIudG9TdHJpbmcoKSk7XG4gICAgICAvL2FsZXJ0IHRoZSBlcnJvciBpbnRvIGEgc3RyaW5nXG4gICAgfSBlbHNlIHtcbiAgICAgIHRvZ2dsZUNvbnRlbnRCYXNlZE9uTG9naW4oKTtcbiAgICAgIHZhciBoMSA9ICQoJy5vbkxvZ2dlZEluIGgxJykudGV4dChgSGVsbG8gJHthdXRoRGF0YS5wYXNzd29yZC5lbWFpbH1gKVxuICAgICAgLy9zZXRzIHZhciBoMSB0byB0aGUgZmlyc3QgaDEgaW4gdGhlIG9uTG9nZ2VkSW4gZGl2IGFuZCBhcHBlbmRzIGpxdWVyeSAudGV4dCBtZXRob2QgdGhlIGVtYWlsIGFkZHJlc3NcbiAgICAgIC8vIG9mIHRoZSB1c2VyXG4gICAgICBlbWFpbC52YWwoJycpO1xuICAgICAgcGFzc3dvcmQudmFsKCcnKTtcbiAgICAgIC8vcmVzZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZW1haWwgYW5kIHBhc3N3b3JkIGZpZWxkcyB0byBlbXB0eSBzbyB0aGUgdXNlcnMgaW5mbyBkb2VzbnQgcmVtYWluIGFmdGVyIGxvZ291dFxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgdXJsOiBgJHtGSVJFQkFTRV9VUkx9L3VzZXJzLyR7YXV0aERhdGEudWlkfS9wcm9maWxlLmpzb25gLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhdXRoRGF0YSlcbiAgICAgIH0pO1xuICAgICAgLy90aGUgYWJvdmUgXCJwdXRcIiByZXF1ZXN0IHNlbmRzIHRoZSB1c2VycyBlbWFpbCBhZGRyZXNzIHRvIHRoZSBmaXJlYmFzZSBhbmQgYWRkcyBpdCB0byB0aGVpciBcInByb2ZpbGVcIi5qc29uIGluIGEgc3RyaW5nIGZvcm1cbiAgICB9XG4gIH0pO1xuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIC8vcHJldmVudHMgdGhlIHBhZ2UgZnJvbSBhdXRvIHJlZnJlc2hpbmdcbn0pO1xuXG50b2dnbGVDb250ZW50QmFzZWRPbkxvZ2luKCk7XG5cbmZ1bmN0aW9uIHRvZ2dsZUxvZ2luUmVnaXN0ZXIoKSB7XG4gIHJlZ2lzdGVyUGFnZS50b2dnbGVDbGFzcygnaGlkZGVuJyk7XG4gIC8vdG9nZ2xlcyB0aGUgaGlkZGVuIGNsYXNzIG9uIHJlZ2lzdGVyUGFnZSB3aGVuIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgbG9naW5QYWdlLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcbiAgLy90b2dnbGVzIHRoZSBoaWRkZW4gY2xhc3Mgb24gbG9naW5QYWdlIHdoZW4gdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxufVxuXG5mdW5jdGlvbiB0b2dnbGVDb250ZW50QmFzZWRPbkxvZ2luKCkge1xuICB2YXIgYXV0aERhdGEgPSBmYi5nZXRBdXRoKCk7XG4gIC8vc2V0cyBhdXRoRGF0YSB0byBhIGZpcmViYXNlIHJlcXVlc3Qgb2YgZ2V0QXV0aFxuICBpZiAoYXV0aERhdGEpIHtcbiAgICBvbkxvZ2dlZE91dC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgb25Mb2dnZWRJbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gIH0gZWxzZSB7XG4gICAgb25Mb2dnZWRPdXQucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIG9uTG9nZ2VkSW4uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG59XG4iXX0=