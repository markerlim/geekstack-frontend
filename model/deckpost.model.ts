export interface DeckPost {
  postId?: string;
  postType: string;
  userId: string;
  headline?: string;
  content?: string;
  deckName: string;
  isTournamentDeck: boolean;
  timestamp?: { $date: TimestampValue };
  selectedCards: {
    imageSrc: string;
  }[];
  listofcards: {
    _id: string;
    imageSrc: string;
    cardName: string;
    count: number;
  }[];
  listoflikes: string[]; // assuming userId strings
  listofcomments: CommentObject[];
  name?: string;
  displaypic?: string;
}

export interface CommentObject {
  commentId: string;
  comment: string;
  userId: string;
  timestamp: { $date: TimestampValue };
  name: string;
  displaypic: string;
}

type TimestampValue = string | BSONDateArray;

type BSONDateArray = [number, number, number, number, number, number, number];

export interface SubmitComment {
  postId: string;
  posterId: string;
  comment: string;
}
