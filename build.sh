#!/bin/bash

#export ANDROID_HOME=/Users/oberdan/Library/Android/sdk/
#export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

PACKAGE_VERSION=$(node -p -e "require('./app.json').version")
	=$(node -p -e "require('./app.json').name")

if [ "$PACKAGE_VERSION" =  'undefined' ]; then
    echo "Informe o número da versão"; exit 1;
fi

if [ "$PACKAGE_NAME" =  'undefined' ]; then
    echo "Informe o nome do app"; exit 2;
fi

cd android && ./gradlew assembleRelease

export APP_NAME="$PACKAGE_NAME-$PACKAGE_VERSION";

find . -type f -name '*.ipa' -exec bash -c 'x="{}"; mv "$x" "$APP_NAME.ipa";' \;
find . -type f -name '*.apk' -exec bash -c 'x="{}"; mv "$x" "$APP_NAME.apk";' \;


ls $APP_NAME.*;

cd ios

#xcodebuild -scheme medicoconsultor archive -archivePath ./medicoconsultor.xcarchive

#xcodebuild -exportArchive -archivePath medicoconsultor.xcarchive -exportPath medicoconsultor.ipa -exportOptionsPlist medicoconsultor/Info.plist -exportProvisioningProfile "Medico_Consultor_RDSL"

#xcodebuild -exportArchive -allowProvisioningUpdates -archivePath medicoconsultor.xcarchive -exportPath Release -exportOptionsPlist medicoconsultor/Info.plist

#xcodebuild -exportArchive -archivePath build/MedicoConsultor.xcarchive -exportPath medicoconsultor.ipa  -exportOptionsPlist medicoconsultor/Info.plist

#xcodebuild -project medicoconsultor.xcodeproj -scheme medicoconsultor -configuration Release -allowProvisioningUpdates build

#xcodebuild -project medicoconsultor.xcodeproj -scheme medicoconsultor -configuration Release -allowProvisioningUpdates -archivePath Archive ./medicoconsultor.xcarchive

#xcodebuild -project ./ci-ios.xcodeproj -scheme ci-ios -configuration Release -allowProvisioningUpdates -archivePath Archive ci-ios-app.xcarchive

#xcodebuild -project ./medicoconsultor.xcodeproj -scheme medicoconsultor -configuration Release -archivePath Archive build/Archive/medicoconsultor.xcarchive
