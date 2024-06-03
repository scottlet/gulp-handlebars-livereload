import { expect } from 'chai';
import { getStaticHelpers } from './staticHelpers';
import { CONSTS } from '../../CONSTS';

import { useFakeTimers, spy } from 'sinon';

const { VERSION, NAME, HOST, PATH, NODE_ENV } = CONSTS;

const staticHelpers = getStaticHelpers();

describe('staticHelpers', () => {
  const mockHandles = {
    fn: spy(),
    inverse: spy()
  };

  beforeEach(function () {
    // eslint-disable-next-line no-magic-numbers
    this.clock = useFakeTimers(149472000000);
  });

  afterEach(function () {
    this.clock.restore();
    mockHandles.fn.resetHistory();
    mockHandles.inverse.resetHistory();
  });
  describe('uc', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.uc.length).to.eq(1);
    });

    it('uppercases ‘me’', () => {
      expect(staticHelpers.uc('me')).to.eq('ME');
    });
  });

  describe('capitalise', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.capitalise.length).to.eq(1);
    });

    it('uppercases ‘me’', () => {
      expect(staticHelpers.capitalise('me')).to.eq('ME');
    });
  });

  describe('lc', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.lc.length).to.eq(1);
    });

    it('lowercases ‘ME’', () => {
      expect(staticHelpers.lc('ME')).to.eq('me');
    });
  });

  describe('num', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.str.length).to.eq(1);
    });

    it('make a string out of 1', () => {
      expect(staticHelpers.str(1)).to.eq('1');
    });
  });

  describe('inc', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.inc.length).to.eq(1);
    });

    it('Increments the number passed by 1', () => {
      expect(staticHelpers.inc(1)).to.eq(2);
    });
  });

  describe('concat', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.concat.length).to.eq(0);
    });

    it('Concats the strings together', () => {
      expect(staticHelpers.concat('My', 'cat', 'likes', 'you')).to.eq(
        'Mycatlikesyou'
      );
    });
  });

  describe('raw', () => {
    it('has an arity of 1', () => {
      expect(staticHelpers.raw.length).to.eq(1);
    });

    it('Outputs the results of executing the function', () => {
      /**
       * A function that returns the string 'hi'.
       * @returns {string} The string 'hi'.
       */
      function dummyFn() {
        return 'hi';
      }

      expect(staticHelpers.raw({ fn: dummyFn })).to.eq('hi');
    });
  });

  describe('q', () => {
    const testVal = 'wrap&me=two';

    it('has an arity of 1', () => {
      expect(staticHelpers.q.length).to.eq(1);
    });

    it('Outputs the results of handlebars.safestring', () => {
      expect(staticHelpers.q(testVal).toString()).to.eq(`'${testVal}'`);
    });
  });

  describe('eq', () => {
    const testVal = 'hello';

    it('has an arity of 3', () => {
      expect(staticHelpers.eq.length).to.eq(3);
    });

    it('calls fn str == str', () => {
      staticHelpers.eq(testVal, 'hello', mockHandles);
      expect(mockHandles.fn.calledOnce).to.eq(true);
      expect(mockHandles.inverse.calledOnce).to.eq(false);
    });

    it('calls fn num == str', () => {
      staticHelpers.eq(1, '1', mockHandles);
      expect(mockHandles.fn.calledOnce).to.eq(true);
      expect(mockHandles.inverse.calledOnce).to.eq(false);
    });

    it('calls inverse str != str', () => {
      staticHelpers.eq(testVal, 'goodbye', mockHandles);
      expect(mockHandles.fn.calledOnce).to.eq(false);
      expect(mockHandles.inverse.calledOnce).to.eq(true);
    });

    it('calls inverse num != str', () => {
      staticHelpers.eq(1, '2', mockHandles);
      expect(mockHandles.fn.calledOnce).to.eq(false);
      expect(mockHandles.inverse.calledOnce).to.eq(true);
    });
  });

  describe('prev', () => {
    it('has an arity of 2', () => {
      expect(staticHelpers.prev.length).to.eq(2);
    });

    it('Outputs the number -1', () => {
      expect(staticHelpers.prev(2, 2).toString()).to.eq('1');
    });

    it('Outputs the number -1 unless number === 0 in which case outputs total', () => {
      expect(staticHelpers.prev(1, 2).toString()).to.eq('2');
    });
  });

  describe('next', () => {
    it('has an arity of 2', () => {
      expect(staticHelpers.next.length).to.eq(2);
    });

    it('Outputs the number +1', () => {
      expect(staticHelpers.next(1, 2).toString()).to.eq('2');
    });

    it('Outputs the number +1 unless number > total in which case outputs 1', () => {
      expect(staticHelpers.next(2, 2).toString()).to.eq('1');
    });
  });

  describe('times', () => {
    it('has an arity of 2', () => {
      expect(staticHelpers.times.length).to.eq(2);
    });
  });

  describe('hostname', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.hostname.length).to.eq(0);
    });

    it('returns the hostname', () => {
      expect(staticHelpers.hostname()).to.eq(HOST);
    });
  });

  describe('hostpath', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.hostpath.length).to.eq(0);
    });

    it('returns the hostpath', () => {
      expect(staticHelpers.hostpath()).to.eq(PATH);
    });
  });

  describe('production', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.production.length).to.eq(0);
    });

    it('returns true if running in production, false if not', () => {
      expect(staticHelpers.production()).to.eq(NODE_ENV === 'production');
    });
  });

  describe('name', () => {
    it('returns name from package.json', () => {
      expect(staticHelpers.name).to.eq(NAME);
    });
  });
  describe('version', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.version.length).to.eq(0);
    });

    it('returns version from package.json', () => {
      expect(staticHelpers.version()).to.eq(VERSION);
    });
  });

  describe('datestamp', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.datestamp.length).to.eq(0);
    });

    it('returns datestamp for now', () => {
      expect(staticHelpers.datestamp()).to.eq(Date.now());
    });
  });
});
