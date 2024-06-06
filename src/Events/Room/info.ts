import { roomEventObject } from "../../interfaces/roomEvent.interface";
import { logger } from "../../utils/etc";

const roomInfo: roomEventObject = {
    eventName: "info",
    run: ({ socket, rooms, members }, room_number) => {
        const room = rooms.find(i => i.room_number === room_number);

        logger(socket.id + " requested room info about " + room_number, "ROOM INFO");
        socket.emit("room_info_response", {
            status: 200,
            roomMembers: members.filter(i => i.room_number == room_number),
            title: room?.title,
            owner_tel: members.find(i => i.room_number == room_number && i.owner == true)?.user_number
        });
    }
};

export default roomInfo;