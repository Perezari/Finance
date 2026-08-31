; NSIS install hooks for Budgy.
;
; Installing over a running copy fails with "Error opening file for writing"
; on budgy.exe and its WebView2 processes. Close them first — this covers
; both an update and a user running the setup with the app still open.
!macro NSIS_HOOK_PREINSTALL
  nsExec::Exec 'taskkill /F /IM "budgy.exe"'
  Sleep 800
!macroend
