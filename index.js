var app = angular.module("chatRoom", [])

var userList;
var currentLogIn;

app.controller("UserController", function($scope, $http, $interval){

$scope.selectedUser;

var setSelected = function() {
  currentLogIn = $scope.selectedUser;
  console.log(currentLogIn)
}

var getUsers = function() {
  $http.get('https://tiy-chat-server.herokuapp.com/user').
    success(function(data) {
      $scope.users = data;
      userList = data;

      console.log($scope.selectedUser)

    }).
    error(function(data) {
      console.log("you screwed up");
    });
  }

  getUsers();
  console.log(userList)

  $scope.addUser = function() {

    $scope.newUser = {
      username: $scope.username,
      fullname: $scope.fullname,
      status: $scope.status
    };

    $http.post('https://tiy-chat-server.herokuapp.com/user', $scope.newUser).
      success(function(data) {
        console.log(data, "new user created!");
      }).
      error(function(data) {
        console.log("nope")
      });

      getUsers();

  }  

  $interval(setSelected, 1000);

})

app.controller("InputController", function($scope, $http, $interval){

  $scope.userList = userList;

  $scope.sendMessage = function() {

    var currentTime = moment().format();

      console.log(userList)
  console.log(currentLogIn)

    $scope.newMessage = {
      user_id: "559d7c4bba10131100cff339",
      text: $scope.messageText,
      timestamp: currentTime
    };

   $http.post('https://tiy-chat-server.herokuapp.com/message', $scope.newMessage).
      success(function(data) {
        console.log(data, "new message");
      }).
      error(function(data) {
        console.log("nope")
      });

      document.getElementById("messageInput").value = "";
  }

})

app.controller("MessageController", function($scope, $http, $interval){

  var getMessages = function() {
  $http.get('https://tiy-chat-server.herokuapp.com/messages/recent').
    success(function(data) {
      $scope.messages = data;

      _.each(data, function(message){
        var messageUserId = message.user_id;
        message.timestamp = moment(message.timestamp).format('h:mm a');

        _.each(userList, function(user){
          var currentUserId = user._id;
          var currentUsername = user.username;
          if (currentUserId === messageUserId) {
            return message.user_id = user.username;
          }
        });
      });
    }).
    error(function(data) {
      console.log("you screwed up");
    });
  }

  getMessages();
  $interval(getMessages, 1000);

})