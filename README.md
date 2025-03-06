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

// build and submit (default to production i guess)
eas build -s

// submit (latest) builds you have on eas expo
eas submit --platform ios --latest

// register devices to test internally (use .ipa (Ad Hoc) for exemple on the device registered)
eas device:create

// create consistent alias url hosted
eas deploy --alias dev
eas deploy --prod

// test server,locally (api routes)
npx expo serve

// export web
npx expo export --platform web

// realease build and choose device
npx expo run:ios --configuration Release --device

changement icone + push notifs + depp link + traduction + pdf signature
find referer of app with fetch

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
	<dict>
      <key>CFBundleAlternateIcons</key>   
      <dict>
        <key>Secondary</key>
        <dict>
          <key>CFBundleIconFiles</key>
          <array>
            <string>Secondary</string>
          </array>
          <key>UIPrerenderedIcon</key>
          <true/>
        </dict>
      </dict>
    </dict>