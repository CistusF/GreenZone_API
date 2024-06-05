import { RoomInfo, roomInfoType, joinUserInfoType, roomEventObject, joinUserInfo } from "../../interfaces";
import { logger } from "../../utils/etc";

function isString(obj: any): obj is string {
    return typeof obj == "string"
};

function isJoinUserInfoTypes(obj: string | joinUserInfoType | roomInfoType): obj is joinUserInfoType {
    if (typeof obj != "object") return false;
    try {
        joinUserInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

function isRoomInfoTypes(obj: string | joinUserInfoType | roomInfoType): obj is roomInfoType {
    if (typeof obj != "object") return false;
    try {
        RoomInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

const roomJoin: roomEventObject = {
    eventName: "join",
    run: ({ socket, rooms, members }, join_user_info) => {
        if (!isJoinUserInfoTypes(join_user_info)) return;
        const room = rooms.find(i => i.room_number === join_user_info.room_number);
        if (!room) {
            logger(socket.id + " / " + join_user_info.user_name + " Cannot join room " + join_user_info.room_number, "ROOM JOINER");
            return socket.emit("error", {
                status: 501,
                content: "Failed to join room " + join_user_info.room_number
            });
        }
        members.push({
            id: socket.id,
            room_number: join_user_info.room_number,
            user_name: join_user_info.user_name,
            user_number: join_user_info.user_tel,
            owner: false
        })
        socket.join(join_user_info.room_number);

        socket.emit("room_join_response", {
            status: 200,
            content: true,
            title: room.title
        });
        logger(socket.id + " / " + join_user_info.user_name + " joined room name " + room.title + " | " + join_user_info.room_number + " / " + join_user_info.user_tel, "ROOM JOINER");
    }
};

export default roomJoin;