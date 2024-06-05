import { Socket } from "socket.io";
import { joinUserInfoType, roomInfoType, socketMemberType } from "../interfaces";
import { logger } from "./etc";

// Create Room
export const createRoom = (socket: Socket, members: socketMemberType[], room_info: roomInfoType, room_numbers: string[]) => {
    const roomId = createRoomNumber(room_numbers, socket);
    socket.rooms.add(roomId);
    socket.join(roomId);

    logger(["room code : " + roomId, "room name : " + room_info.title, "room owner tel : " + room_info.tel], "Create Room");

    members.push({
        id: socket.id,
        user_name: "방장",
        user_number: room_info.tel,
        room_number: roomId,
        owner: true
    });

    socket.emit("create_room_response", {
        status: 200,
        content: "room name " + room_info.title + " is created\nroom code is " + roomId,
        room_code: roomId,
        title: room_info.title,
        tel: room_info.tel
    });
};

// Create Room Number
const createRoomNumber = (room_numbers: string[], socket: Socket): string => {
    var room_number: number | string = Math.floor(Math.random() * 999999);
    room_number = String(room_number);

    for (var i = 0; i < 6 - room_number.length; i++) {
        room_number = "0" + room_number;
    };

    if (socket.rooms.has(room_number)) return createRoomNumber(room_numbers, socket);
    room_numbers.push(room_number);
    return room_number;
};

// Join Room
export const joinRoom = (socket: Socket,  members: socketMemberType[], join_user_info: joinUserInfoType) => {
    if (!socket.rooms.has(join_user_info.room_number)) return socket.emit("error", {
        status: 501,
        content: "Failed to join room " + join_user_info.room_number
    });
    members.push({
        id: socket.id,
        room_number: join_user_info.room_number,
        user_name: join_user_info.user_name,
        user_number: join_user_info.user_tel,
        owner: false
    })
    socket.join(join_user_info.room_number);

    socket.emit("join_room_response", {

    });
};

// Find Room
export const findRoom = (socket: Socket, members: socketMemberType[], room_number: string) => {
    if (!socket.rooms.has(room_number)) return socket.emit("error", {
        status: 501,
        content: "Can't find room " + room_number,
        room_number: room_number
    });

    socket.emit("find_room_response", {
        status: 200,
        content: "room number " + room_number + "is found\n" + members.length + "Members in this room.",
        room_number: room_number
    });
};

// Room Info
export const roomInfo = (socket: Socket, members: socketMemberType[], room_number: string) => {
    socket.emit("room_info_response", {
        status: 200,
        roomMembers: members.filter(i => i.room_number == room_number)
    });
};