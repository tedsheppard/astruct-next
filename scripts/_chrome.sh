#!/usr/bin/env bash
# Computer-use primitives via real desktop Chrome — no Playwright.
# Driven through osascript (Chrome scripting), screencapture, System Events.

chrome_open_url() {
  osascript -e "tell application \"Google Chrome\" to set URL of active tab of window 1 to \"$1\"" >/dev/null 2>&1
}

chrome_active_url() {
  osascript -e 'tell application "Google Chrome" to URL of active tab of window 1' 2>/dev/null
}

chrome_eval() {
  # Read JS from stdin, escape for AppleScript, return result.
  local js
  js=$(cat)
  osascript <<APPLESCRIPT 2>/dev/null
on escapeJS(s)
  set out to ""
  repeat with c in characters of s
    set ch to contents of c
    if ch is "\"" then
      set out to out & "\\\""
    else if ch is "\\" then
      set out to out & "\\\\"
    else if (ASCII number of ch) is 10 then
      set out to out & "\\n"
    else
      set out to out & ch
    end if
  end repeat
  return out
end escapeJS

set jsRaw to "$(cat <<EOF
$js
EOF
)"
set jsEsc to my escapeJS(jsRaw)
tell application "Google Chrome"
  set theTab to active tab of window 1
  set theResult to (execute theTab javascript jsEsc)
  return theResult as string
end tell
APPLESCRIPT
}

chrome_window_id() {
  osascript -e 'id of window 1 of application "Google Chrome"' 2>/dev/null
}

chrome_screenshot() {
  local out=$1
  local wid
  wid=$(chrome_window_id)
  if [ -n "$wid" ]; then
    screencapture -x -l"$wid" "$out" 2>/dev/null
  else
    screencapture -x "$out" 2>/dev/null
  fi
}

chrome_focus() {
  osascript -e 'tell application "Google Chrome" to activate' >/dev/null 2>&1
  sleep 0.3
}

chrome_wait_text() {
  local needle=$1
  local timeout=${2:-30}
  local start
  start=$(date +%s)
  while [ $(($(date +%s) - start)) -lt $timeout ]; do
    local has
    has=$(printf 'document.body.innerText.includes("%s")' "$needle" | chrome_eval | tr -d '\n')
    if [ "$has" = "true" ]; then return 0; fi
    sleep 0.5
  done
  return 1
}

chrome_keystroke() {
  chrome_focus
  osascript -e "tell application \"System Events\" to keystroke \"$1\"" >/dev/null 2>&1
}

chrome_press_enter() {
  chrome_focus
  osascript -e 'tell application "System Events" to key code 36' >/dev/null 2>&1
}
