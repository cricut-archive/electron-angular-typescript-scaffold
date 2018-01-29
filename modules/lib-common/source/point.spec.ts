import { Point } from './point';

describe('Point', () => {
    describe('cstor', () => {
        it('should create a new point', () => {
            const lPoint: Point = new Point(50, 60);
            expect(lPoint.x).toBe(50);
            expect(lPoint.y).toBe(60);
        });
    });

    describe('Subtract', () => {
        it('should find the difference between points', () => {
            const lPoint1: Point = new Point(50, 60);
            const lPoint2: Point = new Point(60, 70);
            const lPoint3: Point = Point.Subtract(lPoint2, lPoint1);

            expect(lPoint3.x).toBe(10);
            expect(lPoint3.y).toBe(10);
        });
    });

    describe('Clone', () => {
        it('should create an independant clone', () => {
            const lPoint: Point = new Point(50, 60);
            const lPoint2 = lPoint.Clone();
            lPoint2.x = 0;
            lPoint2.y = 0;
            expect(lPoint.x).toBe(50);
            expect(lPoint.y).toBe(60);
        });
    });
});
