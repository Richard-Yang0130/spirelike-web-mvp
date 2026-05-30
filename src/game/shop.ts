import { cardsById, createCardInstance, rewardCardIds } from "../data/cards";
import { relics } from "../data/relics";
import { randomInt } from "../lib/rng";
import type { RunState } from "./types";

export function createShopInventory(run: RunState) {
  let state = run.seed + run.floor * 47;
  const cardIds = new Set<string>();
  while (cardIds.size < 3) {
    const [index, next] = randomInt(state, 0, rewardCardIds.length - 1);
    state = next;
    cardIds.add(rewardCardIds[index]);
  }
  const availableRelics = relics.filter((relic) => !run.relics.includes(relic.id)).slice(0, 3);
  return {
    cards: [...cardIds].map((cardId) => createCardInstance(cardId)),
    relics: availableRelics,
    removePrice: run.relics.includes("merchant-tag") ? 50 : 75
  };
}

export function removeCard(run: RunState, cardUuid: string, price = 75): RunState {
  if (run.gold < price || run.masterDeck.length <= 1) return run;
  return {
    ...run,
    gold: run.gold - price,
    masterDeck: run.masterDeck.filter((card) => card.uuid !== cardUuid)
  };
}

export function getCardPrice(cardId: string): number {
  const rarity = cardsById[cardId].rarity;
  if (rarity === "rare") return 120;
  if (rarity === "uncommon") return 75;
  return 50;
}

export function buyCard(run: RunState, cardUuid: string, inventory: ReturnType<typeof createShopInventory>): RunState {
  const card = inventory.cards.find((item) => item.uuid === cardUuid);
  if (!card) return run;
  const price = getCardPrice(card.cardId);
  if (run.gold < price) return run;
  return { ...run, gold: run.gold - price, masterDeck: [...run.masterDeck, card] };
}

export function buyRelic(run: RunState, relicId: string, price: number): RunState {
  if (run.gold < price || run.relics.includes(relicId)) return run;
  return { ...run, gold: run.gold - price, relics: [...run.relics, relicId] };
}
