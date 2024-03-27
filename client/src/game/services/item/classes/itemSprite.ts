import type { Item } from "@/game/types/item";

export class ItemSprite extends Phaser.Physics.Matter.Sprite {
  itemId: number;
  isActive: boolean;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, item: Item) {
    super(world, item.centerX, item.centerY, "itemSprite");

    scene.add.existing(this);
    this.setStatic(true);
  }
}
