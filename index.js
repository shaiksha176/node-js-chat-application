const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
app.set("view engine", "ejs");
app.use(express.static("public"));
console.log("express framework");
let users = [];
app.get("/", (req, res) => {
  res.render("chat");
});

io.on("connection", function (socket) {
  socket.on("userName", (data) => {
    console.log("before array psuh");
    console.log(users.indexOf(data.name));
    if (users.indexOf(data) > -1) {
      socket.emit("errorMessage", data + " username is already taken");
      console.log("username already taken " + data);
    } else {
      socket.emit("myname", data);
      let userData = { id: socket.id, name: data };
      console.log("single user data");
      console.log(userData);
      users.push({ id: socket.id, name: data });

      console.log(users);
      socket.emit("userDetails", userData); // this line sends particular user data when that individual logs in
      io.emit("users", users); // this line sends list of users who are connected to the socket
    }
  });
  console.log("not expecting empty array");
  console.log(users);
  socket.on("toAllUsers", (data) => {
    // this code is to send message to everyone who are connected to the socket
    console.log("new messages coming up");
    console.log(data);
    io.emit("toAllUsers", data);
  });
  socket.on("privateMessage", (data) => {
    console.log(data);
    socket.broadcast.to(data.id).emit("privateMessage", data);
  });
  socket.on("typing", (data) => {
    // console.log(`${data} is typing`);
    socket.broadcast.emit("typing", data);
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
    console.log("user " + socket.id + " disconnected");
    const disconnectUser = users.find((element) => element.id == socket.id);
    io.emit("disconnectUser", disconnectUser);
    console.log("disconnect user details");
    console.log(disconnectUser.name);
    const newUsers = users.filter((data) => data.id !== socket.id);
    users = [...newUsers];
    console.log("new array");
    console.log(users);
    io.emit("afterexit", users);
  });
});
const port = process.env.PORT || 8080;

http.listen(port, function () {
  console.log("listening on *:8080");
});
