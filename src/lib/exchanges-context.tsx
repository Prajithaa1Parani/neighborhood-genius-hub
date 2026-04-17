import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  activeExchanges as initialExchanges,
  allSkills as initialSkills,
  seededUserPosts,
  completedSessions as initialHistory,
  type Exchange, type Skill, type CompletedSession,
} from "./mock-data";
import { useAuth } from "./auth-context";

interface ExchangesContextType {
  exchanges: Exchange[];
  skills: Skill[];
  history: CompletedSession[];
  requestExchange: (skill: Skill) => void;
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

  const requestExchange = useCallback((skill: Skill) => {
    setExchanges(prev => {
      if (prev.some(e => e.skill === skill.title)) return prev;
      const next: Exchange = {
        id: `e${Date.now()}`,
        skill: skill.title,
        partner: skill.instructor.name,
        partnerAvatar: skill.instructor.avatar,
        status: "Scheduled",
        progress: 0,
      };
      return [next, ...prev];
    });
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
    <ExchangesContext.Provider value={{ exchanges, skills, history, requestExchange, postSkill, deleteSkill, leaveReview }}>
      {children}
    </ExchangesContext.Provider>
  );
}

export function useExchanges() {
  const ctx = useContext(ExchangesContext);
  if (!ctx) throw new Error("useExchanges must be used within ExchangesProvider");
  return ctx;
}
