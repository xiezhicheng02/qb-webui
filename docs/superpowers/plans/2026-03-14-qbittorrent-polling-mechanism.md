# qBittorrent Main Data Polling Mechanism Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a polling mechanism using the `Get main data` API endpoint to efficiently update the UI with minimal network requests.

**Architecture:**
- Use the `/api/v2/sync/maindata` endpoint with a `rid` (response ID) parameter to track changes
- First request uses `rid=0` to get full data, subsequent requests use the last received `rid`
- Handle `full_update` flag to determine if we need to replace all data or just update changes
- Implement incremental updates for torrents, categories, and tags

**Tech Stack:** Vue 3, Composition API, qBittorrent WebUI API v5.0

---

## Chunk 1: API Layer Implementation

### Task 1.1: Add getMainData method to API client

**Files:**
- Modify: `src/api/qbittorrent.js`
- Test: `tests/api/qbittorrent.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/api/qbittorrent.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QBittorrentAPI from '../../src/api/qbittorrent'

describe('QBittorrentAPI - getMainData', () => {
  let api

  beforeEach(() => {
    api = new QBittorrentAPI()
    api.sid = 'test-sid'
    global.fetch = vi.fn()
  })

  it('should call maindata endpoint with rid parameter', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ rid: 1, full_update: true, torrents: {} })
    })

    await api.getMainData(5)

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v2/sync/maindata?rid=5',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      })
    )
  })

  it('should return parsed main data', async () => {
    const mockData = {
      rid: 10,
      full_update: false,
      torrents: { abc123: { name: 'Test Torrent', state: 'downloading' } },
      torrents_removed: [],
      categories: {},
      categories_removed: [],
      tags: [],
      tags_removed: [],
      server_state: { dl_info_speed: 1000 }
    }

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData
    })

    const result = await api.getMainData(0)

    expect(result).toEqual(mockData)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: FAIL with "getMainData is not a function"

- [ ] **Step 3: Write minimal implementation**

```javascript
// src/api/qbittorrent.js - Add to QBittorrentAPI class

/**
 * Get main data with sync support
 * @param {number} rid - Response ID (0 for full update)
 * @returns {Promise<Object>} Main data object
 */
async getMainData(rid = 0) {
  const response = await this._request(`/api/v2/sync/maindata?rid=${rid}`, {
    method: 'GET'
  })

  if (!this._checkResponse(response)) {
    return null
  }

  return await response.json()
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/api/qbittorrent.js tests/api/qbittorrent.test.js
git commit -m "feat: add getMainData API method with sync support"
```

### Task 1.2: Add polling mechanism to API client

**Files:**
- Modify: `src/api/qbittorrent.js`
- Test: `tests/api/qbittorrent.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/api/qbittorrent.test.js - Add to existing describe block

it('should start and stop polling', async () => {
  const mockData = { rid: 1, full_update: true, torrents: {} }
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => mockData
  })

  const callback = vi.fn()
  api.startPolling(callback, 1000)

  // Wait for first poll
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(callback).toHaveBeenCalledWith(mockData)

  api.stopPolling()
  const callCountBeforeStop = callback.mock.calls.length

  // Wait for potential additional polls
  await new Promise(resolve => setTimeout(resolve, 1100))
  expect(callback.mock.calls.length).toBe(callCountBeforeStop)
})

it('should update rid after each poll', async () => {
  const mockData1 = { rid: 1, full_update: true, torrents: {} }
  const mockData2 = { rid: 2, full_update: false, torrents: {} }

  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData1
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData2
    })

  const callback = vi.fn()
  api.startPolling(callback, 100)

  await new Promise(resolve => setTimeout(resolve, 150))

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/v2/sync/maindata?rid=0',
    expect.any(Object)
  )
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/v2/sync/maindata?rid=1',
    expect.any(Object)
  )

  api.stopPolling()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: FAIL with "startPolling is not a function"

- [ ] **Step 3: Write minimal implementation**

```javascript
// src/api/qbittorrent.js - Add to QBittorrentAPI class

constructor() {
  // ... existing code ...
  this.pollingInterval = null
  this.currentRid = 0
  this.pollingCallback = null
}

/**
 * Start polling for main data updates
 * @param {Function} callback - Function to call with new data
 * @param {number} interval - Polling interval in milliseconds (default: 1000)
 */
startPolling(callback, interval = 1000) {
  this.pollingCallback = callback
  this.currentRid = 0

  // Initial poll
  this._poll()

  // Set up interval
  this.pollingInterval = setInterval(() => {
    this._poll()
  }, interval)
}

/**
 * Stop polling
 */
stopPolling() {
  if (this.pollingInterval) {
    clearInterval(this.pollingInterval)
    this.pollingInterval = null
  }
  this.pollingCallback = null
}

/**
 * Internal poll method
 */
async _poll() {
  try {
    const data = await this.getMainData(this.currentRid)
    if (data && this.pollingCallback) {
      this.currentRid = data.rid
      this.pollingCallback(data)
    }
  } catch (error) {
    console.error('Polling error:', error)
    // Don't stop polling on error, just log it
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/api/qbittorrent.js tests/api/qbittorrent.test.js
git commit -m "feat: add polling mechanism to API client"
```

## Chunk 2: Store and Dashboard Integration

### Task 2.1: Update Pinia store to support polling

**Files:**
- Modify: `src/store/torrent.js`

- [ ] **Step 1: Add missing methods to store**

```javascript
// src/store/torrent.js - Add to store definition

// Add computed getter for torrentsMap
const torrentsMap = computed(() => {
  const map = {}
  torrents.value.forEach(t => {
    map[t.hash] = t
  })
  return map
})

// Add actions for polling integration
function setTorrents(torrentsArray) {
  torrents.value = torrentsArray
}

function setServerState(state) {
  serverState.value = { ...serverState.value, ...state }
}

// Update return statement to include new methods
return {
  // ... existing exports ...
  torrentsMap,
  // ... existing exports ...
  setTorrents,
  setServerState,
  // ... existing exports ...
}
```

- [ ] **Step 2: Run the application to verify store works**

Run: `npm run dev`
Expected: Application starts without errors

- [ ] **Step 3: Commit**

```bash
git add src/store/torrent.js
git commit -m "feat: add polling support methods to torrent store"
```

### Task 2.2: Update Dashboard.vue to use polling

**Files:**
- Modify: `src/views/Dashboard.vue`

- [ ] **Step 1: Verify current implementation**

Read `src/views/Dashboard.vue` to confirm polling implementation exists.

- [ ] **Step 2: Fix store references if needed**

The current Dashboard.vue references:
- `torrentStore.setTorrents()`
- `torrentStore.setServerState()`
- `torrentStore.torrentsMap`

Verify these match the updated store implementation.

- [ ] **Step 3: Run the application to verify integration**

Run: `npm run dev`
Expected: Dashboard updates automatically with polling data

- [ ] **Step 4: Commit**

```bash
git add src/views/Dashboard.vue
git commit -m "feat: integrate polling mechanism into Dashboard component"
```

## Chunk 3: Error Handling and Edge Cases

### Task 3.1: Add error handling for polling

**Files:**
- Modify: `src/api/qbittorrent.js`
- Test: `tests/api/qbittorrent.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/api/qbittorrent.test.js - Add to existing describe block

it('should handle polling errors gracefully', async () => {
  global.fetch.mockRejectedValue(new Error('Network error'))

  const callback = vi.fn()
  api.startPolling(callback, 100)

  await new Promise(resolve => setTimeout(resolve, 150))

  // Callback should not be called on error
  expect(callback).not.toHaveBeenCalled()

  // Polling should continue despite error
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ rid: 1, full_update: true, torrents: {} })
  })

  await new Promise(resolve => setTimeout(resolve, 150))
  expect(callback).toHaveBeenCalled()

  api.stopPolling()
})

it('should handle 403 errors during polling', async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 403
  })

  const callback = vi.fn()
  api.startPolling(callback, 100)

  await new Promise(resolve => setTimeout(resolve, 150))

  // Should call handle403Error
  expect(api.handle403Error).toHaveBeenCalled()

  api.stopPolling()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```javascript
// src/api/qbittorrent.js - Update _poll method

async _poll() {
  try {
    const data = await this.getMainData(this.currentRid)
    if (data && this.pollingCallback) {
      this.currentRid = data.rid
      this.pollingCallback(data)
    }
  } catch (error) {
    console.error('Polling error:', error)
    // Don't stop polling on error, just log it
  }
}

// Update getMainData to handle 403
async getMainData(rid = 0) {
  try {
    const response = await this._request(`/api/v2/sync/maindata?rid=${rid}`, {
      method: 'GET'
    })

    if (response.status === 403) {
      this.handle403Error()
      return null
    }

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('getMainData error:', error)
    return null
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/api/qbittorrent.js tests/api/qbittorrent.test.js
git commit -m "feat: add error handling for polling mechanism"
```

## Chunk 4: Performance Optimization

### Task 4.1: Add debouncing and throttling

**Files:**
- Modify: `src/api/qbittorrent.js`
- Test: `tests/api/qbittorrent.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/api/qbittorrent.test.js - Add to existing describe block

it('should throttle rapid polling requests', async () => {
  const mockData = { rid: 1, full_update: true, torrents: {} }
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => mockData
  })

  const callback = vi.fn()
  api.startPolling(callback, 50) // Very fast polling

  // Wait for multiple polls
  await new Promise(resolve => setTimeout(resolve, 200))

  // Should not make more than 5 requests in 200ms with 50ms interval
  expect(global.fetch.mock.calls.length).toBeLessThanOrEqual(5)

  api.stopPolling()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: FAIL (requests not throttled)

- [ ] **Step 3: Write minimal implementation**

```javascript
// src/api/qbittorrent.js - Update polling mechanism

startPolling(callback, interval = 1000) {
  this.pollingCallback = callback
  this.currentRid = 0
  this.isPolling = true

  const poll = async () => {
    if (!this.isPolling) return

    try {
      const data = await this.getMainData(this.currentRid)
      if (data && this.pollingCallback) {
        this.currentRid = data.rid
        this.pollingCallback(data)
      }
    } catch (error) {
      console.error('Polling error:', error)
    }

    if (this.isPolling) {
      setTimeout(poll, interval)
    }
  }

  // Start initial poll
  poll()
}

stopPolling() {
  this.isPolling = false
  this.pollingCallback = null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/api/qbittorrent.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/api/qbittorrent.js tests/api/qbittorrent.test.js
git commit -m "feat: add throttling to polling mechanism"
```

## Chunk 5: Documentation and Cleanup

### Task 5.1: Update API documentation

**Files:**
- Modify: `src/api/qbittorrent.js` (JSDoc comments)
- Create: `docs/api/polling-mechanism.md`

- [ ] **Step 1: Write documentation**

```markdown
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
```

- [ ] **Step 2: Create documentation file**

Run: `mkdir -p docs/api && touch docs/api/polling-mechanism.md`

- [ ] **Step 3: Commit**

```bash
git add docs/api/polling-mechanism.md src/api/qbittorrent.js
git commit -m "docs: add polling mechanism documentation"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-03-14-qbittorrent-polling-mechanism.md`. Ready to execute?**
