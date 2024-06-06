import { manageEventObject } from "../../interfaces/manageEvent.interface";

const announce: manageEventObject = {
    eventName: "announce",
    run: ({socket, members}, message) => {
        const member = members.find(i => i.id === socket.id);

        if (!member?.owner) return socket.emit("manage_announce_response", {
            status: 500,
            message: "You are not allowed to send announcement in this room."
        });

        socket.to(member.room_number).emit("announce_event", {
            message
        });
    }
};

export default announce;