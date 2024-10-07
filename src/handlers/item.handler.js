import { addItem } from '../models/item.model.js';
import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';

export const handleItemPickup = (userId, payload) => {
    const { items, itemUnlocks } = getGameAssets();
    const { timestamp, itemId } = payload;

    // 아이템 조회
    const item = items.data.find((item) => item.id === itemId);
    if (!item) {
        return { status: 'fail', message: 'Invalid item ID' };
    }

    // 현재 스테이지 조회
    const currentStages = getStage(userId);
    if (!Array.isArray(currentStages) || currentStages.length === 0) {
        return { status: 'fail', message: 'No stages found' };
    }

    if (!currentStages.length) {
        return { status: 'fail', message: 'No stages found' };
    }
    // 가장 뒤가 현재 스테이지 id
    const currentStage = currentStages[currentStages.length - 1].id;

    const allowedItems = itemUnlocks.data.find((stage) => stage.stage_id === currentStage).item_ids;
    if (!allowedItems.includes(itemId)) {
        return { status: 'fail', message: 'Item not allowed in current stage' };
    }

    addItem(userId, { id: itemId, timestamp });
    return { status: 'success', handler: 21 };
};
