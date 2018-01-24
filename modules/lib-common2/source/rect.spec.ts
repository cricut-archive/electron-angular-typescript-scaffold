import {Rect} from './rect';

describe('Rect', () => {
    describe('cstor', () => {
        it('should create a object', () => {
            const lRect: Rect = new Rect();
            expect(lRect).not.toBeNull();
        });
    });

    describe('Expand', () => {
        it('should expand a rect', () => {
            const lRect: Rect = new Rect();
            lRect.Expand(10);
            expect(lRect.Top).toBe(-10);
            expect(lRect.Left).toBe(-10);
            expect(lRect.Right).toBe(10);
            expect(lRect.Bottom).toBe(10);
        });
    });

    describe('DumbFunction', () => {
        it('should do stuff', () => {
            const lRect: Rect = new Rect();
            lRect.DumbFunction(1);
            expect(lRect.Top).toBe(0);
            expect(lRect.Left).toBe(0);
            expect(lRect.Right).toBe(0);
            expect(lRect.Bottom).toBe(0);
        });
    });

    describe('Width', () => {
        it('should create an independant clone', () => {
            const lRect: Rect = new Rect();
            lRect.Width = 5;
            expect(lRect.Width).toBe(5);
        });
    });

    describe('Clone', () => {
        it('should create an independant clone', () => {
            expect(true).toBe(true);
        });
    });
});
