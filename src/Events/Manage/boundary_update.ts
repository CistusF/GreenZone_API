import { boundaryInfo, boundaryType } from "../../interfaces/interfaces";
import { manageEventObject } from "../../interfaces/manageEvent.interface";
import { logger } from "../../utils/etc";

function isBoundaryType(obj: string | boundaryType): obj is boundaryType {
    if (typeof obj != "object") return false;
    try {
        boundaryInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

const boundary_update: manageEventObject = {
    run: ({ io, socket, rooms }, boundaryData) => {
        if (!isBoundaryType(boundaryData)) {
            logger(["Wrong boundary data received", JSON.stringify(boundaryData)], "MANAGE", -1);
            socket.emit("event", {
                status: 500,
                type: "boundary",
                message: "Wrong boundary data received"
            });
            return;
        };
        const room = rooms.find(i => i.ownerId === socket.id);

        if (!room) {
            logger("You have not permission to settings the room boundary", "MANAGE", -1);
            socket.emit("event", {
                status: 500,
                type: "boundary",
                message: "You have not permission to settings the room boundary"
            });
            return;
        };

        room.boundary = boundaryData;
        io.to(room.room_number).emit("room_update", {
            status: 200,
            message: "boundary infomation has been updated",
            room
        });
        logger([room.room_number + " Room's boundary has been updated", JSON.stringify(boundaryData)], "MANAGE", 1);
    }
};

export default boundary_update;