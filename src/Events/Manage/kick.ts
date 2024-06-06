import { manageEventObject } from "../../interfaces/manageEvent.interface";

const kick: manageEventObject = {
    eventName: "kick",
    run: ({socket, members}, user_number) => {
        const member = members.find(i => i.id === socket.id);
        const target = members.find(i => i.user_number === user_number);

        if (!member?.owner) return socket.emit("manage_kick_response", {
            status: 500,
            message: "You are not allowed to kick member in this room."
        });

        if (!target) return socket.emit("manage_kick_response", {
            status: 404,
            message: "Can't find member in this room."
        });

        socket.to(target.id).emit("kick_event", {
            status: 200,
            message: "You are now not a member of this room."
        });

        socket.emit("manage_kick_response", {
            status: 200,
            message: "Member " + target.user_name + " has been kicked."
        });
    }
};

export default kick;