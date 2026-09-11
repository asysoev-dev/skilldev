export interface Planet {
    id: string;
    size: 'big' | 'small';
    speed: number;
    axis: 'x' | 'y' | 'both';
}

export interface Star {
    id: number;
    size: number;
    top: number;
    left: number;
    speed: number;
    axis: 'x' | 'y' | 'both';
}

export const planets: Planet[] = [
    { id: 'planet-big', size: 'big', speed: -2, axis: 'both' },
    { id: 'planet-small', size: 'small', speed: 3, axis: 'both' },
];

export const stars: Star[] = [
    { id: 1, size: 2, top: 10, left: 5, speed: -4, axis: 'x' },
    { id: 2, size: 4, top: 5, left: 25, speed: 5, axis: 'y' },
    { id: 3, size: 3, top: 15, left: 55, speed: -6, axis: 'x' },
    { id: 4, size: 5, top: 8, left: 75, speed: 4, axis: 'y' },
    { id: 5, size: 2, top: 2, left: 90, speed: -5, axis: 'x' },
    { id: 6, size: 3, top: 30, left: 10, speed: 7, axis: 'both' },
    { id: 7, size: 6, top: 40, left: 30, speed: -3, axis: 'y' },
    { id: 8, size: 2, top: 35, left: 50, speed: 2, axis: 'x' },
    { id: 9, size: 4, top: 50, left: 70, speed: -7, axis: 'both' },
    { id: 10, size: 3, top: 25, left: 85, speed: 4, axis: 'y' },
    { id: 11, size: 5, top: 60, left: 5, speed: -5, axis: 'x' },
    { id: 12, size: 2, top: 70, left: 20, speed: 3, axis: 'y' },
    { id: 13, size: 4, top: 65, left: 45, speed: -4, axis: 'both' },
    { id: 14, size: 2, top: 80, left: 60, speed: 6, axis: 'x' },
    { id: 15, size: 5, top: 55, left: 80, speed: -6, axis: 'y' },
    { id: 16, size: 3, top: 85, left: 40, speed: 5, axis: 'both' },
    { id: 17, size: 4, top: 90, left: 70, speed: -2, axis: 'x' },
    { id: 18, size: 2, top: 95, left: 15, speed: 4, axis: 'y' },
    { id: 19, size: 6, top: 75, left: 95, speed: -7, axis: 'both' },
    { id: 20, size: 3, top: 45, left: 95, speed: 3, axis: 'x' },
];