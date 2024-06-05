"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // get config from environment
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const roomIds = [];
var members = [];
const createRoomNumber = (socket) => {
    var roomId = Math.floor(Math.random() * 999999);
    roomId = String(roomId);
    for (var i = 0; i < 6 - roomId.length; i++) {
        roomId = "0" + roomId;
    }
    ;
    if (socket.rooms.has(roomId))
        return createRoomNumber(socket);
    roomIds.push(roomId);
    return roomId;
};
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log("New connection");
    socket.on("room_info", (...args) => {
        const memberData = members.find(i => i.id === socket.id);
        console.log(args);
        if (!memberData)
            return socket.emit("error", {
                status: 501,
                content: "Couldn't find member with id " + socket.id
            });
        console.log("sending room info");
        socket.emit("room_info", {
            status: 200,
            roomMembers: members.filter(i => i.room_number == memberData.room_number)
        });
    });
    socket.on('create_room', (room_info) => {
        const roomId = createRoomNumber(socket);
        socket.rooms.add(roomId);
        console.log("[Create Room]: room code : " + roomId);
        console.log("[Create Room]: room name : " + room_info.title);
        console.log("[Create Room]: room owner tel : " + room_info.tel);
        socket.join(roomId);
        members.push({
            id: socket.id,
            user_name: "방장",
            user_number: room_info.tel,
            room_number: roomId,
            owner: true
        });
        socket.emit("create_room_response", {
            status: 200,
            room_code: roomId,
            title: room_info.title,
            tel: room_info.tel,
            content: "room name " + room_info.title + " is created\nroom code is " + roomId
        });
    });
    socket.on('find_room', (room_number) => {
        if (!socket.rooms.has(room_number))
            return socket.emit("error", {
                status: 501,
                room_number: room_number,
                content: "Can't find room " + room_number
            });
        socket.emit("find_room_response", {
            status: 200,
            room_number: room_number,
            content: "room number " + room_number + "is found"
        });
    });
    socket.on('join_room', (connect_room) => {
        if (!socket.rooms.has(connect_room.room_number))
            return socket.emit("error", {
                status: 501,
                content: "Failed to join room " + connect_room.room_number
            });
        members.push({
            id: socket.id,
            room_number: connect_room.room_number,
            user_name: connect_room.user_name,
            user_number: connect_room.user_tel,
            owner: false
        });
        socket.join(connect_room.room_number);
        socket.emit("join_room_response", {});
    });
    socket.on('coord_update', (coord) => {
        const memberData = members.find(i => i.id == socket.id);
        if (!memberData)
            return socket.emit("error", "Couldn't find member with id " + socket.id);
        memberData.x = coord.x;
        memberData.y = coord.y;
        return members.filter(m => m.room_number == memberData.room_number);
    });
    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
});
// io.on(, () => {
// });
server.listen(process.env.PORT, () => {
    console.log('listening on *:' + process.env.PORT);
    console.log(io);
});
