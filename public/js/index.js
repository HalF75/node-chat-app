var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");

});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on('welcomeToChat', function(message){
  console.log('welcomeToChat', message);
});

socket.on('newMessage', function(message) {
    console.log('newMessage:', message);
});
