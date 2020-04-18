var socket = io();
let usersList = [];
const newuser = prompt("whats ur name");
let name; // this line is to store only username and not ID
let userDetails; // this is to receive data from server with id and your saved name
const private_message = document.querySelectorAll(".private_message");
const recipient_name = document.querySelector("#recipient_name");
const model_body = document.querySelector(".modal-body");
let message = document.querySelector("#message"); // this line is to send message to everyone
let sendButton = document.querySelector("#sendMessage");
const card = document.querySelector(".card");
let messages = document.querySelector(".messages"); // this line gets the messages div section
let sendText = document.querySelector("#send-text"); // this is for text area
let privateMessage;
let user_id;
socket.emit("userName", newuser);
socket.on("myname", (data) => {
  console.log("your name is  " + data);
  name = data;
});
socket.on("users", (data) => {
  console.log(data);
  let onlineusers = document.querySelector("#onlineusers");
  onlineusers.innerHTML = `            <p class="lead">Online Users</p>
`;
  data.forEach((element) => {
    console.log("id " + element.id + " name " + element.name);
    if (name == element.name) {
      console.log("your name in the online users list " + name);
    } else {
      onlineusers.innerHTML += `
         <div class="card" style="width: 18rem;">
    <div class="card-body">
                <p class="card-title" id = '${element.id}'>${element.name}</p>
                <button type="button" class="btn btn-primary btn-sm " data-toggle="modal"
                    data-target="#exampleModal" onClick={privateMsg(event)}>send a private
                    message</button>
            </div> </div>`;
      console.log(element.name);
    }
  });
});
socket.on("userDetails", (data) => {
  // socket sends data with id and your typed name when u log in
  console.log(data);
  userDetails = data;
});
sendButton.addEventListener("click", () => {
  console.log(message.value.length);
  let time = moment().format("h: mm:  a");
  console.log(time);

  if (message.value.length > 0 && message.value.length < 30) {
    socket.emit("toAllUsers", { name, message: message.value, time });
  } else {
    if (message.value.trim.length == 0) {
      alert("please type in a message");
    } else alert("Message should not exceed 30 characters");
  }
  message.value = "";
});

socket.on("toAllUsers", (data) => {
  console.log("message message message !!");
  console.log(data);
  let typer;
  document.querySelector("#typing").innerHTML = "";

  if (data.name == name) {
    console.log("you are typing " + name);
  }
  data.name == name ? (typer = "You") : (typer = data.name);
  messages.innerHTML += `
    <div class="p-3 mb-2 mr-2 bg-light text-dark">
      <p class="lead align-middle">
        
        ${typer} : <small class="text-muted">${data.message}</small>  <small class="text-muted" id= "time">${data.time}</small> 
      </p>
    </div>
  `;
});
function privateMsg(event) {
  console.log("i am clicked");
  privateMessage = event.target.previousElementSibling.textContent;
  user_id = event.target.previousElementSibling.getAttribute("id");
  model_body.innerHTML = `<form>
                            <div class="form-group">
                                <label for="recipient-name" class="col-form-label">Recipient:</label>
                                <input type="text" class="form-control" id="recipient-name" value = "${privateMessage}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Message:</label>
                                <textarea class="form-control" id="message-text"></textarea>
                            </div>
                        </form>`;
}
sendText.addEventListener("click", () => {
  let textMessage = document.querySelector("#message-text").value;
  console.log(textMessage);
  let time = moment().format("h: mm:  a");
  console.log(time);
  let private_data = {
    id: user_id,
    recepeint: privateMessage,
    message: textMessage,
    name,
    time: time,
  };
  socket.emit("privateMessage", private_data);
  console.log(private_data);
});

socket.on("privateMessage", (data) => {
  messages.innerHTML += `
    <div class="p-3 mb-2 mr-2 bg-light text-dark">
      <p class="lead align-middle">
        
        ${data.name} : <small class="text-muted">${data.message}</small> <small class="text-muted" id= "time">${data.time}</small>
      </p>
    </div>
  `;
});
function pressFunc() {
  console.log(`${name} is typing`);

  socket.emit("typing", name);
}
socket.on("typing", (user) => {
  let typing = document.querySelector("#typing");
  typing.innerHTML = `<small>${user} is typing</small>`;
});
socket.on("afterexit", (data) => {
  let onlineusers = document.querySelector("#onlineusers");
  onlineusers.innerHTML = `            <p class="lead">Online Users</p>
`;
  data.forEach((element) => {
    console.log("id " + element.id + " name " + element.name);
    if (name == element.name) {
      console.log("your name in the online users list " + name);
    } else {
      onlineusers.innerHTML += `
         <div class="card" style="width: 18rem;">
    <div class="card-body">
                <p class="card-title" id = '${element.id}'>${element.name}</p>
                <button type="button" class="btn btn-primary btn-sm " data-toggle="modal"
                    data-target="#exampleModal" onClick={privateMsg(event)}>send a private
                    message</button>
            </div> </div>`;
      console.log(element.name);
    }
  });
});

socket.on("disconnectUser", (data) => {
  //console.log(data);
  alert(data.name + " disconnected");
});
