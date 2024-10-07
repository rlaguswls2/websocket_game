import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
    let currentStages = getStage(userId);
    // 현재 스테이지가 없는 경우
    if (!currentStages.length) {
        return { status: 'fail', message: 'No stages found for user' };
    }

    // 오름차순 -> 가장 큰 스테이지 id를 확인 <- 유저의 현재 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // 동일한 스테이지로 이동을 요청하는 경우
    if (currentStage.id === payload.targetStage) {
        return { status: 'fail', message: 'Already at target stage' };
    }

    // 현재 스테이지와 요청받은 스테이지가 같은지 검증
    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: 'Current stage mismatch' };
    }

    // 게임 에셋에서 스테이지 정보 가져오기
    const { stages } = getGameAssets();

    // 현재 스테이지 정보를 Game Asset내의 stages에서 가져오기
    const currentStageData = stages.data.find((stage) => stage.id === payload.currentStage);
    if (!currentStageData) {
        return {
            status: 'fail',
            message: `Current stage data not found stage id: ${payload.currentStage}`,
        };
    }

    // 다음 스테이지 정보를 Game Asset내의 stages에서 가져오기
    const targetStageData = stages.data.find((stage) => stage.id === payload.targetStage);
    if (!targetStageData) {
        return {
            status: 'fail',
            message: `Target stage not found stage id: ${payload.currentStage}`,
        };
    }

    // 점수 검증
    const LATENCY_TOLERANCE = 5;
    const serverTime = Date.now(); // 현재 타임 스탬프
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000; // ms
    const goalScore = targetStageData.score - currentStageData.score; // 최소 시간 = 필요 점수(점수는 초당 1점)
    const lateTime = goalScore + LATENCY_TOLERANCE; // 최대 시간 = 필요 점수 + 오차 5초

    // 만약에 1스테이지에서 2스테이지로 넘어가는 과정
    if (elapsedTime < goalScore || elapsedTime > lateTime) {
        return { status: 'fail', message: 'Invalid elapsed time' };
    }

    // 현재 스테이지 검증 통과하고 다음 넘어갈 스테이지도 존재한다면 다음 스테이지로 설정
    setStage(userId, payload.targetStage, serverTime);
    return { status: 'success' };
};
