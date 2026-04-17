import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { activeExchanges as initialExchanges, allSkills as initialSkills, type Exchange, type Skill } from "./mock-data";

interface ExchangesContextType {
  exchanges: Exchange[];
  skills: Skill[];
  requestExchange: (skill: Skill) => void;
  postSkill: (skill: Omit<Skill, "id" | "rating" | "reviewCount" | "distance" | "image" | "instructor"> & { tags: string[] }) => void;
}

const ExchangesContext = createContext<ExchangesContextType | null>(null);

export function ExchangesProvider({ children }: { children: ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>(initialExchanges);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const requestExchange = useCallback((skill: Skill) => {
    setExchanges(prev => {
      // dedupe — don't add the same skill twice
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
    setSkills(prev => [
      {
        id: `s${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
        instructor: { name: "Arjun Mehta", avatar: "/avatars/arjun.png" },
        rating: 5.0,
        reviewCount: 0,
        distance: "1.2 km",
        duration: data.duration,
        tags: data.tags,
      },
      ...prev,
    ]);
  }, []);

  return (
    <ExchangesContext.Provider value={{ exchanges, skills, requestExchange, postSkill }}>
      {children}
    </ExchangesContext.Provider>
  );
}

export function useExchanges() {
  const ctx = useContext(ExchangesContext);
  if (!ctx) throw new Error("useExchanges must be used within ExchangesProvider");
  return ctx;
}
