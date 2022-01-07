const ROLE = window.ROLE;

class Player {
  constructor(role) {
    this.role = role;
    this.blackPoints = [];
    this.whitePoints = [];
    this.dirs = [
      {
        x: 1,
        y: 0,
        type: "h",
        x2: -1,
        y2: 1,
      },
      {
        x: 0,
        y: 1,
        type: "v",
        x2: 1,
        y2: -1,
      },
      {
        x: 1,
        y: -1,
        type: "t",
        x2: -1,
        y2: -1,
      },
      {
        x: 1,
        y: 1,
        type: "y",
        x2: -1,
        y2: -1,
      },
    ];

    this.valueMap = {
      5: 100000,
      4: 10000,
      3: 1000,
      2: 100,
      1: 10,
    };

    this.onSideMap = {
      4: 1000,
      3: 100,
      2: 10,
    };
  }

  getCheckInfo(checkerBoard) {
    this.blackPoints = checkerBoard.blackPoints;
    this.whitePoints = checkerBoard.whitePoints;
    this.allPoints = checkerBoard.allPoints;
  }

  // 4个方向
  adjustValue(point, role) {
    const { x, y } = point;
    let maxValue = 0;
    const points = role === ROLE.BLACK ? this.blackPoints : this.whitePoints;
    const opPoints = role === ROLE.BLACK ? this.whitePoints : this.blackPoints;

    this.dirs.forEach((d) => {
      let count = 0;
      let dieOneSide = 0;
      let nextX = x;
      let nextY = y;

      while (points[nextX] && points[nextX][nextY]) {
        nextX += d.x;
        nextY += d.y;
        count++;
      }

      if (opPoints[nextX] && opPoints[nextX][nextY]) {
        dieOneSide++;
      }

      nextX = x + d.x * d.x2;
      nextY = y + d.y * d.y2;
      while (points[nextX] && points[nextX][nextY]) {
        nextX += d.x * d.x2;
        nextY += d.y * d.y2;
        count++;
      }

      if (opPoints[nextX] && opPoints[nextX][nextY]) {
        dieOneSide++;
      }

      const value = this.giveWeight(role, count, dieOneSide);
      if (value > maxValue) {
        maxValue = value;
      }
    });

    return maxValue;
  }

  play(role, deep = 1) {
    const { blackPoints, whitePoints, allPoints } = this;
    let best = {
      value: 0,
      x: 0,
      y: 0,
    };

    if (deep > 2) {
      return best;
    }

    for (let i = 0; i < allPoints.length; i++) {
      for (let j = 0; j < allPoints[0].length; j++) {
        if (!blackPoints[i][j] && !whitePoints[i][j]) {
          if (role === ROLE.BLACK) {
            blackPoints[i][j] = true;
          } else {
            whitePoints[i][j] = true;
          }

          const value =
            // this.adjustValue({ x: i, y: j }, role) +
            this.play(-role, deep + 1).value;

          console.log(i, j, "");
          if (role === ROLE.BLACK) {
            blackPoints[i][j] = false;
          } else {
            whitePoints[i][j] = false;
          }

          if (value > best.value) {
            best = {
              x: i,
              y: j,
              value,
            };
          }
        }
      }
    }

    return best;
  }

  giveWeight(role, value, dieOneSide) {
    if (dieOneSide) {
      return this.onSideMap[value] * role;
    }
    return this.valueMap[value] * role;
  }
}

window.Player = Player;
