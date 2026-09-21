import type { Router } from 'vue-router';

let instance: Router | null = null;

export const setRouterInstance = (router: Router) => {
    instance = router;
};

export const getRouterInstance = (): Router | null => instance;
