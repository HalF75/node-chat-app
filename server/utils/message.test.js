const expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});

describe('generateLocationMessage', ()=> {
    it('should generate correct location object', () => {
        var lat = 20;
        var log = 20;
        var url = `https://www.google.com/maps?q=${lat},${log}`
        var locationMessage = generateLocationMessage('Admin', lat, log);
        
        expect(typeof locationMessage.createdAt).toBe('number');
        expect(locationMessage.url).toMatch(url);
    });
});