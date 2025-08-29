import { Deck, DeckRecord, LightDeck } from "../../model/deck.model";
import apiClient from "../../utils/apiClient";

/**
 * Function for saving deck by TCG and User. Data will be appended to the respective listof[tcg] in mongoDB
 * [tcg] refers to for example listofuadecks or listofopdecks
 * @param deck
 * @param tcg
 * @returns
 */
export async function saveDeck(deck: Deck, tcg: string) {
  try {
    const newDeck: DeckRecord = {
      deckuid: deck.deckuid,
      deckname: deck.deckname, // Note: different property name
      deckcover: deck.deckcover, // Note: different property name
      listofcards: deck.listofcards.map((card) => ({
        _id: card._id,
        cardName: card.cardName,
        count: card.count,
      })),
    };

    let urlPath = `/user/save/${tcg}`;
    if (deck.deckuid) {
      urlPath += `?deckuid=${deck.deckuid}`;
    }
    const response = await apiClient.post(urlPath, newDeck);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error:any) {
    console.error("Error saving deck:", error);
     if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
  }
}

/**
 *
 * @param tcg
 * @returns
 */
export async function loadDeck(tcg: string): Promise<DeckRecord[]> {
  try {
    const urlPath = `/user/load/${tcg}`;
    const response = await apiClient.get<DeckRecord[]>(urlPath);
    return response.data;
  } catch (error) {
    console.error("Error loading deck:", error);
    throw error;
  }
}

/**
 *
 * @param tcg
 * @param deckuid
 * @returns
 */
export async function loadOneDeck(tcg: string, deckuid: string): Promise<Deck> {
  try {
    const urlPath = `/user/load/${tcg}/${deckuid}`;
    const response = await apiClient.get<Deck>(urlPath);
    return response.data;
  } catch (error) {
    console.error("Error loading deck:", error);
    throw error;
  }
}

export async function deleteDeck(tcg: string, deckuid: string) {
  try {
    const urlPath = `/user/delete/${tcg}/deck/${deckuid}`;
    const response = await apiClient.delete(urlPath);
    return response.data;
  } catch (error) {
    console.error("Error loading deck:", error);
    throw error;
  }
}

export function exportDeck() {}
