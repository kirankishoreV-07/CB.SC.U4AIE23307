# Stage 1

## Priority Inbox Algorithm

### Problem
Given a stream of notifications of types Placement, Result, and Event, identify the top 10 most important unread notifications efficiently.

### Scoring Formula
score = (typeWeight * 10,000,000,000,000) + timestampMilliseconds

Type weights: Placement = 3, Result = 2, Event = 1

### Why This Formula
Multiplying typeWeight by 10^13 ensures type always dominates recency. The maximum timestamp value (around year 2100) is ~4 * 10^12, which is less than 10^13. This guarantees type priority first, then recency within the same type.

### Maintaining Top 10 as New Notifications Arrive
A fixed-capacity min-heap of size 10 is used. The heap root always holds the lowest-priority item in the current top 10. When a new notification arrives:

1. Compute its score
2. If score > heap root, replace root and re-heapify (O(log 10))
3. Otherwise discard

Time complexity: O(n log k) where n = total notifications, k = 10
Space complexity: O(k)

# Stage 2

## Architecture

### Framework
Next.js with Pages Router. Pages Router avoids extra App Router configuration during time-limited implementation.

### Component Structure
- NavBar: top navigation between All and Priority pages
- NotificationCard: displays type chip, message, timestamp, read/unread state
- TypeFilterBar: filter chips that trigger API refetch with notification_type param
- TopNSelector: MUI Select for choosing top 10/15/20

### Read/Unread State
localStorage persists read notification IDs across page refreshes. IDs are stored as a JSON array under key "readNotifications". On click, the ID is added and the card updates immediately.

### API Integration
All fetches include the Authorization header from the access token. Supported query params: limit, page, notification_type. Pagination uses limit=10 on the All Notifications page. Priority page fetches limit=50 then applies client-side ranking.

### Priority Scoring in Frontend
The same scoring formula from Stage 1 is reused in the frontend. getTopN() sorts by score descending and slices to n. Ranking is client-side and requires no additional API calls.
