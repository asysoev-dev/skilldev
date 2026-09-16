import { defineStore } from 'pinia';

export const useSettingsPopover = defineStore('settingsPopover', {
    state: () => ({
        isOpen: false,
    }),
    actions: {
        open() {
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
        toggle() {
            this.isOpen = !this.isOpen;
        },
    },
});
