function RoomService(url = "ws://localhost") {
    this.url = url;
    this.onmessage = () => { };
    this.buffer = [];
    this.ws = null;
    this.onconnect = null;
    this.connected = () => { };
    this.ws = new WebSocket(this.url);
    var that = this;
    this.ws.onopen = () => {
        that.onconnect();
        that.connected = true;
    }
    this.ws.onmessage = (event) => {
        message = event.data;
        message = JSON.parse(message);
        var m = message;
        delete m.message
        this.buffer.push(m);
        that.onmessage(m);
    }


    this.join = (room) => {
        that.ws.send(JSON.stringify({ "type": "room_please", "data": { "room": room } }));
        return;
    }

    this.waitForResponse = (type) => {
        return new Promise((resolve, reject) => {
            function listener(event) {
                var message = JSON.parse(event.data);
                if (message.type == type) {
                    that.ws.removeEventListener("message", listener)
                    resolve(message.data);
                }
            }
            this.ws.addEventListener("message", listener)
        });
    }

    that = this

    this.send = (message) => {
        this.ws.send(JSON.stringify({ "type": "message", "data": message }));
    }

    this.receive = () => {
        var b = this.buffer;
        this.buffer = [];
        return b;
    }

    this.setUserDataKeyValue = (key, value) => {
        this.ws.send(JSON.stringify({ "type": "setUserDataKVpair", "data": { "key": key, "value": value } }));
    }

    this.getUserData = (userID) => {
        this.ws.send(JSON.stringify({ "type": "getUserData", "data": { "id": userID } }));
        return this.waitForResponse("userData");
    }

    this.getGeneralData = (type) => {
        this.ws.send(JSON.stringify({ "type": "getGeneralData", "data": { "type": type } }));
        return this.waitForResponse("generalData");
    }

    this.getAllUserData = () => {
        this.ws.send(JSON.stringify({ "type": "getAllUserData", "data": {} }));
        return this.waitForResponse("allUserData");
    }
}
