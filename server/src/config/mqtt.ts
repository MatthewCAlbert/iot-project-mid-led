import mqtt from "mqtt";
import config from "./config";

class MqttHandler {
  mqttClient: mqtt.MqttClient;
  username: string;
  password: string;
  host: string;

  constructor() {
    this.mqttClient = null;
    this.host = "mqtt://" + config.mqtt.host;
    this.username = config.mqtt.username;
    this.password = config.mqtt.password;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe("es/data", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function (topic, message) {
      if (topic === "es/data") {
        let data = JSON.parse(message.toString());
        if (data) {
          // Add to db
        }
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  sendCommand(command: string) {
    return this.mqttClient.publish(
      "es/command",
      JSON.stringify({
        command: command,
      })
    );
  }
}

export default MqttHandler;