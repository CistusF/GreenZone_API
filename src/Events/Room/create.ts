import { Socket } from "socket.io";
import { roomsInterface } from "../../interfaces/interfaces";
import { logger } from "../../utils/etc";
import { RoomInfo, joinUserInfoType, roomEventObject, roomInfoType } from "../../interfaces/roomEvent.interface";

function isRoomInfoTypes(obj: string | joinUserInfoType | roomInfoType): obj is roomInfoType {
    if (typeof obj != "object") return false;
    try {
        RoomInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

// Create Room
const createRoom: roomEventObject = {
    run: ({ socket, rooms, members }, room_info) => {
        if (!room_info || !isRoomInfoTypes(room_info)) return logger("Cannot found room information", "ROOM CREATOR", -1);
        const roomId = createRoomNumber(socket, rooms);
        rooms.push({
            room_number: roomId,
            title: room_info.title,
            ownerId: socket.id,
            boundary: {
                x: null,
                y: null,
                safety: null,
                limit: null
            }
        });
        socket.rooms.add(roomId);
        socket.join(roomId);

        logger(["room code : " + roomId, "room name : " + room_info.title, "room owner tel : " + room_info.tel], "ROOM CREATOR", 1);

        members.push({
            id: socket.id,
            user_name: "방장",
            user_tel: room_info.tel,
            room_number: roomId
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