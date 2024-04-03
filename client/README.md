# :ocean: Lost Marine 로스트마린

> 환경 보호와 생물 다양성을 주제로 전개되는 바다 속 서바이벌 게임

- 멸종위기 해양생물 캐릭터를 조작하여 바다 속을 탐험
- 플랑크톤과 미세 플라스틱을 먹으면서 레벨업 및 체력 관리
- 다른 플레이어와의 전투를 통해 경쟁과 전략적 요소 추가
- 쉬는 동안 게임 내 지식 콘텐츠를 통해 실제 환경 문제에 대한 정보 전달

## 1. 개발 환경

### 세팅

1. [node.js](https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi) 설치
2. vscode 설치
3. 프로젝트 종속성 설치

   client를 실행하고자 하는 경우

   ```bash
   > cd client
   ```

   server를 실행하고자 하는 경우

   ```bash
   > cd server
   ```

   ***

   ```bash
   > npm i -g yarn
   > yarn
   ```

4. `client` 또는 `server` 폴더에 `.env.local` 파일 추가 (현재는 건너뜁니다.)

   ```bash
   추가 예정입니다.
   ```

5. vscode 플러그인 설치

   - ESLint
   - Prettier

6. `ctrl + ,`로 settings 실행 후 Editor: Default Formatter를 prettier로 설정

7. vscode 재실행

### 프로젝트 실행

`lost-marine-client/client or server`에서 실행

```bash
> yarn dev
```

<br />

### Redis 설치

전영빈 도와줘 도커로 알려

## 2.기술 스택

### 공통

- 코드 품질 관리: <img src="https://img.shields.io/badge/Eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white"> <img src="https://img.shields.io/badge/husky-00AFF0?style=for-the-badge&logo=husky&logoColor=white">
- 커뮤니케이션: <img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jirasoftware&logoColor=white"> <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
- 디자인: `Figma`

### 클라이언트

<img src="https://img.shields.io/badge/vue 3.4.20-4FC98D?style=for-the-badge&logo=vue&logoColor=white"> <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/Phaser 3.70.0-C0379A?style=for-the-badge&logo=Phaser&logoColor=white"> <img src="https://img.shields.io/badge/Socket.io 4.7.4-010101?style=for-the-badge&logo=socketdotio&logoColor=white"> <img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">

### 서버

<img src="https://img.shields.io/badge/Node.js 20.11.22-339933?style=for-the-badge&logo=node.js&logoColor=white"> <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> <img src="https://img.shields.io/badge/Redis 7.2.4-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> <img src="https://img.shields.io/badge/Socket.io 4.7.4-010101?style=for-the-badge&logo=socketdotio&logoColor=white">

### 인프라

- 전영빈 도와줘

## 3. 기획, 설계

1. 기획

   [Notion](https://www.notion.so/lost-marine/3edd31758c644c219f2d14edb0b15219?v=936b76e43e77485a97168f25c2c663b7&pvs=4)

   [Figma](https://www.figma.com/file/o3g2PemEaphUiUQ2KzPZN9/Lost-Marine?type=design&node-id=1%3A2&mode=design&t=FLZTB095USgwcUCm-1)

## 기능 설명

|[시작화면](./start.png)|[도움말 화면]("도움말움짤링크")|

시작화면
도움말화면

1. 플랑크톤 섭취
2. 공격
3. 진화
4. 아이템 (애매)
   움짤 짜서 표로 올리고 한 문장으로 설명하면 되지않을까?

<table>
  <tr>
    <td align="center">
      <img src="https://lh3.googleusercontent.com/u/0/drive-viewer/AKGpihZciVd-ncMQSKIEwf8qDOF8tAaneVZu55Su8GKIEk2Wz4lzqD5x5hkg1iUn7h9NDwPlbmSPa7oiQIb0qsYxyEZ1YNbRuw=w2880-h1626" alt="플랑크톤 섭취" />
    </td>
    <td align="center">
      <img src="" alt="미세 플라스틱 섭취" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>플랑크톤 섭취로 경험치를 휙득합니다.</b><br>
    </td>
    <td align="center">
      <b>미세 플라스틱은 플랑크톤과 구분할 수 없습니다!</b> <br />
      <b>아무 일도 일어나지 않지만 게임이 종료되면 미세 플라스틱 섭취수를 확인할 수 있습니다.</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://media.discordapp.net/attachments/1210485902426513452/1225081170560155778/18c52b6b617853e9.gif?ex=661fd4bf&is=660d5fbf&hm=d568884cab4f3b8beb73e83238eba62e7aa40ecb582012e71654a9d56a79027c&=" alt="공격 화면" />
    </td>
    <td align="center">
      <img src="" alt="진화 화면" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>주둥이로 상대를 공격할 수 있습니다.</b><br>
      <b>상대를 처치하면 다량의 경험치를 휙득합니다.</b>
    </td>
    <td align="center">
      <b>진화하여 더욱 강력해집니다.</b>
    </td>
  </tr>
  <tr>
   <td align="center">
      <img src="/img/2.png" alt="아이템 화면" />
   </td>
   <td align="center">
      <img src="https://lh3.google.com/u/0/d/1ComhtsP4M9Swm9P1gxBSooyqn-Nc-yzN=w2410-h1310-iv1" alt="게임 오버 화면" />
     </td>
  </tr>
  <tr>
    <td align="center">
      <b>맵 곳곳에 숨겨진 아이템을 얻으면 좋은 일이 일어납니다!</b>
    </td>
    <td align="center">
      <b>킬 정보, 섭취한 플랑크톤과 미세 플라스틱, 물고기 개체의 멸종 위기 등급 등을 확인할 수 있습니다.</b>
    </td>
  </tr>
</table>

# 기술 설명

## 초기 기술 스택 선정 배경

- 클라이언트 단에서는 `HTML canvas`를 다루는 3가지 프레임워크(`Phaser`, `Pixijs`, `P5.js`)를 두고, 서버 단에서는 3가지 방법(`Spring`, `Node.js`, `python`)를 두고 고민했습니다.
- 2명씩 페어를 이루어 총 3개의 프로토타입을 3일 안에 개발하고, 코드리뷰를 통해 기술을 선정하기로 했습니다.
- 각 기술의 러닝커브, 프로젝트 특성 등에 대한 고민을 거쳐 프론트 단에서는 `Phaser`, 서버 단에서는 `Node.js`를 선택을 선택했습니다.
- 추가적으로 개발 편의성과 안정성을 위해 `Typescript`를 적용했습니다.
- 플레이어 위치 동기화 속도 개선을 위해 `Redis`를 적용했습니다.

## `Vue`와 `Phaser` 간의 데이터 흐름 관리

- 두 가지 이상의 프레임워크를 사용하면서 데이터의 흐름을 체계적으로 관리하고자 노력했습니다.
- `EventBus`(이미 개발된)와 `EventQueue`(개발한)을 활용해 데이터 전달 로직 통일시켰습니다.
  - `EventBus`: 통신 결과 → Vue.js
  - `EventQueue`: 통신 결과 → Phaser Game Scene
- 팀원 모두가 동일한 흐름을 이해하고 개발한 덕분에 코드 리뷰가 용이했습니다.

## R-Tree기반 `RBush` 라이브러리를 이용해 게임 내 개체 관리

- 게임 내 오브젝트인 플랑크톤이 재생성 될 때 현재 맵에 존재하는 플랑크톤 좌표와 겹치면 안 된다는 조건이 있었습니다.
- 반복문으로 현재 맵에 존재하는 플랑크톤 정보를 모두 조회하며 좌표 생성 가능성 검증을 시도하는 것은 비효율적이라고 생각하였습니다.
- `R-Tree`기반의, 영역 데이터 교차 및 충돌 기능을 효율적으로 제공하는 [`RBush`](https://github.com/mourner/rbush) 라이브러리를 사용하여 게임 내 오브젝트인 플랑크톤을 효율적으로 관리했습니다.
