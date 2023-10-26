// username choosing part

// user cannot send messages

var rs = new RoomService("wss://" + document.location.host)


var alert_sound = new Audio('alert.mp3');

var disabled = true;

var username = "ananymouse";
// (function () {
var overlay = document.getElementsByClassName("overlay")[0];
var username_input = document.getElementsByClassName("username-input")[0];
var go_button = document.getElementsByClassName("go-button")[0];
var room_input = document.getElementsByClassName("room-input")[0];

rs.onconnect = async () => {
    overlay.childNodes[1].style.display = "block";
}


go_button.onclick = async () => {
    rs.join(room_input.value)
    if (getCookies().uname !== undefined && username_input.value == "") {
        username_input.value = getCookies().uname;
        console.log(username_input.value)
    }
    setUname(username_input.value);
    overlay.remove();
    disabled = false;

    var msgs = await rs.getGeneralData("messages");
    showAllMessages(msgs);
    document.cookie = "uname=" + username_input.value;

}



rs.onmessage = (m) => {
    console.log(m)
    m.username = m.userData.username
    alert_sound.play()
    display(m)
}

function setUname(uname) {
    // tell server username
    username = uname;
    rs.setUserDataKeyValue('username', uname)
}


var messageContainer = document.getElementById("messages");
var input = document.getElementById("input");
var userDisplay = document.getElementsByClassName("users")[0];


function send() {
    if (input.innerText !== "") {
        rs.send(input.innerText);
        input.innerHTML = "";
    }
}


function showAllMessages(messages) {
    for (var message of messages) {
        message.username = message.userData.username

        display(message);
    }
}

function display(message) {
    var mc = document.createElement("div");
    var div = document.createElement("div");
    var from = document.createElement("span");
    from.className = "from";
    mc.className = "mc";
    div.className = "message";
    from.innerHTML = message.userData.username;
    div.innerHTML = message.data;
    mc.appendChild(from);
    mc.appendChild(div);
    messageContainer.appendChild(mc);
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// var messageformat = { type: "message", data: "", from: "" };

async function get(url) {
    var r = await fetch(url);
    return r.text();
}

function getCookies() {
    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var result = {};
    for (var cookie of cookies) {
        cookie = cookie.split("=");
        result[cookie[0]] = cookie[1];
    }
    return result;
}
