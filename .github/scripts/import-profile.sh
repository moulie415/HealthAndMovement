#!/bin/bash

set -euo pipefail

mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
echo "$PROVISIONING_PROFILE_DATA" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profile.mobileprovision
echo "$PROVISIONING_PROFILE_DATA_DEV" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profileDev.mobileprovision
# echo "$WATCH_APP_PROVISIONING_PROFILE_DATA" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profileWatch.mobileprovision
# echo "$WATCH_APP_EXTENSION_PROVISIONING_PROFILE_DATA" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profileWatchExtension.mobileprovision
