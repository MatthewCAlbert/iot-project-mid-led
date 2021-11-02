import dayjs from "dayjs";
import { scheduledJobs, scheduleJob } from "node-schedule";
import { Raw } from "typeorm";
import { Schedule } from "../data/entities/schedule.entity";
import MqttHandler from "./mqtt";

export const cancelScheduledCommand = (schedule: Schedule | string)=>{
  try {
    if( typeof schedule === 'string' ){
      scheduledJobs?.[schedule].cancel();
      console.log(`[CANCELLED] Scheduled Job id: ${schedule}`)
    }else{
      scheduledJobs?.[schedule.id].cancel();
      console.log(`[CANCELLED] Scheduled Job id: ${schedule.id}`);
    }
  } catch (error) {
    throw error;
  }
}

export const scheduleCommand = (mqttHandler: MqttHandler, schedule: Schedule)=>{
  if( dayjs(schedule.when).isAfter(dayjs()) ){
    const job = scheduleJob( schedule.id, new Date(schedule.when), ()=> {
      const command = JSON.parse(schedule.command);
      mqttHandler?.sendCommand(command);
      console.log("Command sent");
    } );
    console.log('Scheduled Command added for', dayjs(schedule.when).format('YYYY-MM-DD HH:mm:ss'));
    return true;
  }
  return false;
}

export const scheduleOnStartup = async (mqttHandler: MqttHandler) => {
  try {

    const schedules = await Schedule.find({ when: Raw((alias) => `${alias} >= '${dayjs().format('YYYY-MM-DD')}'`) 
  });
    if( schedules.length < 1 ) return console.log("Nothing in schedule");

    let count = 0;

    schedules.forEach((s)=>{
      // console.log(s.when)
      if( scheduleCommand(mqttHandler, s) ){
        count++;
      }
    });

    console.log("Scheduling Done", count, 'out of', schedules.length);

  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}