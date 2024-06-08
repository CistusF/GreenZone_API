import { joinUserInfo, joinUserInfoType, roomEventObject, roomInfoType } from "../../interfaces/roomEvent.interface";
import { logger } from "../../utils/etc";

function isJoinUserInfoTypes(obj: string | joinUserInfoType | roomInfoType): obj is joinUserInfoType {
    if (typeof obj != "object") return false;
    try {
        joinUserInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

const roomJoin: roomEventObject = {
    eventName: "join",
    run: ({ socket, rooms, members }, join_user_info) => {
        if (!join_user_info || !isJoinUserInfoTypes(join_user_info)) return logger("Cannot find Joiner INFO", "ROOM JOINER");
        const room = rooms.find(i => i.room_number === join_user_info.room_number);
        if (!room) {
            logger(socket.id + " / " + join_user_info.user_name + " Cannot join room " + join_user_info.room_number, "ROOM JOINER", -1);
            return socket.emit("room_join_response", {
                status: 500,
                message: "Failed to join room " + join_user_info.room_number
            });
        };

        const roomMembers = members.filter(i => i.room_number === room.room_number);
        if (roomMembers.findIndex(i => i.user_tel === join_user_info.user_tel)) {
            return socket.emit("room_join_response", {
                status: 501,
                content: "user_tel " + join_user_info.user_tel + " is already existed."
            });
        }
        members.push({
            id: socket.id,
            room_number: join_user_info.room_number,
            user_name: join_user_info.user_name,
            user_tel: join_user_info.user_tel,
        });
        socket.join(join_user_info.room_number);

        socket.emit("room_join_response", {
            status: 200,
            content: true,
            title: room.title
        });
        logger(socket.id + " / " + join_user_info.user_name + " joined room name " + room.title + " | " + join_user_info.room_number + " / " + join_user_info.user_tel, "ROOM JOINER", 1);
    }
};

export default roomJoin;