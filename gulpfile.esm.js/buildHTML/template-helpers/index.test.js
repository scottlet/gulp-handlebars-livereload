import { expect } from 'chai';
import {
  getStaticHelpers,
  getDynamicHelpers,
  pathBuilder,
  imagePathBuilder,
  getStem,
  renameFile,
  errorHandler,
  setErrorShown
} from '.';

describe('template-helpers', () => {
  describe('index', () => {
    it('exports should all exist', () => {
      expect(getStaticHelpers).to.be.a('function');
      expect(getDynamicHelpers).to.be.a('function');
      expect(pathBuilder).to.be.a('function');
      expect(imagePathBuilder).to.be.a('function');
      expect(getStem).to.be.a('function');
      expect(renameFile).to.be.a('function');
      expect(errorHandler).to.be.a('function');
      expect(setErrorShown).to.be.a('function');
    });
  });
});
