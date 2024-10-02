import { getGameAssets } from '../init/assets.js';
import { setStage, getStage, clearStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
    // 스테이지에 정보 넣어주기, 접속하자 마자 시작
    const { stages } = getGameAssets();

    // stage 초기화
    clearStage(uuid);

    // stages 배열에서 0번째 = 첫번째 스테이지
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage:', getStage(uuid));

    return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
    // 게임 종료시 타임스탬프와 점수
    const { timestamp: gameEndTime, score } = payload;

    const stages = getStage(uuid);

    if (!stages.length) {
        return { status: 'fail', message: 'No stages found for user' };
    }

    const { stages: stageAssets } = getGameAssets();

    // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
    let totalScore = 0;
    stages.forEach((stage, index) => {
        let stageEndTime;

        // 마지막 스테이지라면
        if (index === stages.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }

        const stageDuration = (stageEndTime - stage.timestamp) / 1000;

        const currentStageAsset = stageAssets.data.find((s) => s.id === stage.id);
        if (currentStageAsset) {
            const scorePerSecond = currentStageAsset.scorePerSecond;
            totalScore += stageDuration * scorePerSecond;
        }
    });

    // 점수와 타임 스탬프 검증
    if (Math.abs(score - totalScore) > 5) {
        return { status: 'fail', message: 'Score verification failed' };
    }
    return { status: 'success', message: 'Game ended successfully', score };
};
