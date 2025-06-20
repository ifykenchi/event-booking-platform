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
  totalSeats: number;
  availableSeats?: number;
  category: string;
  createdOn: string;
}

export interface responseI {
  message: string;
  events: EventI[];
}

export interface UserDataI {
  userId: string;
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

export interface BookingI {
  _id: string;
  eventId: string;
  userId: string;
  userDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  createdOn: string;
}

export interface BookingDataI {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    category: string;
    totalSeats: number;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  userDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  createdOn: string;
}

export interface bookingsResponseI {
  message: string;
  bookings: BookingDataI[];
  availableSeats: number;
}
