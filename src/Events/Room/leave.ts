import { addLog, logger } from "../../utils/etc";
import { roomEventObject } from "../../interfaces/roomEvent.interface";
import { errorCode } from "../../interfaces/interfaces";
import { logType } from "../../interfaces/common.interface";

const leaveRoom: roomEventObject = {
    run: ({ socket, rooms, members }) => {
        const memberData = members.find(i => i.id === socket.id);
        const room = rooms.find(i => i.room_number === memberData?.room_number);
        if (!room || !memberData) {
            socket.emit("error", {
                status: errorCode.room_leave_not_connected,
                message: "You must be joined of specified room"
            });
            return;
        };
        const room_owner = members.find(i => i.id === room.ownerId)!;

        const memberIndex = members.findIndex(i => i.id === memberData.id);
        members.splice(memberIndex, 1);
        socket.leave(memberData.room_number);

        logger(memberData.id + " leave Room " + room.room_number, "ROOM LEAVE", -1);

        socket.to(room.ownerId).emit("chat_event", {
            status: 201,
            from: "system",
            to: room_owner.user_tel,
            message: memberData.user_name
        });

        addLog(room, {
            from: "system",
            to: room_owner.user_tel,
            message: memberData.user_name,
            type: logType.leave,
        });
    }
};

export default leaveRoom;