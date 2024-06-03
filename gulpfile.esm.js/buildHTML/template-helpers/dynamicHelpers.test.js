import { expect } from 'chai';
import { getDynamicHelpers } from './dynamicHelpers';
import { CONSTS } from '../../CONSTS';

import { useFakeTimers } from 'sinon';

const { VERSION } = CONSTS;

const mockData = {
  data: {
    file: {
      relative: 'test'
    }
  }
};

describe('dynamicHelpers', () => {
  beforeEach(function () {
    // eslint-disable-next-line no-magic-numbers
    this.clock = useFakeTimers(149472000000);
  });

  afterEach(function () {
    this.clock.restore();
  });
  it('has an arity of one', () => {
    expect(getDynamicHelpers.length).to.eq(1);
  });

  it('returns an object for a locale', () => {
    expect(getDynamicHelpers('en')).to.be.an('object');
  });

  it('returns the correct locale', () => {
    expect(getDynamicHelpers('en').locale).to.eq('en');
    expect(getDynamicHelpers('de').locale).to.eq('de');
  });

  it('when set to an unavailable locale, returns the default ‘en’ locale', () => {
    expect(getDynamicHelpers('br').locale).to.eq('en');
  });

  describe('methods', () => {
    it('getLocaleString returns the locale string', () => {
      expect(getDynamicHelpers('en').getLocaleStr()).to.eq('en');
    });

    it('getLocale for ‘en’ returns the locale url prefix ‘/’', () => {
      expect(getDynamicHelpers('en').getLocale()).to.eq('/');
    });

    it('getLocale for ‘de’ returns the locale url prefix ‘/de/’', () => {
      expect(getDynamicHelpers('de').getLocale()).to.eq('/de/');
    });

    it('path for ‘en’ returns the locale url prefix ‘/’', () => {
      expect(
        getDynamicHelpers('en').path('/de/test/test.html', mockData)
      ).to.eq('de/test/test.html');
    });

    it('path for ‘de’ returns the locale url prefix ‘/de/’', () => {
      expect(getDynamicHelpers('de').path('/test/test.html', mockData)).to.eq(
        'test/test.html'
      );
    });

    it('imagepath for ‘en’ returns the locale url prefix ‘/’', () => {
      expect(getDynamicHelpers('en').imagepath('cat.gif', mockData)).to.eq(
        `/${VERSION}/images/cat.gif`
      );
    });

    it('imagepath for ‘de’ returns the locale url prefix ‘/de/’', () => {
      expect(getDynamicHelpers('de').imagepath('cat.gif', mockData)).to.eq(
        `/../${VERSION}/images/cat.gif`
      );
    });

    it('buildDate for ‘en’ returns the date in the format ‘DD. Mon. YYYY, HH:mm:ss’', () => {
      expect(getDynamicHelpers('en').buildDate).to.eq(
        'Sep 27, 1974, 1:00:00 AM'
      );
    });

    it('buildDate for ‘de’ returns the date in the format ‘DD. Mon. YYYY, HH:mm:ss’', () => {
      expect(getDynamicHelpers('de').buildDate).to.eq(
        '27. Sept. 1974, 01:00:00'
      );
    });

    it('__ for ‘de’ returns the correct string “Datum/Uhrzeit des Builds”', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('de').__('welcome.time')).to.eq(
        'Datum/Uhrzeit des Builds'
      );
    });

    it('__ for ‘en’ returns the correct string “Build date/time”', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('en').__('welcome.time')).to.eq(
        'Build date/time'
      );
    });

    it('__n for ‘de’ returns the correct string “1 Katze 2 Katzen”', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('de').__n('%s Katze', '%s Katzen', 1)).to.eq(
        '1 Katze'
      );

      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('de').__n('%s Katze', '%s Katzen', 2)).to.eq(
        '2 Katzen'
      );
    });

    it('__n for ‘en’ returns the correct string “1 cat 2 cats”', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('en').__n('%s cat', '%s cats', 1)).to.eq(
        '1 cat'
      );

      // eslint-disable-next-line no-underscore-dangle
      expect(getDynamicHelpers('en').__n('%s cat', '%s cats', 2)).to.eq(
        '2 cats'
      );
    });
  });
});
