# Budgy for iPhone

A native SwiftUI app (iOS 26 or later, iPhone, Hebrew, right to left, Liquid Glass) with the web app's
screens. Its data lives on the phone and moves to the user's other iPhones through iCloud's key-value
store; there is no sign-in, and it does not use Supabase. The data the web app already holds comes in
once, from the backup file the web app exports. The web and desktop apps are not changed by any of it.

It is built only on a Mac, which this project does not have: `codemagic.yaml` at the root of the
repository builds it on Codemagic's.

## Layout

- `project.yml`: the XcodeGen spec. The Xcode project, `Budgy/Info.plist` and the entitlements are
  generated on the build Mac and not kept in git.
- `Budgy/`: the app. `BudgyApp.swift` holds the tabs (the current report, the history, the portfolio,
  the calendar and settings) and the bar over them that adds a month; `Theme.swift` the glass card and
  the thirteen color themes as colors; `Views/` the screens.
- `Budgy/Core/`: what does not need SwiftUI (the themes' data so far), so it can be type-checked
  without a Mac.
- `Budgy/Assets.xcassets`: the icon (the desktop app's 1024 px icon, `src-tauri/icons/ios/AppIcon-512@2x.png`,
  its rounded white corners filled with its own gradient, since iOS rounds them itself), the accent
  color and the launch background, in light and dark.

## Checking without a Mac

`scripts/check-swift.sh` parses every Swift file and type-checks `Budgy/Core`, in WSL's Ubuntu with
Swift. From PowerShell, at the root of the repository:

```powershell
wsl -d Ubuntu-24.04 -- bash -lc "cd /mnt/c/Users/ari/Documents/GitHub/Finance && tr -d '\r' < ios/scripts/check-swift.sh | bash"
```

## Building

Builds run only when started in Codemagic (Start new build), since its 500 free minutes a month are
shared with Sogia:

- "iPhone · screenshots" builds for the simulator and photographs the screens, light and dark
  (`scripts/screenshots.sh`, launched with `-screenshot <screen>`; kept as the build's artifacts).
- "iPhone · TestFlight" signs the app and uploads it to TestFlight (`scripts/testflight.sh`).

`scripts/testflight.sh` archives without signing (the team has no registered devices, so there is no
development profile), signs the archive for no one with the app's entitlements (an unsigned archive
carries none), then `xcodebuild -exportArchive` signs it for the App Store with the App Store Connect
key and uploads it. The entitlement is iCloud's key-value store, so the App ID `com.ari.budgy` has the
iCloud capability (Certificates, Identifiers & Profiles; no CloudKit container). The build number is
the time of the build. The variable group `app_store` holds `APPLE_API_ISSUER`, `APPLE_API_KEY`
(Key ID), `APPLE_API_KEY_P8` and `APPLE_DEVELOPMENT_TEAM`.

The bundle ID is `com.ari.budgy`, the desktop app's too, and the app record in App Store Connect
uses it.
