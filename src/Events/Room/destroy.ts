import { logger } from "../../utils/etc";
import { roomEventObject } from "../../interfaces/roomEvent.interface";
import { errorCode } from "../../interfaces/interfaces";

const destroyRoom: roomEventObject = {
    run: ({ io, socket, rooms, members }) => {
        const room = rooms.find(i => i.ownerId === socket.id);

        if (!room) {
            socket.emit("error", {
                status: errorCode.room_destroy_not_connected,
                content: "You must be owner of specified room"
            });
            return;
        };

        io.to(room.room_number).emit("room_destroyed", {
            status: 200,
            message: "Room is now destroyed"
        });

        io.in(room.room_number).socketsLeave(room.room_number);

        const roomMembers = members.filter(m => m.room_number === room.room_number);
        roomMembers.forEach(m => {
            const memberIndex = members.findIndex(i => i.id === m.id);
            members.splice(memberIndex, 1);
        });

        const index = rooms.findIndex(i => i.room_number === room.room_number);
        rooms.splice(index, 1);

        logger("Room " + room.room_number + "is now destroyed", "Room Destroyer", -1);
    }
};

export default destroyRoom;