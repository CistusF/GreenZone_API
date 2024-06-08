import { logger } from "../../utils/etc";
import { roomEventObject } from "../../interfaces/roomEvent.interface";

const leaveRoom: roomEventObject = {
    run: ({ socket, rooms, members }) => {
        const memberData = members.find(i => i.id === socket.id);
        const room = rooms.find(i => i.room_number === memberData?.room_number);
        if (!room || !memberData) {
            socket.emit("error", {
                status: 501,
                content: "You must be owner of specified room"
            });
            return;
        };

        const memberIndex = members.findIndex(i => i.id === memberData.id);
        members.splice(memberIndex, 1);

        logger(memberData.id + " leave Room " + room.room_number, "ROOM LEAVE", -1);
    }
};

export default leaveRoom;