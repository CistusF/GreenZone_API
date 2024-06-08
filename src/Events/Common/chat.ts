import { chatInfo, chatType, commonEventObject, logType } from "../../interfaces/common.interface";
import { errorCode } from "../../interfaces/interfaces";
import { logger } from "../../utils/etc";

function isChatType(obj: chatType): obj is chatType {
    if (typeof obj != "object") return false;
    try {
        chatInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

const notice: commonEventObject = {
    run: ({ io, socket, members, rooms }, chat) => {
        if (!isChatType(chat)) return;

        const memberData = members.find(i => i.id === socket.id)!;
        const room = rooms.find(i => i.room_number === memberData.room_number);
        if (!chat.to) {
            if (rooms.findIndex(i => i.ownerId === socket.id) === -1) {
                socket.emit("common_chat_response", {
                    status: errorCode.common_chat_permission_missing,
                    message: "You are not allowed to send notice in this room."
                });
            } else {
                io.to(memberData.room_number).emit("chat_event", {
                    status: 200,
                    from: memberData.user_tel,
                    to: "all",
                    message: chat.message
                });
                room?.logs.push({
                    from: memberData.user_tel,
                    to: 'all',
                    message: chat.message,
                    type: logType.notice
                });
                logger(["notice is sended", "message : " + chat.message], "CHAT", 1);
            };
        } else {
            const targetMemberData = members.find(i => i.user_tel === chat.to);
            if (!targetMemberData) {
                socket.emit("common_chat_response", {
                    status: errorCode.common_chat_member_not_found,
                    message: "Cannot find member " + chat.to
                });
                return;
            };
            const { to, from } = {
                to: chat.to,
                from: memberData.user_tel
            }
            socket.to(targetMemberData.id).emit("chat_event", {
                status: 200,
                message: chat.message,
                to,
                from
            });

            room?.logs.push({
                from,
                to,
                message: chat.message,
                type: logType.chat
            });

            logger([from + " sended " + chat.message + " to " + to], "CHAT", 1);
        };
    }
};

export default notice;