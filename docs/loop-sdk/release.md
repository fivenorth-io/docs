# Loop SDK – Release Notes

## v0.3.0
- Added popup-based wallet connect flow.
- Popup now auto-closes after user approves.
- Added support for `openMode` option (`popup` or `tab`).

## v0.2.1
- Fixed stale `loop_connect` session cache issue.
- Automatically clears invalid or expired ticket data.

## v0.2.0
- Added `email` field in `handshake_accept` payload.
- Exposed `provider.email` to dApps.