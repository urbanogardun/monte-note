import sanitizeName from './nameSanitizer';

test('sanitizes note name', () => {
    let name = '((*#@boom!';

    let result = sanitizeName(name)

    expect(result).toEqual('((#@boom!');
});
