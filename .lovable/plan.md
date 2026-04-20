

## Plan: Functional exchange requests with accept/decline flow

### Problem
Currently `requestExchange` just adds to local state of the requester. The recipient (post owner) never sees the request. Need a shared request system.

### Solution

**1. New `Request` type in `mock-data.ts`:**
```ts
type ExchangeRequest = {
  id: string;
  skillId: string;
  skillTitle: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;        // post owner
  toUserName: string;
  status: "Pending" | "Accepted" | "Declined";
  createdAt: string;
  message?: string;
}
```

**2. Update `exchanges-context.tsx`:**
- Add `requests: ExchangeRequest[]` to context state (shared across both demo users via module-level store so cross-account works in same session — use a simple in-memory store outside the provider)
- `requestExchange(skill)` → create a Pending request (don't auto-create exchange anymore)
- New `acceptRequest(id)` → mark Accepted + create Exchange + add notification
- New `declineRequest(id)` → mark Declined
- Expose `incomingRequests` (where `toUserId === currentUser.id` && Pending) and `outgoingRequests` (where `fromUserId === currentUser.id`)

**3. New route `src/routes/requests.tsx`:**
- Two tabs: **Incoming** (accept/decline buttons) and **Outgoing** (status badges)
- Empty states for both
- Uses **Priority Queue** DSA to surface oldest pending first (FIFO fairness) — add comment header

**4. Sidebar item** in `AppLayout.tsx`: "Requests" with `Inbox` icon + **unread count badge** (number of incoming Pending)

**5. Notifications integration:**
- When a new incoming request arrives, push a notification ("Aarav requested *Concurrency in Go*")
- When your outgoing request is accepted/declined, push a notification

**6. Update `SkillCard.tsx` toast:**
- Change from "Exchange requested" to "Request sent — waiting for [name] to accept"

**7. Cross-account in-memory store:**
Since both demo users live in the same browser session, store requests in a module-level array (`let requestStore: ExchangeRequest[] = []`) outside the provider with a simple subscription mechanism (`useSyncExternalStore` or a force-rerender via custom event). This way, when Aarav requests something and you log out → log in as Prajithaa, the request is still there.

### Files

**Create**: `src/routes/requests.tsx`

**Edit**: `src/lib/mock-data.ts` (add `ExchangeRequest` type + seed 1 incoming request for Prajithaa from Aarav so it's visible immediately), `src/lib/exchanges-context.tsx` (request store + accept/decline + notifications hook), `src/components/AppLayout.tsx` (sidebar + notification triggers from requests), `src/components/SkillCard.tsx` (toast wording), `DSA_CONCEPTS.md` (add priority queue usage for requests)

No new dependencies.

