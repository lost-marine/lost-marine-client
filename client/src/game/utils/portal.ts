export type Portal = {
  portalId: number;
  connectedPortalId: number;
  xRange: [number, number];
  yRange: [number, number];
  xPortalCenter: number;
  yPortalCenter: number;
  exitPosition: [number, number];
};
export const portalList: Portal[] = [
  {
    portalId: 0,
    connectedPortalId: 1,
    xRange: [2644, 2849],
    yRange: [1611, 1780],
    get xPortalCenter() {
      return (this.xRange[0] + this.xRange[1]) / 2 + 10;
    },
    get yPortalCenter() {
      return (this.yRange[0] + this.yRange[1]) / 2 + 40;
    },
    exitPosition: [2500, 1443]
  },
  {
    portalId: 1,
    connectedPortalId: 0,
    xRange: [4966, 5184],
    yRange: [4585, 4754],
    get xPortalCenter() {
      return (this.xRange[0] + this.xRange[1]) / 2 - 10;
    },
    get yPortalCenter() {
      return (this.yRange[0] + this.yRange[1]) / 2 + 15;
    },
    exitPosition: [5586, 4525]
  },
  {
    portalId: 2,
    connectedPortalId: 3,
    xRange: [532, 760],
    yRange: [4299, 4467],
    get xPortalCenter() {
      return (this.xRange[0] + this.xRange[1]) / 2 + 70;
    },
    get yPortalCenter() {
      return (this.yRange[0] + this.yRange[1]) / 2 + 50;
    },
    exitPosition: [700, 4150]
  },
  {
    portalId: 3,
    connectedPortalId: 2,
    xRange: [4900, 5186],
    yRange: [333, 482],
    get xPortalCenter() {
      return (this.xRange[0] + this.xRange[1]) / 2 + 20;
    },
    get yPortalCenter() {
      return (this.yRange[0] + this.yRange[1]) / 2 + 50;
    },
    exitPosition: [5037, 120]
  }
];

export const checkPortal = (x: number, y: number): [number, number] | undefined => {
  for (let i = 0; i < portalList.length; i++) {
    const portal = portalList[i];
    if (portal.xRange[0] < x && x < portal.xRange[1] && portal.yRange[0] < y && y < portal.yRange[1]) {
      return portalList[portal.connectedPortalId].exitPosition;
    }
  }
};
