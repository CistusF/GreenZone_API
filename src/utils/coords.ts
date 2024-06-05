import { Socket } from "socket.io";
import { coordsType, socketMemberType } from "../interfaces";

// Update coords
export const coordUpdate = (socket: Socket, members: socketMemberType[], coords: coordsType) => {
    const memberData = members.find(i => i.id == socket.id);

    if (!memberData) return socket.emit("error", "Couldn't find member with id " + socket.id);
    memberData.x = coords.x;
    memberData.y = coords.y;
    // return members.filter(m => m.room_number == memberData.room_number);
}