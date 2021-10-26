#include <Arduino.h>
#include "ESP8266WiFi.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncElegantOTA.h>
#include <elapsedMillis.h>

/**
 *  OTA: IP/upload
 * 
 * MQTT REQUEST on "es/command" topic:
 * {
      "state":"ON", <ON | OFF>
      "color":{ 
        "r":50, <intensity in %>
        "g":20,
        "b":70
      }
    }
 * 
 * 
 **/

const char *deviceId = "uuidv4";
#include "secret.h"

const uint8_t led[3]={D8, D5, D7};
const uint8_t common = D6;
const int BUFFER_SIZE = JSON_OBJECT_SIZE(20);

// MQTT Client
WiFiClient espClient;
PubSubClient mqttClient(espClient);
AsyncWebServer server(80);

bool state=false;
byte r=0,g=0,b=0;

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


void runOTA(){
  AsyncElegantOTA.begin(&server);
  server.begin();
}

bool processJson(char* message) {
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;

  JsonObject& root = jsonBuffer.parseObject(message);

  if (!root.success()) {
    Serial.println("parseObject() failed");
    return false;
  }

  if (root.containsKey("state")) {
    if (strcmp(root["state"], "ON") == 0) {
      state = true;
    }
    else if (strcmp(root["state"], "OFF") == 0) {
      state = false;
    }
  }

  if (root.containsKey("color")) {
    r= root["color"]["r"];
    g= root["color"]["g"];
    b= root["color"]["b"];
  }else{
    r = g=b=100;
  }

  return true;
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  char data [length+1];
  for (int i=0;i<length;i++) {
    data[i] = (char)payload[i];
  }
  data[length]='\0';
  Serial.println(data);
  Serial.println();

  if (!processJson(data)) {
    return;
  }

  if(state){
    analogWrite(led[0], map(r,0,100,255,0));
    analogWrite(led[1], map(g,0,100,255,0));
    analogWrite(led[2], map(b,0,100,255,0));
  }else{
    analogWrite(led[0], 255);
    analogWrite(led[1], 255);
    analogWrite(led[2], 255);
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
      mqttClient.setCallback(callback);
      mqttClient.setBufferSize(4096);
    }
  }
}



void setup()
{
  Serial.begin(9600);
  reconnect(true);
  mqttReconnect();
  runOTA();
  analogWriteRange(255);
  pinMode(common, OUTPUT);
  digitalWrite(common,HIGH);
  for(int i=0;i<3;i++){
    pinMode(led[i], OUTPUT);
    digitalWrite(led[i],HIGH);
  }
}



void loop()
{
  currentTime_ms = millis();

  if (mqttClient.connected())
    mqttClient.loop();

  AsyncElegantOTA.loop();
}