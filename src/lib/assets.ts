export const assetPaths = {
  scenes: {
    battle: "/assets/scenes/scene-battle-01.webp",
    map: "/assets/scenes/scene-map-01.webp",
    shop: "/assets/scenes/scene-shop-01.webp",
    rest: "/assets/scenes/scene-rest-01.webp",
    event: "/assets/scenes/scene-event-01.webp"
  },
  characters: {
    player: "/assets/characters/char-player-01.png"
  },
  items: {
    gold: "/assets/items/item-gold-01.png",
    chest: "/assets/items/item-chest-01.png"
  },
  nodes: {
    combat: "/assets/nodes/node-combat-01.png",
    elite: "/assets/nodes/node-elite-01.png",
    event: "/assets/nodes/node-event-01.png",
    shop: "/assets/nodes/node-shop-01.png",
    rest: "/assets/nodes/node-rest-01.png",
    chest: "/assets/nodes/node-chest-01.png",
    boss: "/assets/nodes/node-boss-01.png"
  }
} as const;

export function missingAssetMessage(path: string): string {
  return `缺失 Image2 素材：${path}`;
}
