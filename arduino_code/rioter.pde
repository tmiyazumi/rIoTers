#include <SPI.h>
#include <RH_NRF24.h>
#include <LiquidCrystal_I2C.h>
#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

#define WIFI_SSID "ufdevice"
#define WIFI_PASSWORD "gogators"
#define API_KEY ""
#define DATABASE_URL "https://rioters-b0f93-default-rtdb.firebaseio.com/" 
#define CE 4
#define CSN 5
#define redLedPin 26
#define greenLedPin 33
#define blueLedPin 13
#define button 32

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;
String stringValue = "";
String nextName = "";
int currIndex = 0;
int maxIndex = 0;
FirebaseJsonArray roomNames;

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

int lastButtonState = LOW;
int buttonState;

// Singleton instance of the radio driver
// RH_NRF24 nrf24;
RH_NRF24 nrf24(CE,CSN);
// RH_NRF24 nrf24(8, 7); // use this to be electrically compatible with Mirf
// RH_NRF24 nrf24(8, 10);// For Leonardo, need explicit SS pin
// RH_NRF24 nrf24(8, 7); // For RFM73 on Anarduino Mini

LiquidCrystal_I2C lcd(0x3F, 16, 2);

void setup() 
{
  Serial.begin(9600);
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(blueLedPin, OUTPUT);
  pinMode(button, INPUT);

  lcd.init();
  lcd.backlight();
  while (!Serial) 
    ; // wait for serial port to connect. Needed for Leonardo only
  if (!nrf24.init())
    Serial.println("init failed");
  // Defaults after init are 2.402 GHz (channel 2), 2Mbps, 0dBm
  if (!nrf24.setChannel(1))
    Serial.println("setChannel failed");
  if (!nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
    Serial.println("setRF failed");  
  

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi...");
  }

  config.api_key = API_KEY;

    /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;


  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.println("HELP MEEE");
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);


}

void clearTopRow() {
  lcd.setCursor(0, 0); // Set cursor to the beginning of the first row
  for(int i = 0; i < 16; i++) {
    lcd.print(" "); // Print spaces to clear the row
  }
  lcd.setCursor(0, 0); // Optional: Return to the beginning of the first row
}


void clearBottomRow() {
  lcd.setCursor(0, 1); // Set cursor to the beginning of the first row
  for(int i = 0; i < 16; i++) {
    lcd.print(" "); // Print spaces to clear the row
  }
  lcd.setCursor(0, 1); // Optional: Return to the beginning of the first row
}

void incrementIndex() {
    unsigned long currentMillis = millis();
    Serial.println("Called increment");
    if ((currentMillis - lastDebounceTime) > debounceDelay) {
        // Update the index
        currIndex++;
        // Update the last debounce time
        lastDebounceTime = currentMillis;
    }
    if (currIndex >= maxIndex){
      currIndex = 0;
    }

   if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)) {
    if (Firebase.RTDB.setInt(&fbdo, "Rioters/index", currIndex)) {
        Serial.println("Update successful");
        Serial.println("PATH: " + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    } else {
        Serial.println("Update failed");
        Serial.println("REASON: " + fbdo.errorReason());
        Serial.println("CURR INDEX: " + String(currIndex));
        Serial.println("PATH: Rioters/index");
        Serial.println("TYPE: int");
    }
}




}

void loop()
{

  delay(500);

   if (!Firebase.ready()) {
        Serial.println("Firebase not ready, attempting to reconnect...");
        Firebase.reconnectWiFi(true);
        delay(1000);  // You may adjust the delay based on your requirements
  } else {
    
 if (Firebase.RTDB.getArray(&fbdo, "/Rioters/queue")) {
    if (fbdo.dataType() == "array") {
      roomNames = fbdo.jsonArray();
     
      Serial.println("Room Names:");
      for (int i = 0; i < roomNames.size(); i++) {
        Serial.print(i);
      }
      Serial.println("INSIDDEEEE");
      maxIndex = roomNames.size();
    } else {
      Serial.println("Received data is not an array.");
    }
  } else {
    Serial.println("Failed to retrieve the array from Firebase.");
    Serial.println("Error Reason: " + fbdo.errorReason());
  }

    if (Firebase.RTDB.getString(&fbdo, "/Rioters/index")) {
      if (fbdo.dataType() == "int") {
        currIndex = fbdo.intData();
        Serial.println(currIndex);
        delay(300);
      } else {
        Serial.println("Received data is not a string.");
      }
    } else {
      Serial.println("Failed to retrieve the string from Firebase.");
      Serial.println("Error Reason: " + fbdo.errorReason());
    }

  String namePath = "/Rioters/queue/" + String(currIndex);
  Serial.println(namePath);


   if (Firebase.RTDB.getString(&fbdo, namePath)) {
    if (fbdo.dataType() == "string") {
      String tempName = nextName;
      nextName = fbdo.stringData();
      if (nextName != tempName){
        clearTopRow();
      }
      Serial.println(nextName);
      lcd.setCursor(0,0);
      lcd.print(nextName);
      delay(300);
    } else {
      Serial.println("Received data is not a string.");
    }
  } else {
    Serial.println("Failed to retrieve the string from Firebase.");
    Serial.println("Error Reason: " + fbdo.errorReason());
  }
  

  // if (Firebase.RTDB.getString(&fbdo, "/person")) {
  //   if (fbdo.dataType() == "string") {
  //     stringValue = fbdo.stringData();
  //     Serial.println(stringValue);
  //     lcd.setCursor(0,0);
  //     lcd.print(stringValue);
  //     delay(3000);
  //   } else {
  //     Serial.println("Received data is not a string.");
  //   }
  // } else {
  //   Serial.println("Failed to retrieve the string from Firebase.");
  //   Serial.println("Error Reason: " + fbdo.errorReason());
  // }

 int reading = digitalRead(button);
 Serial.println("Button:");
 Serial.println(reading);
 Serial.println(lastButtonState);


  if(reading != lastButtonState){
    lastDebounceTime = millis();
  }



  if ((millis() - lastDebounceTime) > debounceDelay) {
        // whatever the reading is at, it's been there for longer than the debounce
        // delay, so take it as the actual current state:

        // if the button state has changed:
        if (reading != buttonState) {
            buttonState = reading;

            // only increment the index if the new button state is LOW
            if (buttonState == HIGH) {
                incrementIndex();
            }
        }
    }
    lastButtonState = reading;
  
  if (nrf24.available())
  {
    // Should be a message for us now   
    uint8_t buf[RH_NRF24_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
    
    if (nrf24.recv(buf, &len))
    {
//      NRF24::printBuffer("request: ", buf, len);
      int receivedNum = 0;
      // Assuming integer was sent in little-endian
      memcpy(&receivedNum, buf, sizeof(receivedNum));
      Serial.print("Received: ");
      Serial.println(receivedNum);
      Serial.print("got request: ");
      Serial.println((char*)buf);

      if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
        if (Firebase.RTDB.setInt(&fbdo, "test/int", receivedNum)) {
          Serial.println("PASSED");
          Serial.println("PATH: " + fbdo.dataPath());
          Serial.println("TYPE: " + fbdo.dataType());
        }
        else {
          Serial.println("FAILED");
          Serial.println("REASON: " + fbdo.errorReason());
        }
      }
      double fillStatus = 0;
      fillStatus = (100.00)*((1330.00 - (double)receivedNum)/1330.00);
      if (fillStatus < 0){
        fillStatus = 0;
      }
      Serial.println("PERCENTAGE RN: ");
      Serial.println(fillStatus);
      clearBottomRow();
      lcd.print(fillStatus);

      if (fillStatus <= 40){
          digitalWrite(redLedPin, LOW);
          digitalWrite(blueLedPin, LOW);
          digitalWrite(greenLedPin, HIGH);
      }
      else if (fillStatus >= 41 && fillStatus <= 84) {
          digitalWrite(redLedPin, LOW);
          digitalWrite(blueLedPin, HIGH);
          digitalWrite(greenLedPin, LOW);
      }
      else{
          digitalWrite(redLedPin, HIGH);
          digitalWrite(blueLedPin, LOW);
          digitalWrite(greenLedPin, LOW);
      }
    }
    else
    {
      Serial.println("recv failed");
    }
    delay(500);
  }
  }
}
