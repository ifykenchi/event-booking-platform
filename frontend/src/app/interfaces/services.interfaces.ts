export interface signupPost {
  username: string;
  email: string;
  password: string;
}

export interface loginPost {
  email: string;
  password: string;
}

export interface EventI {
  title: string;
  about: string;
  category: string;
}

export interface responseI {
  message: string;
  events: EventI[];
}

export interface DeleteI {
  message: string;
}

export type SearchKey = 'title' | 'category';
