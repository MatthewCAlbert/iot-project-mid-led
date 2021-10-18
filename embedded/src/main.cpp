#include <Arduino.h>
#include "ESP8266WiFi.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>

const char *deviceId = "uuidv4";
#include "secret.h"

// MQTT Client
WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long currentTime_ms;

void mqttReconnect()
{
  // Loop until we're reconnected
  while (!mqttClient.connected())
  {
    Serial.print("Attempting MQTT connection...");
    String clientId = "node-";
    clientId += String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("\n[MQTT] Connected");
      String subTopic = "escommand-" + (String)deviceId;

      Serial.printf("[MQTT] Subscribe to command %s\n", mqttClient.subscribe("es/command") ? "SUCCESS" : "FAILED");
    }
    else
    {
      Serial.println("[MQTT] Connect Failed");
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void checkMqttConnection(void *parameter)
{
  for (;;)
  {
    // Serial.println("\n[MQTT] Checking connection");

    if (WiFi.status() == WL_CONNECTED)
      mqttReconnect();
    delay(1000);
  }
}

void sendMqttPublishData()
{
  if (mqttClient.connected())
  {
    Serial.println("\n[MQTT] Publishing data");
    // String pubTopic = "esdata-" + (String)deviceId;
    // String payload = getMqttSendPacketData();
    // Serial.println(payload);

    // if (mqttClient.publish("es/data", payload.c_str()))
    // {
    //   Serial.println("[MQTT] Publishing data OK");
    // }
    // else
    // {
    //   Serial.println("[MQTT] Publish data FAILED");
    // }
  }
}

void reconnect(bool first = false, bool force = false)
{
  //Attempt connect again
  if (WiFi.status() != WL_CONNECTED)
  {
    if (first)
    {
      Serial.print("\nConnecting to Upstream WiFi");
    }
    else
    {
      Serial.print("\nReconnecting to Upstream WiFi");
      WiFi.disconnect();
    }
    WiFi.begin(m_ssid, m_password);
    int dotCounter = 0;
    while (WiFi.status() != WL_CONNECTED)
    {
      delay(500);
      Serial.print(".");
      dotCounter++;
      if (dotCounter > 30)
      {
        WiFi.disconnect();
        return;
      }
    }

    Serial.println("");
    Serial.println("Upstream WiFi connection Successful");
    Serial.print("The IP Address of this Module is: ");
    Serial.print(WiFi.localIP()); // Print the IP address

    if (first)
    {
      mqttClient.setServer(mqtt_server, 1883);
      mqttClient.setCallback(NULL);
      mqttClient.setBufferSize(4096);
    }
  }
}

void setup()
{
  Serial.begin(115200);
}

void loop()
{
  currentTime_ms = millis();

  if (mqttClient.connected())
    mqttClient.loop();
}