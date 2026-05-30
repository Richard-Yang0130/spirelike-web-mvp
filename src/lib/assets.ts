export const publicAssetPath = (path: string): string => `${import.meta.env.BASE_URL}assets/${path}`;

export const assetPaths = {
  scenes: {
    battle: publicAssetPath("scenes/scene-battle-01.webp"),
    map: publicAssetPath("scenes/scene-map-01.webp"),
    shop: publicAssetPath("scenes/scene-shop-01.webp"),
    rest: publicAssetPath("scenes/scene-rest-01.webp"),
    event: publicAssetPath("scenes/scene-event-01.webp")
  },
  characters: {
    player: publicAssetPath("characters/char-player-01.png")
  },
  items: {
    gold: publicAssetPath("items/item-gold-01.png"),
    chest: publicAssetPath("items/item-chest-01.png")
  },
  nodes: {
    combat: publicAssetPath("nodes/node-combat-01.png"),
    elite: publicAssetPath("nodes/node-elite-01.png"),
    event: publicAssetPath("nodes/node-event-01.png"),
    shop: publicAssetPath("nodes/node-shop-01.png"),
    rest: publicAssetPath("nodes/node-rest-01.png"),
    chest: publicAssetPath("items/item-chest-01.png"),
    boss: publicAssetPath("nodes/node-boss-01.png")
  }
} as const;

export function missingAssetMessage(path: string): string {
  return `缺失 Image2 素材：${path}`;
}
