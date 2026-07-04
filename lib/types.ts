export type Creator = {
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  gradient: string;
};

export type ArtworkPost = {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  animeTags: string[];
  mediaType: "Image" | "GIF" | "Video";
  premium: boolean;
  rating: number;
  likes: number;
  comments: number;
  saves: number;
  gradient: string;
  author: Creator;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Pro";
  lessons: number;
  duration: string;
  gradient: string;
};

export type Material = {
  id: string;
  title: string;
  type: "PSD" | "LUT" | "Overlay" | "Font Pack" | "Thumbnail Kit" | "GFX Pack";
  files: number;
  license: "Personal" | "Commercial";
  price: string;
  gradient: string;
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
};
