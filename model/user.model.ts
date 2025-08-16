import { Deck } from "./deck.model";

export interface gsUser {
  userId: string;
}

export interface gsSQLUser extends gsUser {
  name: string;
  displaypic: string;
}

export interface gsMongoUser extends gsUser {
  crbdecks: Deck[];
  uadecks: Deck[];
  opdecks: Deck[];
  dbzfwdecks: Deck[];
  dmdecks: Deck[];
  gcgdecks: Deck[];
  hocgdecks: Deck[];
}

export interface Notification {
  notificationId: string;
  userId: string;          
  senderId: string;      
  senderName: string;
  senderDp: string;      
  postId: string;
  message: string;       
  isRead: boolean;
  timestamp: string;   
}