export interface User {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  joinedDate: string;
  bio: string;
  rating: number;
  reviewCount: number;
  skillsExchanged: number;
  hoursEarned: number;
  communityRating: number;
  isVerified: boolean;
  isOnline: boolean;
  skillsOffered: Skill[];
  skillsNeeded: string[];
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Pro";
  image: string;
  instructor: { name: string; avatar: string };
  rating: number;
  reviewCount: number;
  distance: string;
  duration: string;
  tags: string[];
}

export interface Exchange {
  id: string;
  skill: string;
  partner: string;
  partnerAvatar: string;
  status: "In Progress" | "Scheduled" | "Completed";
  progress: number;
}

export interface ChatConversation {
  id: string;
  user: { name: string; avatar: string; isOnline: boolean; specialty: string };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

// Realistic professional headshots stored in /public/avatars/
export const AVATARS = {
  arjun: "/avatars/arjun.png",
  priya: "/avatars/priya.png",
  david: "/avatars/david.png",
  sarah: "/avatars/sarah.png",
  rohan: "/avatars/rohan.png",
  liam: "/avatars/liam.png",
  aisha: "/avatars/aisha.png",
  julian: "/avatars/julian.png",
};

export const DEMO_CREDENTIALS = {
  email: "marcus@exchange.demo",
  password: "demo1234",
};

export const currentUser: User = {
  id: "u1",
  name: "Arjun Mehta",
  avatar: AVATARS.arjun,
  title: "Senior Backend Engineer · Distributed Systems",
  location: "Bengaluru, India",
  joinedDate: "Feb 2023",
  bio: "Backend engineer with 8+ years building distributed systems in Go and Java. I architect high-throughput services on Kubernetes and love mentoring engineers on system design fundamentals. Looking to swap backend insights for frontend craft and ML intuition.",
  rating: 4.92,
  reviewCount: 184,
  skillsExchanged: 47,
  hoursEarned: 132,
  communityRating: 4.92,
  isVerified: true,
  isOnline: true,
  skillsOffered: [
    {
      id: "s1", title: "System Design Interviews", description: "Crack FAANG-style system design rounds — load balancing, sharding, caching, consistency models.",
      category: "System Design", level: "Advanced",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
      instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.9, reviewCount: 87,
      distance: "1.2 km", duration: "90 min", tags: ["Architecture", "Scalability"]
    },
    {
      id: "s2", title: "Distributed Systems with Go", description: "Build production-grade microservices in Go — gRPC, message queues, observability.",
      category: "Backend", level: "Advanced",
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=600&h=400&fit=crop",
      instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.8, reviewCount: 45,
      distance: "1.2 km", duration: "120 min", tags: ["Go", "Microservices"]
    },
  ],
  skillsNeeded: ["React 19 patterns", "PyTorch fundamentals", "Figma to code", "AWS cost optimization"],
};

export const allSkills: Skill[] = [
  {
    id: "s3", title: "Data Structures & Algorithms",
    description: "Master arrays, trees, graphs, DP. Solve LeetCode-style problems with clean intuition and complexity analysis.",
    category: "Algorithms", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.9, reviewCount: 142,
    distance: "1.2 km", duration: "60 min", tags: ["DSA", "LeetCode", "Big-O"]
  },
  {
    id: "s4", title: "Advanced React & TypeScript",
    description: "React 19, server components, suspense patterns, and bullet-proof TypeScript generics for production apps.",
    category: "Web Dev", level: "Advanced",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    instructor: { name: "David Kim", avatar: AVATARS.david }, rating: 4.8, reviewCount: 96,
    distance: "0.8 km", duration: "90 min", tags: ["React", "TypeScript"]
  },
  {
    id: "s5", title: "Machine Learning with PyTorch",
    description: "Build CNNs and transformers from scratch. Training loops, regularization, and deploying models to production.",
    category: "ML/AI", level: "Advanced",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    instructor: { name: "Priya Sharma", avatar: AVATARS.priya }, rating: 4.9, reviewCount: 78,
    distance: "2.1 km", duration: "120 min", tags: ["PyTorch", "Deep Learning"]
  },
  {
    id: "s6", title: "Docker & Kubernetes Essentials",
    description: "Containerize apps and run them at scale. Pods, services, ingress, Helm charts, and rolling deployments.",
    category: "DevOps", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop",
    instructor: { name: "Rohan Desai", avatar: AVATARS.rohan }, rating: 4.7, reviewCount: 64,
    distance: "1.5 km", duration: "90 min", tags: ["Docker", "K8s", "DevOps"]
  },
  {
    id: "s7", title: "Web Security & OWASP Top 10",
    description: "Hands-on pen testing, XSS, CSRF, SQLi, and how to harden your stack before attackers find the gaps.",
    category: "Security", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    instructor: { name: "Liam O'Brien", avatar: AVATARS.liam }, rating: 4.8, reviewCount: 52,
    distance: "0.9 km", duration: "75 min", tags: ["Security", "OWASP", "Pentest"]
  },
  {
    id: "s8", title: "Design Systems with Figma",
    description: "Build a token-driven design system that ships — components, variants, auto-layout and Figma-to-code handoff.",
    category: "Web Dev", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop",
    instructor: { name: "Sarah Chen", avatar: AVATARS.sarah }, rating: 5.0, reviewCount: 38,
    distance: "0.6 km", duration: "60 min", tags: ["Figma", "Design Systems"]
  },
  {
    id: "s9", title: "AWS for Software Engineers",
    description: "EC2, S3, RDS, Lambda, IAM. Build a serverless backend and learn to keep your bill predictable.",
    category: "DevOps", level: "Beginner",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    instructor: { name: "Rohan Desai", avatar: AVATARS.rohan }, rating: 4.6, reviewCount: 71,
    distance: "1.5 km", duration: "90 min", tags: ["AWS", "Cloud", "Serverless"]
  },
  {
    id: "s10", title: "SQL Query Optimization",
    description: "Indexes, query plans, joins, and partitioning. Make Postgres queries 100x faster with the right tools.",
    category: "Data", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
    instructor: { name: "Aisha Malik", avatar: AVATARS.aisha }, rating: 4.8, reviewCount: 59,
    distance: "1.8 km", duration: "60 min", tags: ["SQL", "Postgres", "Performance"]
  },
  {
    id: "s11", title: "React Native for Mobile",
    description: "Cross-platform apps with React Native and Expo. Native modules, gestures, and deploying to App Store.",
    category: "Mobile", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    instructor: { name: "Julian Chen", avatar: AVATARS.julian }, rating: 4.7, reviewCount: 44,
    distance: "2.4 km", duration: "75 min", tags: ["React Native", "Mobile"]
  },
  {
    id: "s12", title: "REST & gRPC API Design",
    description: "Design APIs developers love. Versioning, pagination, idempotency and when to reach for gRPC.",
    category: "Backend", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop",
    instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.8, reviewCount: 67,
    distance: "1.2 km", duration: "60 min", tags: ["API", "REST", "gRPC"]
  },
];

export const activeExchanges: Exchange[] = [
  { id: "e1", skill: "Advanced React & TypeScript", partner: "David Kim", partnerAvatar: AVATARS.david, status: "In Progress", progress: 65 },
  { id: "e2", skill: "Machine Learning with PyTorch", partner: "Priya Sharma", partnerAvatar: AVATARS.priya, status: "Scheduled", progress: 0 },
  { id: "e3", skill: "Docker & Kubernetes Essentials", partner: "Rohan Desai", partnerAvatar: AVATARS.rohan, status: "Completed", progress: 100 },
];

export const conversations: ChatConversation[] = [
  { id: "c1", user: { name: "Priya Sharma", avatar: AVATARS.priya, isOnline: true, specialty: "ML Engineer · PyTorch" }, lastMessage: "Try BatchNorm before the activation, it usually stabilizes training.", timestamp: "10:50 AM", unread: 2 },
  { id: "c2", user: { name: "David Kim", avatar: AVATARS.david, isOnline: false, specialty: "Senior Frontend Engineer · React" }, lastMessage: "Use useDeferredValue for the search input — way smoother.", timestamp: "Yesterday", unread: 0 },
  { id: "c3", user: { name: "Rohan Desai", avatar: AVATARS.rohan, isOnline: true, specialty: "DevOps · AWS & Kubernetes" }, lastMessage: "Set requests/limits, then HPA will work as expected.", timestamp: "2 days ago", unread: 0 },
  { id: "c4", user: { name: "Sarah Chen", avatar: AVATARS.sarah, isOnline: false, specialty: "UI/UX Engineer · Design Systems" }, lastMessage: "Tokens first, then components. Keeps the system consistent.", timestamp: "3 days ago", unread: 1 },
  { id: "c5", user: { name: "Liam O'Brien", avatar: AVATARS.liam, isOnline: false, specialty: "Cybersecurity Specialist · OWASP" }, lastMessage: "Always parameterize queries. Never concatenate user input.", timestamp: "1 week ago", unread: 0 },
  { id: "c6", user: { name: "Aisha Malik", avatar: AVATARS.aisha, isOnline: true, specialty: "Data Engineer · SQL & Spark" }, lastMessage: "Add a composite index on (user_id, created_at) and re-run EXPLAIN.", timestamp: "1 week ago", unread: 0 },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", senderId: "u2", text: "Hey Arjun! Saw you wanted to pick up PyTorch — happy to help.", timestamp: "10:32 AM" },
    { id: "m2", senderId: "u1", text: "Thanks! My CNN loss is exploding after epoch 3. Any quick ideas?", timestamp: "10:45 AM" },
    { id: "m3", senderId: "u2", text: "Try BatchNorm before the activation, it usually stabilizes training.", timestamp: "10:50 AM" },
  ],
  c2: [
    { id: "m5", senderId: "u3", text: "Ready for the React 19 deep dive on Thursday?", timestamp: "Yesterday" },
    { id: "m6", senderId: "u1", text: "Yes! I read the server components RFC, lots of questions.", timestamp: "Yesterday" },
    { id: "m7", senderId: "u3", text: "Use useDeferredValue for the search input — way smoother.", timestamp: "Yesterday" },
  ],
};

export const reviews: Review[] = [
  { id: "r1", author: "Priya Sharma", avatar: AVATARS.priya, rating: 5, text: "Arjun broke down consistent hashing better than any blog post I've read. Walked me through a real sharding migration end-to-end. Highly recommend for system design prep.", date: "2 weeks ago" },
  { id: "r2", author: "David Kim", avatar: AVATARS.david, rating: 5, text: "Swapped React patterns for Go microservices with Arjun. Came away with a working gRPC service and a much clearer mental model of distributed transactions.", date: "1 month ago" },
  { id: "r3", author: "Rohan Desai", avatar: AVATARS.rohan, rating: 5, text: "Patient and incredibly precise. Helped me debug a nasty race condition in a Kafka consumer. Worth every hour.", date: "2 months ago" },
];

export const categories = [
  "All",
  "Algorithms",
  "Web Dev",
  "Backend",
  "DevOps",
  "ML/AI",
  "Mobile",
  "Security",
  "Data",
  "System Design",
];

export const levels = ["All Levels", "Beginner", "Intermediate", "Advanced", "Pro"] as const;

export const notifications = [
  { id: "n1", title: "Priya Sharma replied", body: "Try BatchNorm before the activation…", time: "5m" },
  { id: "n2", title: "New skill match", body: "David Kim posted Advanced React & TypeScript", time: "1h" },
  { id: "n3", title: "Exchange scheduled", body: "Docker & Kubernetes session with Rohan tomorrow 6 PM", time: "3h" },
];
