import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const announce: manageEventObject = {
    eventName: "announce",
    run: ({socket, members}, message) => {
        const member = members.find(i => i.id === socket.id);

        if (!member?.owner) {
            socket.emit("manage_announce_response", {
                status: 500,
                message: "You are not allowed to send announcement in this room."
            });
            logger(member?.user_name + " try to send announcemnet", "MANAGE", 0);
            return;
        } 

        socket.to(member.room_number).emit("announce_event", {
            message
        });
        logger(["Announcement is sended", "message : " + message], "MANAGE", 1);
    }
};

export default announce;