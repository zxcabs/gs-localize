const expect = require('chai').expect;
const stringify = require('./stringify');

describe('stringify', () => {
  it('should return sortable', () => {
    const result = stringify({ b: 1, a: 2, c: 3 });

    expect(result).to.equal(
      '{\r\n' +
      '  "a": 2,\r\n' +
      '  "b": 1,\r\n' +
      '  "c": 3\r\n' +
      '}'
    )
  });

  it('should sortable on deep', () => {
    const result = stringify({
      b: 1,
      a: {
        d: {
          c: 'a.d.c',
          b: 'a.d.b'
        },
        c: 2,
        a: {
          a: 'a.a.a'
        }
      }
    });

    expect(result).to.equal([
      '{',
      '  "a": {',
      '    "a": {',
      '      "a": "a.a.a"',
      '    },',
      '    "c": 2,',
      '    "d": {',
      '      "b": "a.d.b",',
      '      "c": "a.d.c"',
      '    }',
      '  },',
      '  "b": 1',
      '}'
    ].join('\r\n'));
  });
});
