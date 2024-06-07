import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const notice: manageEventObject = {
    eventName: "notice",
    run: ({socket, rooms}, message) => {
        const room = rooms.find(i => i.ownerId === socket.id);

        if (!room) {
            socket.emit("event", {
                status: 500,
                type: "notice",
                message: "You are not allowed to send notice in this room."
            });
            logger(socket.id + " try to send notice", "MANAGE", 0);
            return;
        } 

        socket.to(room.room_number).emit("event", {
            status: 200,
            type: "notice",
            message
        });
        logger(["notice is sended", "message : " + message], "MANAGE", 1);
    }
};

export default notice;