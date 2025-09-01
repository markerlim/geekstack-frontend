import { Deck, DeckRecord, LightDeck } from "./deck.model";

export interface gsUser {
  userId: string;
}

export interface UserPreferences {
  unionarenaOffline: boolean;
  onepieceOffline: boolean;
  cookierunbraverseOffline: boolean;
  duelmastersOffline: boolean;
  dragonballzfwOffline: boolean;
  gundamOffline: boolean;
  hololiveOffline: boolean;
}

export interface gsSQLUser extends gsUser {
  name: string;
  displaypic: string;
  membershipType?: string;
  preferences?: UserPreferences;
}

export interface gsMongoUser extends gsUser {
  crbdecks: DeckRecord[];
  uadecks: DeckRecord[];
  opdecks: DeckRecord[];
  dbzfwdecks: DeckRecord[];
  dmdecks: DeckRecord[];
  gcgdecks: DeckRecord[];
  hocgdecks: DeckRecord[];
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