import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const rename: manageEventObject = {
    eventName: "rename",
    run: ({ socket, rooms }, title) => {
        const room = rooms.find(i => i.ownerId === socket.id);

        if (!room) return socket.emit("event", {
            status: 500,
            type: "rename",
            message: "You are not allowed to rename this room."
        });

        const oldTitle = room.title;
        room.title = title;

        logger("Room renamed / " + oldTitle + " to " + room.title, "MANAGE", 1);
        socket.to(room.room_number).emit("event", {
            status: 200,
            type: "rename",
            message: title
        });
    }
};

export default rename;