# Polling Mechanism Documentation

## Overview

The polling mechanism uses qBittorrent's Sync API (`/api/v2/sync/maindata`) to efficiently update the UI with minimal network requests.

## How It Works

1. **Initial Request**: First request uses `rid=0` to get full data
2. **Subsequent Requests**: Use the `rid` from the last response
3. **Incremental Updates**: Server returns only changes since last request

## API Methods

### `getMainData(rid = 0)`

Fetches main data with sync support.

**Parameters:**
- `rid` (number): Response ID (0 for full update)

**Returns:** Promise<Object> - Main data object

### `startPolling(callback, interval = 1000)`

Starts polling for main data updates.

**Parameters:**
- `callback` (Function): Function to call with new data
- `interval` (number): Polling interval in milliseconds

### `stopPolling()`

Stops the polling mechanism.

## Data Structure

The main data object contains:
- `rid`: Response ID for next request
- `full_update`: Whether this is a full or partial update
- `torrents`: Torrent objects keyed by hash
- `torrents_removed`: Array of removed torrent hashes
- `categories`: Category objects
- `categories_removed`: Array of removed category names
- `tags`: Array of tag names
- `tags_removed`: Array of removed tag names
- `server_state`: Global transfer information

## Example Usage

```javascript
// Start polling
qbittorrentAPI.startPolling((data) => {
  if (data.full_update) {
    // Replace all data
    torrents.value = Object.values(data.torrents)
  } else {
    // Update only changes
    updateTorrents(data.torrents, data.torrents_removed)
  }
}, 1000)

// Stop polling when component unmounts
qbittorrentAPI.stopPolling()
```
