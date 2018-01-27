const cheerio = jest.genMockFromModule('cheerio');

let load = function(arg) {
    return function $(arg, blarg) {
        $.html = jest.fn();
        return {each: jest.fn()};
    }
}

cheerio.load = load;

module.exports = cheerio;
