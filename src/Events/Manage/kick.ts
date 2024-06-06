import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const kick: manageEventObject = {
    eventName: "kick",
    run: ({ socket, members }, user_number) => {
        const member = members.find(i => i.id === socket.id);
        const target = members.find(i => i.user_number === user_number);

        if (!member?.owner) {
            socket.emit("manage_kick_response", {
                status: 500,
                message: "You are not allowed to kick member in this room."
            });
            logger(member?.user_name + " try to kick member", "MANAGE", 0);
            return;
        };

        if (!target) {
            socket.emit("manage_kick_response", {
                status: 404,
                message: "Can't find member in this room."
            });
            logger("Can't find member in this room / user_number : " + user_number, "MANAGE", -1);
            return;
        };

        socket.to(target.id).emit("kick_event", {
            status: 200,
            message: "You are now not a member of this room.",
            room_number: target.room_number
        });

        socket.emit("manage_kick_response", {
            status: 200,
            message: "Member " + target.user_name + " has been kicked."
        });

        logger(target.id + " kicked from " + member.room_number, "MANAGE", 1);
    }
};

export default kick;