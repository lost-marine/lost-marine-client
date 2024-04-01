import type { Item } from "@/game/types/item";

export class ItemSprite extends Phaser.Physics.Matter.Sprite {
  itemId: number;
  itemType: number;
  isActive: boolean;

  constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, texture: string, item: Item) {
    super(world, item.centerX, item.centerY, texture);

    scene.add.existing(this);
    this.setSensor(true);
    this.visible = item.isActive;
    this.itemId = item.itemId;
    this.itemType = item.itemType;
  }
}
