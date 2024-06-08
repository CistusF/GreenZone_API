import { coordEventObject } from "../../interfaces/coordEvent.interface";
import { logger } from "../../utils/etc";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // This feature created by GPT 3.5
    const toRadians = (degree: number) => degree * (Math.PI / 180);

    const R = 6371; // 지구의 반지름 (킬로미터 단위)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // 킬로미터 단위의 거리
    return Number((distance * 1000).toFixed(2));
};

const coordsUpdate: coordEventObject = {
    eventName: "update",
    run: ({ socket, rooms, members }, coords) => {
        const memberData = members.find(i => i.id === socket.id);
        const room = rooms.find(i => i.room_number === memberData?.room_number);
        const roomMembers = members.filter(i => i.room_number == memberData?.room_number);
        const ownerMember = roomMembers?.find(i => i.id == room?.ownerId)!;

        if (!memberData) return socket.emit("error", "Couldn't find member with id " + socket.id);
        if (!room) return socket.emit("error", "Couldn't find room for member : " + socket.id);
        memberData.x = coords.x;
        memberData.y = coords.y;
        logger(`member: ${memberData.user_name} | ${memberData.user_tel} / x: ${memberData.x} / y: ${memberData.y}`, "COORDS UPDATE", 1);

        if (memberData?.id === ownerMember.id) {
            const distance = haversineDistance(room?.boundary.x!, room?.boundary.y!, ownerMember.x!, ownerMember.y!);
            const roomMembersData = roomMembers.filter(i => i.id !== ownerMember.id).map(({ user_name, user_tel, x, y }) => {
                return {
                    user_name,
                    user_tel,
                    x,
                    y,
                    distance: distance
                };
            });
            socket.emit("coords_update_response", {
                status: 200,
                data: roomMembersData
            });

            var distance_status = 0
            if (distance > (room?.boundary.limit! / 2)) {
                distance_status = 2;
            } else if (distance > (room?.boundary.safety! / 2)) {
                distance_status = 1;
            };

            if (distance_status !== 0) {
                socket.emit("event", {
                    status: 200,
                    type: "warning",
                    distance_status
                });
                logger("Member is now out of room's boundary / status: " + distance_status + " / dis: " + distance, "MANAGE", -1);
            };
        } else {
            const distance = haversineDistance(room?.boundary.x!, room?.boundary.y!, ownerMember.x!, ownerMember.y!);
            socket.emit("coords_update_response", {
                status: 200,
                data: [{
                    user_name: memberData.user_name,
                    user_tel: memberData.user_tel,
                    x: memberData.x,
                    y: memberData.y,
                    distance: distance
                }]
            });
        };
    }
};

export default coordsUpdate;