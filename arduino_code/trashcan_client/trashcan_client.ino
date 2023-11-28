#include <SPI.h>
#include <RH_NRF24.h>
#include <NewPing.h>

#define CE 4
#define CSN 5
// Singleton instance of the radio driver
RH_NRF24 nrf24(CE,CSN);

// Change these to match the pins you've connected the sensor to
const int TRIGGER_PIN = 15;  // GPIO pin used for triggering the ping
const int ECHO_PIN = 13;      // GPIO pin used for receiving the echo
const int MAX_DISTANCE = 48; // Maximum distance we want to ping for (in inches)

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance

void setup() 
{
  Serial.begin(9600);
  while (!Serial) 
    ; // wait for serial port to connect. Needed for Leonardo only
  if (!nrf24.init())
    Serial.println("init failed");
  // Defaults after init are 2.402 GHz (channel 2), 2Mbps, 0dBm
  if (!nrf24.setChannel(1))
    Serial.println("setChannel failed");
  if (!nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
    Serial.println("setRF failed");    
}


void loop()
{
  Serial.println("Sending to nrf24_server");

  // Getting URM reading
  int distance = sonar.ping(); // Send ping, get ping time in inches
  Serial.print("Distance: ");
  Serial.println(distance);

  // Send a message to nrf24_server
  uint8_t data[] = {distance & 0xFF, distance >> 8};
  nrf24.send(data, sizeof(data));
  
  nrf24.waitPacketSent();
  // Now wait for a reply
  uint8_t buf[RH_NRF24_MAX_MESSAGE_LEN];
  uint8_t len = sizeof(buf);

  nrf24.waitPacketSent();
  delay(400);
}