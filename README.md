# SIMPLY LIFE

## Development 

npx expo prebuild --clean 
eas build --profile development --platform android

## Web

npx expo export --platform web --output-dir ./build

## Production

eas build --profile production

## Android emulator

adb shell input keyevent 82
