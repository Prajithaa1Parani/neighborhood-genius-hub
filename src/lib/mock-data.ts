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
  user: { name: string; avatar: string; isOnline: boolean };
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

const AVATARS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Elena",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Julian",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jean",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha",
];

export const DEMO_CREDENTIALS = {
  email: "marcus@exchange.demo",
  password: "demo1234",
};

export const currentUser: User = {
  id: "u1",
  name: "Marcus Thorne",
  avatar: AVATARS[0],
  title: "Master Furniture Maker & Sustainable Designer",
  location: "Brooklyn, NY",
  joinedDate: "Feb 2022",
  bio: "With over 15 years in custom cabinetry and fine woodworking, I've dedicated my career to crafting pieces that last generations. I believe skill sharing is the heartbeat of a thriving community. I'm currently looking to diversify my digital skills while passing on the fundamentals of traditional joinery and restoration.",
  rating: 4.92,
  reviewCount: 231,
  skillsExchanged: 124,
  hoursEarned: 12.5,
  communityRating: 4.92,
  isVerified: true,
  isOnline: true,
  skillsOffered: [
    {
      id: "s1", title: "Custom Woodworking", description: "Learn traditional joinery and furniture making",
      category: "Crafts", level: "Advanced", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
      instructor: { name: "Marcus Thorne", avatar: AVATARS[0] }, rating: 4.9, reviewCount: 87,
      distance: "0.3mi", duration: "2-3 hours", tags: ["Woodworking", "Furniture"]
    },
    {
      id: "s2", title: "Sustainable Design", description: "Eco-friendly design principles and upcycling",
      category: "Design", level: "Intermediate", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      instructor: { name: "Marcus Thorne", avatar: AVATARS[0] }, rating: 4.8, reviewCount: 45,
      distance: "0.3mi", duration: "1-2 hours", tags: ["Design", "Sustainability"]
    },
  ],
  skillsNeeded: ["React Development", "Video Editing", "UI/UX Design", "Urban Gardening"],
};

export const allSkills: Skill[] = [
  {
    id: "s3", title: "Advanced React & Tailwind", description: "Dive deep into React 19, hooks patterns, and building scalable apps with Tailwind CSS. Hands-on projects included.",
    category: "Coding", level: "Advanced", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    instructor: { name: "David Kim", avatar: AVATARS[2] }, rating: 4.8, reviewCount: 62,
    distance: "1.2mi", duration: "3 hours", tags: ["React", "Tailwind", "Web Dev"]
  },
  {
    id: "s4", title: "UI/UX Motion Principles", description: "Learn how to make your interfaces feel alive with meaningful animations and transitions.",
    category: "Design", level: "Intermediate", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    instructor: { name: "Sarah Chen", avatar: AVATARS[3] }, rating: 5.0, reviewCount: 28,
    distance: "0.8mi", duration: "2 hours", tags: ["UI/UX", "Animation", "Design"]
  },
  {
    id: "s5", title: "Mastering Thai Cuisines", description: "Authentic Thai cooking from scratch — curries, stir-fries, and street food classics.",
    category: "Cooking", level: "Intermediate", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop",
    instructor: { name: "Priya Nair", avatar: AVATARS[5] }, rating: 4.8, reviewCount: 94,
    distance: "2.1mi", duration: "3 hours", tags: ["Cooking", "Thai", "Culinary"]
  },
  {
    id: "s6", title: "Fingerstyle Guitar Basics", description: "Master fingerpicking patterns from folk to blues. All levels welcome with your own guitar.",
    category: "Music", level: "Beginner", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop",
    instructor: { name: "Jean Pierre", avatar: AVATARS[6] }, rating: 4.7, reviewCount: 53,
    distance: "0.5mi", duration: "1.5 hours", tags: ["Guitar", "Music", "Fingerstyle"]
  },
  {
    id: "s7", title: "Oil Painting for Beginners", description: "Create vivid landscapes. Learn color mixing, brushwork, and composition fundamentals.",
    category: "Art", level: "Beginner", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
    instructor: { name: "Aisha Malik", avatar: AVATARS[7] }, rating: 4.6, reviewCount: 41,
    distance: "1.8mi", duration: "2.5 hours", tags: ["Painting", "Art", "Oil"]
  },
  {
    id: "s8", title: "Urban Gardening 101", description: "Transform your balcony or backyard into a productive garden. Composting, raised beds, and more.",
    category: "Gardening", level: "Beginner", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    instructor: { name: "Elena Vance", avatar: AVATARS[1] }, rating: 4.9, reviewCount: 76,
    distance: "0.4mi", duration: "2 hours", tags: ["Gardening", "Urban", "Sustainability"]
  },
  {
    id: "s9", title: "Artisan Pasta Making", description: "Handmade pasta from scratch — fettuccine, ravioli, and regional Italian shapes.",
    category: "Cooking", level: "Intermediate", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=300&fit=crop",
    instructor: { name: "Jean Pierre", avatar: AVATARS[6] }, rating: 4.8, reviewCount: 58,
    distance: "0.8mi", duration: "2.5 hours", tags: ["Pasta", "Cooking", "Italian"]
  },
  {
    id: "s10", title: "Business Card Design", description: "Professional branding and identity design for small businesses and freelancers.",
    category: "Design", level: "Pro", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
    instructor: { name: "David Kim", avatar: AVATARS[2] }, rating: 4.5, reviewCount: 33,
    distance: "1.2mi", duration: "1.5 hours", tags: ["Branding", "Design", "Business"]
  },
];

export const activeExchanges: Exchange[] = [
  { id: "e1", skill: "Urban Gardening 101", partner: "Elena M.", partnerAvatar: AVATARS[1], status: "In Progress", progress: 65 },
  { id: "e2", skill: "React Fundamentals", partner: "David K.", partnerAvatar: AVATARS[2], status: "Scheduled", progress: 0 },
  { id: "e3", skill: "Thai Cooking Basics", partner: "Priya N.", partnerAvatar: AVATARS[5], status: "Completed", progress: 100 },
];

export const conversations: ChatConversation[] = [
  { id: "c1", user: { name: "Elena Vance", avatar: AVATARS[1], isOnline: true }, lastMessage: "That looks incredible. I've been struggling with my patio irrigation.", timestamp: "10:50 AM", unread: 2 },
  { id: "c2", user: { name: "David Kim", avatar: AVATARS[2], isOnline: false }, lastMessage: "Let's schedule the React session for next Thursday.", timestamp: "Yesterday", unread: 0 },
  { id: "c3", user: { name: "Priya Nair", avatar: AVATARS[5], isOnline: true }, lastMessage: "The green curry turned out amazing! Thank you!", timestamp: "2 days ago", unread: 0 },
  { id: "c4", user: { name: "Sarah Chen", avatar: AVATARS[3], isOnline: false }, lastMessage: "I'd love to learn woodworking in exchange for UX lessons.", timestamp: "3 days ago", unread: 1 },
  { id: "c5", user: { name: "Jean Pierre", avatar: AVATARS[6], isOnline: false }, lastMessage: "The guitar strings you recommended are perfect.", timestamp: "1 week ago", unread: 0 },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", senderId: "u2", text: "Hi there! I saw you're offering urban beekeeping lessons. I've always wanted to start a hive on my balcony.", timestamp: "10:32 AM" },
    { id: "m2", senderId: "u1", text: "Absolutely! Balcony beekeeping is definitely possible if you have the right orientation. What's your skill swap offer?", timestamp: "10:45 AM" },
    { id: "m3", senderId: "u2", text: "I specialize in vertical hydroponics and sustainable irrigation systems. Here is my current setup!", timestamp: "10:48 AM" },
    { id: "m4", senderId: "u1", text: "That looks incredible. I've been struggling with my patio irrigation. That would be a perfect swap. Can we meet at the community garden?", timestamp: "10:50 AM" },
  ],
  c2: [
    { id: "m5", senderId: "u3", text: "Hey Marcus! Ready to start the React lessons?", timestamp: "Yesterday" },
    { id: "m6", senderId: "u1", text: "Absolutely! I've been practicing the basics you sent.", timestamp: "Yesterday" },
    { id: "m7", senderId: "u3", text: "Let's schedule the React session for next Thursday.", timestamp: "Yesterday" },
  ],
};

export const reviews: Review[] = [
  { id: "r1", author: "Elena Rodriguez", avatar: AVATARS[1], rating: 5, text: "Marcus is a patient and incredible teacher. I learnt more in one session about building my own herb planter box than I did in two semesters. His skill #23 a perfect exchange!", date: "2 weeks ago" },
  { id: "r2", author: "Julian Chen", avatar: AVATARS[4], rating: 5, text: "Exchanged Furniture Repair for basic Python skills. Really hardworking and gives great insight. Highly recommend Marcus for anyone wanting to learn the craft.", date: "1 month ago" },
];

export const categories = ["All Skills", "Coding", "Cooking", "Design", "Music", "Art", "Gardening", "Language", "Fitness"];
