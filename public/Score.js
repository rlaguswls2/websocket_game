import { sendEvent } from './Socket.js';

class Score {
    score = 0;
    scoreIncrement = 0;
    highScore = 0;
    currentStage = 1000;
    stageChanged = {};

    constructor(ctx, scaleRatio, stageData, itemData, itemController) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.stageData = stageData;
        this.itemData = itemData;
        this.itemController = itemController;

        this.stageData.forEach((stage) => {
            this.stageChanged[stage.id] = false;
        });
    }

    update(deltaTime) {
        const currentStageInfo = this.stageData.find((stage) => stage.id === this.currentStage);
        const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

        this.score += deltaTime * 0.001 * scorePerSecond;
        this.nextStageCheck();
    }

    nextStageCheck() {
        for (let i = 0; i < this.stageData.length; i++) {
            const stage = this.stageData[i];
            if (
                Math.floor(this.score) >= stage.score &&
                !this.stageChanged[stage.id] &&
                stage.id !== 1000
            ) {
                const previousStage = this.currentStage;
                this.currentStage = stage.id;

                this.stageChanged[stage.id] = true;
                sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

                if (this.itemController) {
                    this.itemController.setCurrentStage(this.currentStage);
                }

                break;
            }
        }
    }

    getItem(itemId) {
        const itemInfo = this.itemData.find((item) => item.id === itemId);
        if (itemInfo) {
            this.score += itemInfo.score;
            sendEvent(21, { itemId, timestamp: Date.now() });
        }
    }

    reset() {
        this.score = 0;
        this.currentStage = 1000; // 스테이지 초기화

        /*
        if (typeof this.stageData === 'undefined' || !Array.isArray(stages)) {
            stages = []; // 또는 적절한 초기화 로직
        }*/

        for (let key in this.stageChanged) {
            this.stageChanged[key] = false;
        }

        // 아이템 컨트롤러에 현재 스테이지 설정
        if (this.itemController) {
            this.itemController.setCurrentStage(this.currentStage);
        }
    }

    setHighScore(score) {
        this.highScore = Math.floor(score);
    }

    getScore() {
        return this.score;
    }

    draw() {
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const highScorePadded = this.highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

        this.drawStage();
    }

    drawStage() {
        const stageY = 50 * this.scaleRatio;
        const fontSize = 30 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = 'black';

        const stageText = `Stage ${this.currentStage - 999}`; // 스테이지 번호 계산
        const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

        this.ctx.fillText(stageText, stageX, stageY);
    }
}

export default Score;
