import { tagTypes } from '@/redux/tag-types';

export const normalizeTags = (tags?: tagTypes | tagTypes[]): { type: tagTypes }[] => {
    if (Array.isArray(tags)) {
        return tags.map((tag) => ({ type: tag }));
    }
    if (tags) {
        return [{ type: tags }];
    }
    return [];
};
