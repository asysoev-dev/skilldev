import { ref, computed, onMounted } from 'vue';
import { io, Socket } from 'socket.io-client';

interface Notification {
    text: string;
    type: string;
    timestamp: number;
}

const onlineCount = ref(0);
const connected = ref(false);
const notifications = ref<Notification[]>([]);
const ready = ref(false);

let socket: Socket | null = null;

const getSocketUrl = (): string => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
};

export function useWebSocket() {
    const isOnline = computed(() => connected.value);

    const connect = () => {
        if (socket || typeof window === 'undefined') return;

        socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });

        socket.on('connect', () => {
            connected.value = true;
        });

        socket.on('disconnect', () => {
            connected.value = false;
        });

        socket.on('online-users', (count: number) => {
            onlineCount.value = count;
        });

        socket.on('notification', (payload: Notification) => {
            notifications.value = [...notifications.value, payload].slice(-5);
        });
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
            connected.value = false;
        }
    };

    const sendNotification = (text: string, type = 'info') => {
        if (socket && connected.value) {
            socket.emit('broadcast-notification', { text, type });
        }
    };

    const dismissNotification = (timestamp: number) => {
        notifications.value = notifications.value.filter((n) => n.timestamp !== timestamp);
    };

    onMounted(() => {
        if (ready.value) return;
        connect();
        ready.value = true;
    });

    return {
        connected,
        isOnline,
        onlineCount,
        notifications,
        connect,
        disconnect,
        sendNotification,
        dismissNotification,
    };
}
