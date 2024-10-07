class Score {
  score = 0;
  scoreIncrement = 0;
  high_score = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageData = stageData

    this.stageData.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }



  update(deltaTime) {
    const currentStageInfo = this.stageData.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond;

    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      // 현재 점수가 스테이지 점수 이상이고, 해당 스테이지로 변경된 적이 없는 경우
      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== 1000
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경됨을 표시
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트 전송
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        // 아이템 컨트롤러에 현재 스테이지 설정
        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        // 스테이지 변경 후 반복문 종료
        break;
      }
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
