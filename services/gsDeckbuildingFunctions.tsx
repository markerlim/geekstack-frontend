import { GameCard } from "../interfaces/card.model";
import apiClient from "../utils/apiClient";

export interface Deck {
  deckuid?: string;
  deckname: string;
  deckcover: string; //In leader-based TCG, deckcover is going to be the leader.
  listofcards: GameCard[];
}

export async function saveDeck(deckData: GameCard[], userId: string, tcg: string) {
  try {
    const urlPath = `/user/save/${tcg}/${userId}/deck`
    console.log("Save func trig",urlPath)
    console.log(deckData)
    //const response = await apiClient.post(urlPath, deckData);
    //return response.data;
  } catch (error) {
    console.error('Error saving deck:', error);
    throw error;
  }
}
export async function loadDeck(userId: string, tcg: string): Promise<Deck[]> {
  try {
    const urlPath = `/user/load/${tcg}/${userId}/deck`
    const response = await apiClient.get<Deck[]>(urlPath);
    return response.data;
  } catch (error) {
    console.error('Error loading deck:', error);
    throw error;
  }
}

export function exportDeck() {}
