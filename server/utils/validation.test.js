const expect = require('expect');
const {isRealString} = require('./../utils/validation');

describe('isRealString', () => {

    it('Should reject non-string values', () => {
        let str = 123;
        expect(isRealString(str)).toBeFalsy();
    });

    it('Should reject string with only spaces', () => {
        let str = "   ";
        expect(isRealString(str)).toBeFalsy();
    });

    it('Should allow string with nospace charaters', () => {
        let str = "  a Lord of the rings";
        expect(isRealString(str)).toBeTruthy();
    });

});