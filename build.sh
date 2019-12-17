#!/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./app.json').version")
PACKAGE_NAME=$(node -p -e "require('./app.json').name")

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