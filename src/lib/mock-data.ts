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
  pricePerHour: number; // 0 = free skill swap, otherwise ₹/hr
  postedBy?: string; // user id of poster (omitted = community / other mentor)
  postedAt?: string; // ISO date
  views?: number;
  requestCount?: number;
  status?: "Active" | "Paused";
}

export interface CompletedSession {
  id: string;
  skill: string;
  partnerId: string; // mentor slug
  partner: string;
  partnerAvatar: string;
  date: string; // ISO
  durationMin: number;
  ratingGiven: number | null; // null = needs review
  ratingReceived: number;
  notes: string;
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

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyPrice: number; // ₹/hr (0 = free swap)
  isVerified: boolean;
  isOnline: boolean;
  yearsExperience: number;
  responseTime: string;
  availability: string[];
  teaches: { title: string; level: Skill["level"]; price: number }[];
  wantsToLearn: string[];
  experience: { role: string; company: string; period: string }[];
  reviews: Review[];
}

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
  email: "prajithaa@exchange.demo",
  password: "demo1234",
};

export const DEMO_CREDENTIALS_2 = {
  email: "aarav@exchange.demo",
  password: "demo1234",
};

export const currentUser: User = {
  id: "u1",
  name: "Prajithaa",
  avatar: AVATARS.priya,
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
      distance: "1.2 km", duration: "90 min", tags: ["Architecture", "Scalability"], pricePerHour: 1200,
    },
    {
      id: "s2", title: "Distributed Systems with Go", description: "Build production-grade microservices in Go — gRPC, message queues, observability.",
      category: "Backend", level: "Advanced",
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=600&h=400&fit=crop",
      instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.8, reviewCount: 45,
      distance: "1.2 km", duration: "120 min", tags: ["Go", "Microservices"], pricePerHour: 1500,
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
    distance: "1.2 km", duration: "60 min", tags: ["DSA", "LeetCode", "Big-O"], pricePerHour: 800,
  },
  {
    id: "s4", title: "Advanced React & TypeScript",
    description: "React 19, server components, suspense patterns, and bullet-proof TypeScript generics for production apps.",
    category: "Web Dev", level: "Advanced",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    instructor: { name: "David Kim", avatar: AVATARS.david }, rating: 4.8, reviewCount: 96,
    distance: "0.8 km", duration: "90 min", tags: ["React", "TypeScript"], pricePerHour: 1100,
  },
  {
    id: "s5", title: "Machine Learning with PyTorch",
    description: "Build CNNs and transformers from scratch. Training loops, regularization, and deploying models to production.",
    category: "ML/AI", level: "Advanced",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    instructor: { name: "Priya Sharma", avatar: AVATARS.priya }, rating: 4.9, reviewCount: 78,
    distance: "2.1 km", duration: "120 min", tags: ["PyTorch", "Deep Learning"], pricePerHour: 1400,
  },
  {
    id: "s6", title: "Docker & Kubernetes Essentials",
    description: "Containerize apps and run them at scale. Pods, services, ingress, Helm charts, and rolling deployments.",
    category: "DevOps", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop",
    instructor: { name: "Rohan Desai", avatar: AVATARS.rohan }, rating: 4.7, reviewCount: 64,
    distance: "1.5 km", duration: "90 min", tags: ["Docker", "K8s", "DevOps"], pricePerHour: 900,
  },
  {
    id: "s7", title: "Web Security & OWASP Top 10",
    description: "Hands-on pen testing, XSS, CSRF, SQLi, and how to harden your stack before attackers find the gaps.",
    category: "Security", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    instructor: { name: "Liam O'Brien", avatar: AVATARS.liam }, rating: 4.8, reviewCount: 52,
    distance: "0.9 km", duration: "75 min", tags: ["Security", "OWASP", "Pentest"], pricePerHour: 1000,
  },
  {
    id: "s8", title: "Design Systems with Figma",
    description: "Build a token-driven design system that ships — components, variants, auto-layout and Figma-to-code handoff.",
    category: "Web Dev", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop",
    instructor: { name: "Sarah Chen", avatar: AVATARS.sarah }, rating: 5.0, reviewCount: 38,
    distance: "0.6 km", duration: "60 min", tags: ["Figma", "Design Systems"], pricePerHour: 0,
  },
  {
    id: "s9", title: "AWS for Software Engineers",
    description: "EC2, S3, RDS, Lambda, IAM. Build a serverless backend and learn to keep your bill predictable.",
    category: "DevOps", level: "Beginner",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    instructor: { name: "Rohan Desai", avatar: AVATARS.rohan }, rating: 4.6, reviewCount: 71,
    distance: "1.5 km", duration: "90 min", tags: ["AWS", "Cloud", "Serverless"], pricePerHour: 700,
  },
  {
    id: "s10", title: "SQL Query Optimization",
    description: "Indexes, query plans, joins, and partitioning. Make Postgres queries 100x faster with the right tools.",
    category: "Data", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
    instructor: { name: "Aisha Malik", avatar: AVATARS.aisha }, rating: 4.8, reviewCount: 59,
    distance: "1.8 km", duration: "60 min", tags: ["SQL", "Postgres", "Performance"], pricePerHour: 850,
  },
  {
    id: "s11", title: "React Native for Mobile",
    description: "Cross-platform apps with React Native and Expo. Native modules, gestures, and deploying to App Store.",
    category: "Mobile", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    instructor: { name: "Julian Chen", avatar: AVATARS.julian }, rating: 4.7, reviewCount: 44,
    distance: "2.4 km", duration: "75 min", tags: ["React Native", "Mobile"], pricePerHour: 950,
  },
  {
    id: "s12", title: "REST & gRPC API Design",
    description: "Design APIs developers love. Versioning, pagination, idempotency and when to reach for gRPC.",
    category: "Backend", level: "Intermediate",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop",
    instructor: { name: "Arjun Mehta", avatar: AVATARS.arjun }, rating: 4.8, reviewCount: 67,
    distance: "1.2 km", duration: "60 min", tags: ["API", "REST", "gRPC"], pricePerHour: 0,
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
    { id: "m1", senderId: "u2", text: "Hey Prajithaa! Saw you wanted to pick up PyTorch — happy to help.", timestamp: "10:32 AM" },
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
  { id: "r1", author: "Priya Sharma", avatar: AVATARS.priya, rating: 5, text: "Broke down consistent hashing better than any blog post I've read. Walked me through a real sharding migration end-to-end. Highly recommend for system design prep.", date: "2 weeks ago" },
  { id: "r2", author: "David Kim", avatar: AVATARS.david, rating: 5, text: "Swapped React patterns for Go microservices. Came away with a working gRPC service and a much clearer mental model of distributed transactions.", date: "1 month ago" },
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
  { id: "n1", title: "Priya Sharma replied", body: "Try BatchNorm before the activation…", time: "5m", route: "/chat" as const, priority: 1 },
  { id: "n2", title: "New skill match", body: "David Kim posted Advanced React & TypeScript", time: "1h", route: "/market" as const, priority: 2 },
  { id: "n3", title: "Exchange scheduled", body: "Docker & Kubernetes session with Rohan tomorrow 6 PM", time: "3h", route: "/dashboard" as const, priority: 1 },
  { id: "n4", title: "New 5★ review", body: "Sarah Chen left you a glowing review on System Design.", time: "6h", route: "/profile" as const, priority: 2 },
  { id: "n5", title: "Profile viewed", body: "Liam O'Brien viewed your profile.", time: "1d", route: "/profile" as const, priority: 3 },
];

// ─── Mentor registry — keyed by slug derived from instructor name ───
function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export const mentorSlug = slug;

export const mentors: Record<string, Mentor> = {
  [slug("Arjun Mehta")]: {
    id: slug("Arjun Mehta"), name: "Arjun Mehta", avatar: AVATARS.arjun,
    title: "Principal Engineer · Distributed Systems",
    location: "Bengaluru, India",
    bio: "12 years building large-scale backend platforms. Ex-Flipkart, ex-Stripe. I love teaching the *why* behind system design choices, not just the patterns.",
    rating: 4.9, reviewCount: 142, hourlyPrice: 1200,
    isVerified: true, isOnline: true, yearsExperience: 12, responseTime: "under 2h",
    availability: ["Mon 7-10 PM", "Wed 7-10 PM", "Sat 10 AM-2 PM"],
    teaches: [
      { title: "System Design Interviews", level: "Advanced", price: 1200 },
      { title: "Distributed Systems with Go", level: "Advanced", price: 1500 },
      { title: "Data Structures & Algorithms", level: "Intermediate", price: 800 },
      { title: "REST & gRPC API Design", level: "Intermediate", price: 0 },
    ],
    wantsToLearn: ["Rust for systems", "WebAssembly internals", "Formal verification (TLA+)"],
    experience: [
      { role: "Principal Engineer", company: "Stripe", period: "2021 — Present" },
      { role: "Staff Engineer", company: "Flipkart", period: "2017 — 2021" },
      { role: "SDE-2", company: "Amazon", period: "2013 — 2017" },
    ],
    reviews: reviews.slice(0, 3),
  },
  [slug("David Kim")]: {
    id: slug("David Kim"), name: "David Kim", avatar: AVATARS.david,
    title: "Senior Frontend Engineer · React Specialist",
    location: "Seoul, South Korea",
    bio: "I obsess over rendering performance and TypeScript ergonomics. 9 years shipping React apps used by millions.",
    rating: 4.8, reviewCount: 96, hourlyPrice: 1100,
    isVerified: true, isOnline: false, yearsExperience: 9, responseTime: "under 4h",
    availability: ["Tue 8-11 PM KST", "Thu 8-11 PM KST", "Sun 11 AM-3 PM KST"],
    teaches: [
      { title: "Advanced React & TypeScript", level: "Advanced", price: 1100 },
      { title: "Frontend Performance Audits", level: "Advanced", price: 1300 },
    ],
    wantsToLearn: ["Distributed tracing", "PostgreSQL internals", "Go for backend"],
    experience: [
      { role: "Senior Frontend Engineer", company: "Toss", period: "2020 — Present" },
      { role: "Frontend Engineer", company: "Coupang", period: "2016 — 2020" },
    ],
    reviews: reviews.slice(1, 3),
  },
  [slug("Priya Sharma")]: {
    id: slug("Priya Sharma"), name: "Priya Sharma", avatar: AVATARS.priya,
    title: "ML Engineer · PyTorch & Computer Vision",
    location: "Pune, India",
    bio: "ML engineer focused on production CV. I help engineers transition from notebooks to scalable training pipelines.",
    rating: 4.9, reviewCount: 78, hourlyPrice: 1400,
    isVerified: true, isOnline: true, yearsExperience: 7, responseTime: "under 1h",
    availability: ["Mon 8-10 PM", "Fri 7-10 PM", "Sun 4-7 PM"],
    teaches: [
      { title: "Machine Learning with PyTorch", level: "Advanced", price: 1400 },
      { title: "MLOps Fundamentals", level: "Intermediate", price: 1100 },
    ],
    wantsToLearn: ["System design at scale", "Kubernetes operators", "C++ for ML kernels"],
    experience: [
      { role: "Senior ML Engineer", company: "Uber", period: "2021 — Present" },
      { role: "ML Engineer", company: "Ola", period: "2018 — 2021" },
    ],
    reviews: reviews.slice(0, 2),
  },
  [slug("Rohan Desai")]: {
    id: slug("Rohan Desai"), name: "Rohan Desai", avatar: AVATARS.rohan,
    title: "DevOps Engineer · AWS & Kubernetes",
    location: "Mumbai, India",
    bio: "I run platform teams. Ten years of pager duty taught me what *really* matters in production.",
    rating: 4.7, reviewCount: 135, hourlyPrice: 900,
    isVerified: true, isOnline: true, yearsExperience: 10, responseTime: "under 3h",
    availability: ["Mon-Fri 9-11 PM"],
    teaches: [
      { title: "Docker & Kubernetes Essentials", level: "Intermediate", price: 900 },
      { title: "AWS for Software Engineers", level: "Beginner", price: 700 },
    ],
    wantsToLearn: ["Rust", "eBPF observability", "Service mesh design"],
    experience: [
      { role: "Staff DevOps Engineer", company: "Razorpay", period: "2020 — Present" },
      { role: "SRE", company: "Myntra", period: "2015 — 2020" },
    ],
    reviews: reviews.slice(2, 3),
  },
  [slug("Sarah Chen")]: {
    id: slug("Sarah Chen"), name: "Sarah Chen", avatar: AVATARS.sarah,
    title: "UI/UX Engineer · Design Systems",
    location: "Singapore",
    bio: "I build design systems that engineers actually enjoy using. Tokens first, components second.",
    rating: 5.0, reviewCount: 38, hourlyPrice: 0,
    isVerified: true, isOnline: false, yearsExperience: 8, responseTime: "under 6h",
    availability: ["Wed 8-10 PM SGT", "Sat 2-6 PM SGT"],
    teaches: [
      { title: "Design Systems with Figma", level: "Intermediate", price: 0 },
    ],
    wantsToLearn: ["React 19 internals", "TypeScript generics deep-dive"],
    experience: [
      { role: "Design Systems Lead", company: "Grab", period: "2019 — Present" },
    ],
    reviews: reviews.slice(0, 1),
  },
  [slug("Liam O'Brien")]: {
    id: slug("Liam O'Brien"), name: "Liam O'Brien", avatar: AVATARS.liam,
    title: "Cybersecurity Specialist · OWASP",
    location: "Dublin, Ireland",
    bio: "Pen-tester turned defender. I teach engineers to think like attackers so they ship safer code.",
    rating: 4.8, reviewCount: 52, hourlyPrice: 1000,
    isVerified: true, isOnline: false, yearsExperience: 11, responseTime: "under 5h",
    availability: ["Tue 7-10 PM IST", "Thu 7-10 PM IST"],
    teaches: [
      { title: "Web Security & OWASP Top 10", level: "Intermediate", price: 1000 },
    ],
    wantsToLearn: ["Cloud-native security", "Zero-trust architecture"],
    experience: [
      { role: "Security Lead", company: "Stripe", period: "2018 — Present" },
    ],
    reviews: reviews.slice(1, 2),
  },
  [slug("Aisha Malik")]: {
    id: slug("Aisha Malik"), name: "Aisha Malik", avatar: AVATARS.aisha,
    title: "Data Engineer · SQL & Spark",
    location: "Lahore, Pakistan",
    bio: "I make slow Postgres fast. Indexes, query plans, partitioning — that's my comfort zone.",
    rating: 4.8, reviewCount: 59, hourlyPrice: 850,
    isVerified: true, isOnline: true, yearsExperience: 6, responseTime: "under 2h",
    availability: ["Mon 8-11 PM PKT", "Fri 8-11 PM PKT"],
    teaches: [
      { title: "SQL Query Optimization", level: "Intermediate", price: 850 },
    ],
    wantsToLearn: ["Distributed databases", "Streaming with Flink"],
    experience: [
      { role: "Senior Data Engineer", company: "Careem", period: "2020 — Present" },
    ],
    reviews: reviews.slice(0, 2),
  },
  [slug("Julian Chen")]: {
    id: slug("Julian Chen"), name: "Julian Chen", avatar: AVATARS.julian,
    title: "Mobile Engineer · React Native",
    location: "Taipei, Taiwan",
    bio: "Cross-platform mobile is my craft. I bridge native and JS worlds gracefully.",
    rating: 4.7, reviewCount: 44, hourlyPrice: 950,
    isVerified: true, isOnline: false, yearsExperience: 7, responseTime: "under 4h",
    availability: ["Tue 9-11 PM CST", "Sat 11 AM-3 PM CST"],
    teaches: [
      { title: "React Native for Mobile", level: "Intermediate", price: 950 },
    ],
    wantsToLearn: ["Swift UI", "Kotlin Multiplatform"],
    experience: [
      { role: "Senior Mobile Engineer", company: "Shopee", period: "2019 — Present" },
    ],
    reviews: reviews.slice(0, 1),
  },
};
