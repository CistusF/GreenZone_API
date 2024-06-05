import { coordEventObject } from "../../interfaces";
import { logger } from "../../utils/etc";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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
    run: ({ socket, members }, coords) => {
        const memberData = members.find(i => i.id == socket.id);
        const roomMembers = members.filter(i => i.room_number == memberData?.room_number);
        const ownerMember = roomMembers?.find(i => i.owner == true)!;

        if (!memberData) return socket.emit("error", "Couldn't find member with id " + socket.id);
        memberData.x = coords.x;
        memberData.y = coords.y;
        logger(`member: ${memberData.user_name} | ${memberData.id} / x: ${memberData.x} / y: ${memberData.y}`, "COORDS UPDATE");

        if (memberData?.owner) {
            const roomMembersData = roomMembers.filter(i => !i.owner).map(({ user_name, user_number, x, y }) => {
                return {
                    user_name,
                    user_number,
                    x,
                    y,
                    distance: haversineDistance(x!, y!, ownerMember.x!, ownerMember.y!)
                };
            });
            socket.emit("coords_update_response", {
                status: 200,
                data: roomMembersData
            });
        } else {
            socket.emit("coords_update_response", {
                status: 200,
                data: [{
                    user_name: memberData.user_name,
                    user_number: memberData.user_number,
                    x: memberData.x,
                    y: memberData.y,
                    distance: haversineDistance(memberData.x!, memberData.y!, ownerMember.x!, ownerMember.y!)
                }]
            });
        };
    }
};

export default coordsUpdate;