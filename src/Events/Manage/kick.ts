import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const kick: manageEventObject = {
    eventName: "kick",
    run: ({ socket, rooms, members }, user_number) => {
        const target = members.find(i => i.user_number === user_number);

        if (rooms.findIndex(i => i.ownerId === socket.id) === -1) {
            socket.emit("manage_kick_response", {
                status: 500,
                message: "You are not allowed to kick member in this room."
            });
            logger(socket.id + " try to kick member", "MANAGE", 0);
            return;
        };

        if (!target) {
            socket.to(socket.id).emit("event", {
                status: 404,
                type: "kick",
                message: "Can't find member in this room."
            });
            logger("Can't find member in this room / user_number : " + user_number, "MANAGE", -1);
            return;
        };

        members.splice(members.indexOf(target), 1);
        socket.to(target.id).emit("event", {
            status: 200,
            type: "kick",
            message: "You are now not a member of this room."
        });

        socket.emit("event", {
            status: 200,
            type: "kick",
            message: "Member " + target.user_name + " has been kicked."
        });

        logger(target.id + " kicked from " + target.room_number, "MANAGE", 1);
    }
};

export default kick;