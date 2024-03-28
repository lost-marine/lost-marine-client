import type { Item } from "@/game/types/item";

export class ItemSprite extends Phaser.Physics.Matter.Sprite {
  itemId: number;
  isActive: boolean;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, item: Item) {
    super(world, item.centerX, item.centerY, texture, "itemSprite");

    scene.add.existing(this);
    this.setSensor(true);
    this.itemId = item.itemId;
  }
}
