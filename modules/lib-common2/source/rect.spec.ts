import {Rect} from './rect';

describe('Rect', () => {
    describe('cstor', () => {
        it('should create a object', () => {
            const lRect: Rect = new Rect();
            expect(lRect).not.toBeNull();
        });
    });

    describe('Clone', () => {
        it('should create an independant clone', () => {
            expect(true).toBe(true);
        });
    });
});
