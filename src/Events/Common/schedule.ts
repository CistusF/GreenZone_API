import { chatType, commonEventObject, logType, scheduleInfo, scheduleStatus, scheduleType } from "../../interfaces/common.interface";
import { errorCode } from "../../interfaces/interfaces";
import { addLog, logger } from "../../utils/etc";
import schedule from 'node-schedule';

function isScheduleType(obj: chatType | scheduleType | null): obj is scheduleType {
    if (typeof obj != "object") return false;
    try {
        scheduleInfo.parse(obj);
        return true;
    } catch {
        return false;
    };
};

const notice: commonEventObject = {
    run: ({ io, socket, members, rooms }, scheduleData) => {
        const room = rooms.find(i => i.ownerId === socket.id);
        const member = members.find(i => i.id === socket.id);
        if (!room) {
            socket.emit("error", {
                type: "schedule",
                message: "You must owner of specified room",
                status: errorCode.common_schedule_member_room_not_found
            });
            logger(["Member tried set schedule"], "SCHEDULE", -1);
            return;
        };

        if (!scheduleData || !isScheduleType(scheduleData)) {
            socket.emit("error", {
                type: "schedule",
                message: "Wrong schedule data",
                status: errorCode.common_schedule_wrong_data
            });
            logger(["Wrong schedule data", JSON.stringify(scheduleData) ?? "Data is not found"], "SCHEDULE", -1);
            return;
        };

        var { title, schedules } = scheduleData;

        schedules.reverse().forEach((i, index) => {
            let { schedule_type } = scheduleData;
            const { hour, minute } = i;
            if (index === schedules.length - 1) {
                if (schedule_type === 0) return;
                else schedule_type = 0;
            };

            schedule.scheduleJob({
                hour,
                minute
            }, () => {
                io.to(room.room_number).emit("event", {
                    type: "schedule",
                    title,
                    schedule_type,
                    status: 200
                });
                addLog(room, {
                    from: member!.user_tel,
                    to: 'all',
                    message: schedule_type,
                    type: logType.schedule,
                    title
                });
                logger(schedule_type + " Event is sended / " + title, "SCHEDULE", 0);
            });
        });

        socket.emit("common_schedule_response", {
            status: 200
        });
        logger(["Schedule is created successfully!", JSON.stringify(scheduleData)], "SCHEDULE", 1);
    }
};

export default notice;