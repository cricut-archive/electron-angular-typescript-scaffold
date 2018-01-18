import {Size} from './size';

describe('Area', () => {
    it('should calculate the area', () => {
        const lSize: Size = new Size();
        lSize.Width = 5;
        lSize.Height = 5;

        expect(lSize.Area).toBe(25);
    });
});
