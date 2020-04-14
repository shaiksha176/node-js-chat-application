let login_form = document.querySelector("#login-form");
let error_display = document.querySelector(".error_display");
let name;
var socket = io();
let users = [];

login_form.addEventListener("submit", (event) => {
  event.preventDefault();
  name = document.querySelector("#name").value;
  if (name.trim().length == 0) {
    error_display.innerHTML = `<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title .text-danger

" id="exampleModalLabel">Error</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <b>Name  cannot be empty</b>
                    </div>

                </div>
            </div>
        </div>`;
  } else {
    if (users.indexOf(name) > -1) {
      alert("username already took");
    } else {
      users.push(name);
      socket.emit("userName", name);

      //window.location.href = "/chat";
      // senddata(name);
    }
  }

  // login_form.reset();
});
socket.on("myname", (data) => {
  console.log("my name is " + data);
});
