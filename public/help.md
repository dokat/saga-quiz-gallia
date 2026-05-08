#include <Keyboard.h>

const int buttonPin = 2;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  Keyboard.begin();
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {
    Keyboard.press('1'); // Acts exactly like pressing "1" on a real keyboard
    delay(50);
    Keyboard.releaseAll();
    delay(300); // Debounce delay
  }
}
