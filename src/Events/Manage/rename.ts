import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

const rename: manageEventObject = {
    eventName: "rename",
    run: ({socket, rooms, members}, title) => {
        const member = members.find(i => i.id === socket.id);

        if (!member?.owner) return socket.emit("manage_rename_response", {
            status: 500,
            message: "You are not allowed to rename this room."
        });

        const room = rooms.find(i => i.room_number === member.room_number)!;
        const oldTitle = room.title;
        room.title = title;

        logger("Room renamed / " + oldTitle + " to " + room.title, "MANAGE", 1);
        socket.to(room.room_number).emit("rename_title_event", {
            title: title
        });
    }
};

export default rename;