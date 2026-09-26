const LOCKED_ATTR = 'data-tour-locked';

export const lockAllExcept = (selectors: string[]) => {
    document.querySelectorAll(`[${LOCKED_ATTR}]`).forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.pointerEvents = '';
        htmlEl.removeAttribute(LOCKED_ATTR);
    });

    const allowed = new Set<Element>();
    selectors.forEach((sel) => {
        try {
            document.querySelectorAll(sel).forEach((el) => {
                allowed.add(el);
                el.querySelectorAll('*').forEach((child) => allowed.add(child));
            });
        } catch (e) {
            console.warn(`[Tour] invalid selector: ${sel}`, e);
        }
    });

    document.querySelectorAll('body *').forEach((el) => {
        if (allowed.has(el)) return;
        if (el.closest('.tour__popover')) return;

        const htmlEl = el as HTMLElement;
        htmlEl.setAttribute(LOCKED_ATTR, 'true');
        htmlEl.style.pointerEvents = 'none';
    });

    allowed.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeAttribute(LOCKED_ATTR);
        htmlEl.style.pointerEvents = 'auto';
    });

    document.querySelectorAll('.tour__popover, .tour__popover *').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.removeAttribute(LOCKED_ATTR);
        htmlEl.style.pointerEvents = 'auto';
    });

    void document.body.offsetHeight;
};

export const unlockAll = () => {
    document.querySelectorAll(`[${LOCKED_ATTR}]`).forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.pointerEvents = '';
        htmlEl.removeAttribute(LOCKED_ATTR);
    });
};
