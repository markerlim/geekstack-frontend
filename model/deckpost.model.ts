export interface MongoDBDeckPost {
  postId?: string;
  postType: string;
  userId: string;
  headline?: string;
  content?: string;
  deckName: string;
  isTournamentDeck: boolean;
  timestamp?: { $date: TimestampValue };
  selectedCover?: string;
  listofcards?: {
    _id: string;
    imageSrc: string;
    cardName: string;
    count: number;
  }[];
  name?: string;
  displaypic?: string;
}

export interface DeckPost extends MongoDBDeckPost {
  listoflikes?: string[];
  listofcomments?: CommentObject[];
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
