import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { DIRECTION } from "@/game/constants/direction";
import type { DirectionType } from "@/game/types/direction";
import { getDirection } from "../utils/calcs/getDirection";
import { directionToAngleFlip } from "../utils/calcs/directionToAngleFlip";
import g from "../utils/global";
import { PlayerSprite } from "../services/player/classes";
import type { Player } from "../types/player";
import _ from "lodash";
import { syncMyPosition } from "../services/player/feat/movement";
import { getPlayerByPlayerId } from "../utils/getters/getPlayer";
import type { PlayerPositionInfo } from "../services/player/types/position";

export class Game extends Scene {
  player: PlayerSprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  platform: Phaser.GameObjects.Image;
  direction: DirectionType;
  playerList: PlayerSprite[];
  isMoving: boolean;
  constructor() {
    super("Game");
  }

  preload(): void {
    this.load.spritesheet("sunfish", "assets/Sunfish_move.png", {
      frameWidth: 192,
      frameHeight: 192
    });
    this.load.image("platform", "assets/bg.png");
  }

  create(): void {
    this.platform = this.physics.add.staticImage(0, 0, "platform").setOrigin(0, 0).refreshBody();
    this.playerList = [];
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("sunfish", {
        start: 0,
        end: 1
      }),
      frameRate: 3,
      repeat: -1
    });

    // 플레이어 스프라이트를 추가합니다.
    if (g.myInfo !== null) {
      g.playerList.forEach((player) => {
        const newPlayer = this.addPlayer(player);
        if (g.myInfo?.playerId === newPlayer.playerId) {
          this.player = newPlayer;
        }
      });
    }

    // 카메라 뷰를 관리합니다.
    this.cameras.main.setBounds(0, 0, 2688, 1536, true);
    this.physics.world.setBounds(0, 0, 2688, 1536);
    // 카메라의 움직임의 부드러운 정도는 startFollow의 3,4번째 인자인 lerp(보간) 값(0~1)을 조정하여 바꿀 수 있습니다.
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    // 커서 키를 생성합니다.
    if (this.input?.keyboard !== null) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    EventBus.emit("current-scene-ready", this);

    this.direction = DIRECTION.RIGHT;
    EventBus.emit("player-moved", this.player.x, this.player.y, this.direction);
  }

  update(): void {
    // moveSpeed는 정수여야 합니다.
    this.handleSocketEvent();
    const moveSpeed = 10;

    const { direction, directionX, directionY } = getDirection(this.player.playerSprite.flipX, this.cursors);
    const { angle, shouldFlipX } = directionToAngleFlip(direction, this.player.playerSprite.flipX);

    this.direction = direction;
    this.player.playerSprite.setFlipX(shouldFlipX);
    this.player.playerSprite.angle = angle;
    this.player.x += moveSpeed * directionX;
    this.player.y += moveSpeed * directionY;

    const isArrowKeyPressed =
      this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;
    // 플레이어가 움직일 때만 움직임 결과를 처리합니다.
    if (isArrowKeyPressed || this.isMoving) {
      this.sendSyncPosition();
      // 움직임 상태 여부를 동기화합니다.
      if (isArrowKeyPressed) {
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }
    }
  }

  // 플레이어 추가

  addPlayer(playerInfo: Player): PlayerSprite {
    const newPlayer = new PlayerSprite(this, "sunfish", playerInfo);
    this.playerList.push(newPlayer);
    return newPlayer;
  }

  sendSyncPosition = _.throttle(() => {
    syncMyPosition({
      playerId: this.player.playerId,
      startX: this.player.x,
      startY: this.player.y,
      direction: this.direction,
      isFlipX: this.player.playerSprite.flipX
    });
  }, 30);

  handleSocketEvent(): void {
    while (g.eventQueue.length > 0) {
      const event = g.eventQueue.dequeue();
      switch (event.key) {
        case "player-entered":
          this.onReceivedEnter(event.data as Player);
          break;
        case "others-position-sync":
          this.onReceviedPositionSync(event.data as PlayerPositionInfo[]);
          break;
      }
    }
  }

  onReceivedEnter(newPlayer: Player): void {
    if (newPlayer.playerId !== g.myInfo?.playerId) {
      this.addPlayer(newPlayer);
    }
  }

  onReceviedPositionSync(positionsInfo: PlayerPositionInfo[]): void {
    positionsInfo.forEach((player) => {
      const targetPlayer = getPlayerByPlayerId(player.playerId);
      const targetPlayerSprite = this.playerList.find((target) => target.playerId === player.playerId);
      if (targetPlayer !== null && targetPlayerSprite !== undefined && targetPlayerSprite.playerId !== g.myInfo?.playerId) {
        targetPlayerSprite.x = player.startX;
        targetPlayerSprite.y = player.startY;
        const { angle, shouldFlipX } = directionToAngleFlip(player.direction, targetPlayer.isFlipX ?? false);

        targetPlayer.isFlipX = shouldFlipX;
        targetPlayerSprite.playerSprite.angle = angle;
        targetPlayerSprite.playerSprite.setFlipX(shouldFlipX);
      }
    });
  }

  changeScene(): void {
    this.scene.start("GameOver");
  }
}
