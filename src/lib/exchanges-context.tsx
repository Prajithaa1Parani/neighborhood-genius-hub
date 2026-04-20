// ─── DSA USED IN THIS FILE ─────────────────────────────────────
// • Pub/Sub via useSyncExternalStore — for the cross-account
//   in-memory request store, so requests created by one user are
//   instantly visible to the recipient on login.
// ───────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback, useSyncExternalStore, useMemo, type ReactNode } from "react";
import {
  activeExchanges as initialExchanges,
  allSkills as initialSkills,
  seededUserPosts,
  completedSessions as initialHistory,
  seededRequests,
  allUsers,
  type Exchange, type Skill, type CompletedSession, type ExchangeRequest,
} from "./mock-data";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

// ─── Module-level shared store (survives logout/login in same tab) ───
let requestStore: ExchangeRequest[] = [...seededRequests];
const listeners = new Set<() => void>();
function subscribeRequests(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function snapshotRequests() { return requestStore; }
function emit() { listeners.forEach(l => l()); }
function setRequests(updater: (prev: ExchangeRequest[]) => ExchangeRequest[]) {
  requestStore = updater(requestStore);
  emit();
}

interface ExchangesContextType {
  exchanges: Exchange[];
  skills: Skill[];
  history: CompletedSession[];
  requests: ExchangeRequest[];
  incomingRequests: ExchangeRequest[];
  outgoingRequests: ExchangeRequest[];
  pendingIncomingCount: number;
  requestExchange: (skill: Skill) => { ok: boolean; reason?: string };
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  postSkill: (skill: Omit<Skill, "id" | "rating" | "reviewCount" | "distance" | "image" | "instructor" | "pricePerHour" | "postedBy"> & { tags: string[]; pricePerHour: number }) => void;
  deleteSkill: (id: string) => void;
  leaveReview: (sessionId: string, rating: number) => void;
}

const ExchangesContext = createContext<ExchangesContextType | null>(null);

export function ExchangesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState<Exchange[]>(initialExchanges);
  const [skills, setSkills] = useState<Skill[]>([...seededUserPosts, ...initialSkills]);
  const [history, setHistory] = useState<CompletedSession[]>(initialHistory);

  // Subscribe to shared request store
  const requests = useSyncExternalStore(subscribeRequests, snapshotRequests, snapshotRequests);

  const incomingRequests = useMemo(
    () => requests.filter(r => r.toUserId === user?.id),
    [requests, user?.id]
  );
  const outgoingRequests = useMemo(
    () => requests.filter(r => r.fromUserId === user?.id),
    [requests, user?.id]
  );
  const pendingIncomingCount = useMemo(
    () => incomingRequests.filter(r => r.status === "Pending").length,
    [incomingRequests]
  );

  const requestExchange = useCallback((skill: Skill) => {
    if (!user) return { ok: false, reason: "Not signed in" };
    const ownerId = skill.postedBy;
    if (!ownerId) return { ok: false, reason: "This skill has no owner to request" };
    if (ownerId === user.id) return { ok: false, reason: "You can't request your own post" };
    // duplicate guard
    const exists = requestStore.some(r =>
      r.skillId === skill.id && r.fromUserId === user.id && r.status === "Pending"
    );
    if (exists) return { ok: false, reason: "You already have a pending request for this skill" };

    const owner = allUsers[ownerId];
    const newReq: ExchangeRequest = {
      id: `req-${Date.now()}`,
      skillId: skill.id,
      skillTitle: skill.title,
      fromUserId: user.id,
      fromUserName: user.name,
      fromUserAvatar: user.avatar,
      toUserId: ownerId,
      toUserName: owner?.name ?? skill.instructor.name,
      toUserAvatar: owner?.avatar ?? skill.instructor.avatar,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setRequests(prev => [newReq, ...prev]);
    return { ok: true };
  }, [user]);

  const acceptRequest = useCallback((id: string) => {
    const req = requestStore.find(r => r.id === id);
    if (!req) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Accepted" } : r));
    // Owner gains a scheduled exchange with the requester
    setExchanges(prev => [{
      id: `e${Date.now()}`,
      skill: req.skillTitle,
      partner: req.fromUserName,
      partnerAvatar: req.fromUserAvatar,
      status: "Scheduled",
      progress: 0,
    }, ...prev]);
    toast.success(`Accepted ${req.fromUserName}'s request`, { description: req.skillTitle });
  }, []);

  const declineRequest = useCallback((id: string) => {
    const req = requestStore.find(r => r.id === id);
    if (!req) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Declined" } : r));
    toast(`Declined ${req.fromUserName}'s request`, { description: req.skillTitle });
  }, []);

  const postSkill = useCallback<ExchangesContextType["postSkill"]>((data) => {
    const uid = user?.id ?? "u1";
    const authorName = user?.name ?? "You";
    const authorAvatar = user?.avatar ?? "/avatars/priya.png";
    setSkills(prev => [
      {
        id: `s${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
        instructor: { name: authorName, avatar: authorAvatar },
        rating: 5.0,
        reviewCount: 0,
        distance: "0 km",
        duration: data.duration,
        tags: data.tags,
        pricePerHour: data.pricePerHour,
        postedBy: uid,
        postedAt: new Date().toISOString().slice(0, 10),
        views: 0,
        requestCount: 0,
        status: "Active",
      },
      ...prev,
    ]);
  }, [user]);

  const deleteSkill = useCallback((id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  }, []);

  const leaveReview = useCallback((sessionId: string, rating: number) => {
    setHistory(prev => prev.map(h => h.id === sessionId ? { ...h, ratingGiven: rating } : h));
  }, []);

  return (
    <ExchangesContext.Provider value={{
      exchanges, skills, history,
      requests, incomingRequests, outgoingRequests, pendingIncomingCount,
      requestExchange, acceptRequest, declineRequest,
      postSkill, deleteSkill, leaveReview,
    }}>
      {children}
    </ExchangesContext.Provider>
  );
}

export function useExchanges() {
  const ctx = useContext(ExchangesContext);
  if (!ctx) throw new Error("useExchanges must be used within ExchangesProvider");
  return ctx;
}
