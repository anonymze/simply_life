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
eas build --profile preview

// better for testflight
npx testflight

// build and submit (default to production i guess)
eas build -s // npx testflight does the same as eas build -p ios -s

// submit (latest) builds you have on eas expo
eas submit --platform ios --latest

// register devices to test internally (use .ipa (Ad Hoc) for exemple on the device registered)
eas device:create
eas device:list

// create consistent alias url hosted
eas deploy --alias dev
eas deploy --prod

eas whoami

// test server,locally (api routes)
npx expo serve

// export web
npx expo export --platform web

// send env var to expo host
eas env:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.example.com"

// realease build and choose device
npx expo run:ios --configuration Release --device

pnpx expo-doctor

//  match dependencies of expo sdk
pnpx expo install --fix

// expo atlas (bundle sizes)
EXPO_UNSTABLE_ATLAS=true
http://localhost:8081/_expo/atlas

<!-- android switch icon -->
<!-- Default Icon -->

    <activity-alias
    	android:name=".MainActivityDefault"
    	android:enabled="true"
    	android:exported="true"
    	android:icon="@mipmap/ic_launcher"
    	android:targetActivity=".MainActivity"
    >
    	<intent-filter>
    		<action android:name="android.intent.action.MAIN"/>
    		<category android:name="android.intent.category.LAUNCHER"/>
    	</intent-filter>
    </activity-alias>

<!-- Secondary Icon -->

    <activity-alias
    	android:name=".MainActivitySecondary"
    	android:enabled="false"
    	android:exported="true"
    	android:icon="@mipmap/ic_launcher_secondary"
    	android:targetActivity=".MainActivity"
    >
    	<intent-filter>
    		<action android:name="android.intent.action.MAIN"/>
    		<category android:name="android.intent.category.LAUNCHER"/>
    	</intent-filter>
    </activity-alias>

    <!-- ios switch icon -->
  <key>CFBundleIcons</key>
  <dict>
    <key>CFBundlePrimaryIcon</key>
    <dict>
      <key>CFBundleIconFiles</key>
      <array>
        <string>AppIcon</string>
      </array>
			<key>UIPrerenderedIcon</key>
			<false/>
    </dict>
    <key>CFBundleAlternateIcons</key>
    <dict>
      <key>Secondary</key>
      <dict>
        <key>CFBundleIconFiles</key>
        <array>
          <string>Secondary</string>
        </array>
				<key>UIPrerenderedIcon</key>
				<false/>
      </dict>
    </dict>
  </dict>
  <key>CFBundleIcons~ipad</key>
  <dict>
    <key>CFBundlePrimaryIcon</key>
    <dict>
      <key>CFBundleIconFiles</key>
      <array>
        <string>AppIcon</string>
      </array>
      <key>UIPrerenderedIcon</key>
      <false/>
    </dict>
    <key>CFBundleAlternateIcons</key>
    <dict>
      <key>Secondary</key>
      <dict>
        <key>CFBundleIconFiles</key>
        <array>
          <string>Secondary</string>
        </array>
        <key>UIPrerenderedIcon</key>
        <false/>
      </dict>
    </dict>
  </dict>


changement icone + push notifs + depp link + traduction + pdf signature, text to speech
Unit tests
reset expiration token on success

