import type { Movie } from "./movies";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  theme?: "LIGHT" | "DARK" | null;
  createdAt: Date;
  updatedAt: Date;
  movies?: Movie[];
  comments?: Comment[];
  //   ratings?: Rating[];
  //   likes?: Like[];
  //   settings?: UserSettings | null;
  notifications?: Notification[];
}
