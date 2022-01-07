const ROLE = window.ROLE;
const Player = window.Player;

function genArray(HLines, VLines) {
  return new Array(HLines).fill(new Array(VLines).concat());
}

class CheckerBoard {
  constructor(HLines, VLines, container) {
    this.whitePoints = genArray(HLines, VLines);
    this.blackPoints = genArray(HLines, VLines);
    this.allPoints = genArray(HLines, VLines);

    this.player1 = new Player(ROLE.BLACK);
    this.player2 = new Player(ROLE.WHITE);

    this.player1.getCheckInfo(this);
    this.player2.getCheckInfo(this);

    this.gap = 20;
    this.ctx = null;
    this.initCanvas(container);
    this.generateBoard();
  }

  initCanvas(container) {
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 800;

    container?.appendChild(c);

    this.ctx = c.getContext("2d");
  }

  async main() {
    setInterval(() => {
      const { x: x1, y: y1 } = this.player1.play(this.player1.role);
      this.setPoint(x1, y1, this.player1);
      console.log(this.player1, x1, y1);

      const { x: x2, y: y2 } = this.player2.play(this.player2.role);
      this.setPoint(x2, y2, this.player2);
      console.log(this.player2, x2, y2);
    }, 200);
  }

  setPoint(x, y, player) {
    if (player.role === ROLE.BLACK) {
      this.blackPoints[x][y] = true;
    }

    if (player.role === ROLE.WHITE) {
      this.whitePoints[x][y] = true;
    }

    this.drawPoint(x, y, player.role);
  }

  generateBoard() {
    const { allPoints, ctx, gap } = this;
    let x = gap,
      y = gap,
      xDistance = (allPoints.length - 1) * gap;

    ctx.lineWidth = 1;
    ctx.fillStyle = "#000000";

    for (let i = 0; i < allPoints.length; i++) {
      y = i * gap + gap;
      ctx.moveTo(x, y);
      ctx.lineTo(x + xDistance, y);
    }

    y = gap;
    for (let i = 0; i < allPoints[0].length; i++) {
      x = i * gap + gap;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + xDistance);
    }

    ctx.stroke();
  }

  drawPoint(i, j, role) {
    const { gap, ctx } = this;
    ctx.beginPath();
    ctx.arc(i * gap + gap, j * gap + gap, 10, 0, Math.PI * 2);
    ctx.fillStyle = role === ROLE.BLACK ? "#000" : "#dbfd8c";
    ctx.closePath();
    ctx.fill();
  }
}

const el = document.querySelector(".board");
const game = new CheckerBoard(19, 19, el);
game.main();
console.log(game, "game");
