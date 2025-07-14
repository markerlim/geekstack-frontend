import { GameCard } from "../../model/card.model";
import { Deck } from "../../model/deck.model";
import apiClient from "../../utils/apiClient";

/**
 * Function for saving deck by TCG and User. Data will be appended to the respective listof[tcg] in mongoDB
 * [tcg] refers to for example listofuadecks or listofopdecks
 * @param deck 
 * @param tcg 
 * @returns 
 */
export async function saveDeck(deck:Deck, tcg: string) {
  try {
    let urlPath = `/user/save/${tcg}`
    if(deck.deckuid){
      urlPath += `?deckuid=${deck.deckuid}`
    }
    const response = await apiClient.post(urlPath, deck);
    return response.data;
  } catch (error) {
    console.error('Error saving deck:', error);
    throw error;
  }
}

/**
 * Function for loading deck by TCG and User. Data will be taken from listof[tcg] field.
 * [tcg] refers to for example listofuadecks or listofopdecks
 * @param tcg 
 * @returns 
 */
export async function loadDeck(tcg: string): Promise<Deck[]> {
  try {
    const urlPath = `/user/load/${tcg}`
    const response = await apiClient.get<Deck[]>(urlPath);
    return response.data;
  } catch (error) {
    console.error('Error loading deck:', error);
    throw error;
  }
}

export async function deleteDeck(tcg: string,deckuid:string) {
  try {
    const urlPath = `/user/delete/${tcg}/deck/${deckuid}`
    const response = await apiClient.delete(urlPath);
    return response.data;
  } catch (error) {
    console.error('Error loading deck:', error);
    throw error;
  }
}

export function exportDeck() {}
