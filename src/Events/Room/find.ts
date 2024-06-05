import { roomEventObject } from "../../interfaces";
import { logger } from "../../utils/etc";

const findRoom: roomEventObject = {
    eventName: "find",
    run: ({ socket, rooms, members }, room_number) => {
        if (typeof room_number !== "string") return;
        if (rooms.findIndex(i => i.room_number == room_number) === -1) {
            logger(socket.id + " Cannot find room " + room_number, "ROOM FINDER");
            return socket.emit("error", {
                status: 501,
                content: "Can't find room " + room_number,
                room_number: room_number
            });
        };

        socket.emit("room_find_response", {
            status: 200,
            content: "room number " + room_number + " is found " + members.length + " Members in this room.",
            room_number: room_number
        });
        logger(socket.id + " room number " + room_number + " is found " + members.length + " Members in this room.", "ROOM FINDER");
    }
};

export default findRoom;