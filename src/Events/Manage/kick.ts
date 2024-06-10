import { logType } from "../../interfaces/common.interface";
import { errorCode } from "../../interfaces/interfaces";
import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { addLog, logger } from "../../utils/etc";

const kick: manageEventObject = {
    run: ({ io, socket, rooms, members }, user_tel) => {
        const target = members.find(i => i.user_tel === user_tel);
        const room = rooms.find(i => i.room_number === target?.room_number);

        if (rooms.findIndex(i => i.ownerId === socket.id) === -1) {
            socket.emit("manage_kick_response", {
                status: errorCode.manage_kick_permission_missing,
                message: "You are not allowed to kick member in this room."
            });
            logger(socket.id + " try to kick member", "MANAGE", 0);
            return;
        };

        if (!target) {
            socket.to(socket.id).emit("event", {
                status: errorCode.manage_kick_member_not_found,
                type: "kick",
                message: "Can't find member in this room."
            });
            logger("Can't find member in this room / user_number : " + user_tel, "MANAGE", -1);
            return;
        };

        const room_owner = members.find(i => i.id === room!.ownerId)!;

        members.splice(members.indexOf(target), 1);
        socket.to(target.id).emit("event", {
            status: 200,
            type: "kick",
            message: "You are now not a member of this room."
        });

        io.to(target.id).socketsLeave(room!.room_number);

        socket.emit("event", {
            status: 201,
            type: "kick",
            user_name: target.user_name,
            user_tel: target.user_tel
        });

        addLog(room!, {
            from: "system",
            to: room_owner.user_tel,
            message: target.user_name,
            type: logType.kick,
        });

        logger(target.id + " kicked from " + target.room_number, "MANAGE", 1);
    }
};

export default kick;