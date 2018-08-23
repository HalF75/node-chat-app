var socket = io();

function scroolToBottom() {
  //Selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');
  //Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  };
};

socket.on("connect", function() {
  let params = jQuery.deparam(window.location.search);
  
  socket.emit('join', params, function(err) {
    if (err){
      alert(err);
      window.location.href="/index.html";
    } else {
      console.log('No error');
    }
  });
});

socket.on('updateUserList', function(users) {
  debugger;
  console.log(users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user){
    console.log(user);
    ol.append(jQuery('<li></li>').text(user));
  });  

  jQuery('#users').html(ol);
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on('welcomeToChat', function(message){
  console.log('welcomeToChat', message);
});

socket.on('newLocationMessage', function(message){
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formatedTime
  });

  jQuery('#messages').append(html);
  scroolToBottom();
});

socket.on('newMessage', function(message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');  
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
      from: message.from,
      text: message.text,
      createdAt: formatedTime
    });

    jQuery('#messages').append(html);
    scroolToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]'); 

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('');
  });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});