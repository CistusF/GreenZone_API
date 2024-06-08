import { errorCode } from "../../interfaces/interfaces";
import { roomEventObject } from "../../interfaces/roomEvent.interface";
import { logger } from "../../utils/etc";

const findRoom: roomEventObject = {
    run: ({ socket, rooms, members }, room_number) => {
        if (typeof room_number !== "string") return;
        if (rooms.findIndex(i => i.room_number == room_number) === -1) {
            logger(socket.id + " Cannot find room " + room_number, "ROOM FINDER", -1);
            return socket.emit("error", {
                status: errorCode.room_find_room_not_found,
                message: "Can't find room " + room_number,
                room_number: room_number
            });
        };

        socket.emit("room_find_response", {
            status: 200,
            message: "room number " + room_number + " is found " + members.length + " Members in this room.",
            room_number: room_number
        });
        logger(socket.id + " room number " + room_number + " is found " + members.length + " Members in this room.", "ROOM FINDER", 1);
    }
};

export default findRoom;