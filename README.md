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

// register project on eas expo
eas init

// create configure eas.json
eas build:configure

// link project to the account developer with an identifier
eas credentials

// native build on eas host (preview for internal testing with testFlight for exemple)
eas build  --profile preview

// build and submit (default to production i guess)
eas build -s

// submit (latest) builds you have on eas expo
eas submit --platform ios --latest

// register devices to test internally (use .ipa (Ad Hoc) for exemple on the device registered)
 eas device:create

// create consistent alias url hosted
eas deploy --alias dev

// test server,locally (api routes)
npx expo serve 

// export web
npx expo export --platform web

changement icone + push notifs + depp link + traduction + pdf signature
find referer of app with fetch