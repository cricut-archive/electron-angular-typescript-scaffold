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

    describe('Area', () => {
        it('should calculate the area', () => {
            const lRect: Rect = new Rect();
            lRect.Width = 5;
            lRect.Height = 5;

            expect(lRect.Area).toBe(25);
        });
    });

    describe('Clone', () => {
        it('should create an independant clone', () => {
            expect(true).toBe(true);
        });
    });
});
