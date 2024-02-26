import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    logoTween: Phaser.Tweens.Tween | null;
    startButton: GameObjects.Text;
    nameInput: Phaser.GameObjects.DOMElement | null;
    inputElement: HTMLInputElement;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

        // 이미지의 스케일을 게임의 크기에 맞추기
        // 가로 및 세로 방향으로 필요한 스케일 비율을 계산
        const scaleX = this.cameras.main.width / this.background.width;
        const scaleY = this.cameras.main.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        // 계산된 스케일로 이미지 스케일 설정
        this.background.setScale(scale).setScrollFactor(0);

        this.logo = this.add.image(this.cameras.main.width /2, this.cameras.main.height / 2, 'logo').setDepth(100);

        // nameInput 의 type은 HTMLInputElement 가 되어야 하므로... 잘 맞춰봐요...
        // docuement.createElement('input'); 이 안된다면 타입 가드로 타입을 맞추면 됩니다.
        // name form
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.style.fontSize = '32px';
        this.inputElement.placeholder = 'Enter your name';

        // Phaser DOMElement로 추가
        this.nameInput = this.add.dom(this.cameras.main.width / 2, 600, this.inputElement)
            .setOrigin(0.5, 0.5).setDepth(100);
        
        // 입력 필드에 포커스 주기 (예시)
        // this.nameInput!.focus(); // null check ?. => undefined 체크 !. -> null 체크,  만약 앞이 null이면 . < 이거 연산은 하지 않음

        // // 입력 값 읽기 (예시)
        // this.nameInput!.addEventListener('input', () => {
        //     const name = this.nameInput.value;
        //     console.log(`Name: ${name}`);
        // });

        // 게임시작 버튼 추가
        this.startButton = this.add.text(this.cameras.main.width /2, 550, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setInteractive().setOrigin(0.5).setDepth(100).on('pointerdown', () => this.startGame());

        // 버튼에 마우스 오버/아웃 효과 
        this.startButton.on('pointerover', () => {
            this.startButton.setScale(1.1); // 마우스 오버 시 버튼 확대
        });
        this.startButton.on('pointerout', () => {
            this.startButton.setScale(1.0); // 마우스 아웃 시 버튼 원래 크기로
        })

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    startGame() {
        const nickname = "서히";
        if( nickname.length > 0 ) {
            EventBus.emit('start-game',nickname) // src/game/PhaserGame.vue 에서  EventBus.on() 으로 emit을 수신
        }else {
            window.alert("이름을 입력해주세요.")
        }
    }
}
