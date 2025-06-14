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
  _id: string;
  title: string;
  about: string;
  category: string;
  createdOn: string;
}

export interface responseI {
  message: string;
  events: EventI[];
}

export interface UserDataI {
  username: string;
  password: string;
}

export interface UserDataResponseI {
  message: string;
  userData: UserDataI;
}

export interface AdminDataResponseI {
  message: string;
  adminData: UserDataI;
}

export interface DeleteI {
  message: string;
}

export type SearchKey = 'title' | 'category';

export type Category = 'ALL' | 'Entertainment' | 'Football' | 'Tech' | 'Others';
