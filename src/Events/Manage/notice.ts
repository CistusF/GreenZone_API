import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const notice: manageEventObject = {
    eventName: "notice",
    run: ({socket, members}, message) => {
        const member = members.find(i => i.id === socket.id);

        if (!member?.owner) {
            socket.emit("event", {
                status: 500,
                type: "notice",
                message: "You are not allowed to send notice in this room."
            });
            logger(member?.user_name + " try to send notice", "MANAGE", 0);
            return;
        } 

        socket.to(member.room_number).emit("event", {
            status: 200,
            type: "notice",
            message
        });
        logger(["notice is sended", "message : " + message], "MANAGE", 1);
    }
};

export default notice;