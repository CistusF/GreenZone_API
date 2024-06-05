import { Socket } from "socket.io";
import { roomEventObject, roomInfoType, roomsInterface } from "../../interfaces";
import { logger } from "../../utils/etc";

// Create Room
const createRoom: roomEventObject = {
    eventName: "create",
    run: ({socket, rooms, members}, room_info) => {
        room_info = room_info as roomInfoType;
        const roomId = createRoomNumber(socket, rooms);
        rooms.push({room_number: roomId, title: room_info.title });
        socket.rooms.add(roomId);
        socket.join(roomId);

        logger(["room code : " + roomId, "room name : " + room_info.title, "room owner tel : " + room_info.tel], "ROOM CREATOR");

        members.push({
            id: socket.id,
            user_name: "방장",
            user_number: room_info.tel,
            room_number: roomId,
            owner: true
        });

        socket.emit("room_create_response", {
            status: 200,
            content: "room name " + room_info.title + " is created\nroom code is " + roomId,
            room_code: roomId,
            title: room_info.title,
            tel: room_info.tel
        });
    }
};

// Create Room Number
const createRoomNumber = (socket: Socket, rooms: roomsInterface[]): string => {
    var room_number: number | string = Math.floor(Math.random() * 999999);
    room_number = String(room_number);

    for (var i = 0; i < 6 - room_number.length; i++) {
        room_number = "0" + room_number;
    };

    if (rooms.findIndex(i => i.room_number === room_number) !== -1) return createRoomNumber(socket, rooms);
    return room_number;
};

export default createRoom;