import { expect } from 'chai';
import { errorHandler, setErrorShown } from './errorHandler';
import nodeNotifier from 'node-notifier';

import createError from 'http-errors';
import { spy, stub, replaceGetter, replace } from 'sinon';

describe('errorHandler', () => {
  const mockError = createError(500, {
    name: 'Test error',
    message: 'test',
    fileName: 'test.js',
    plugin: 'test-plugin'
  });
  const mockNotifyFunction = spy();
  const consoleSpy = spy();
  const stubNotify = stub().returns(mockNotifyFunction);

  /**
   * Creates a mock notification object with a spy method for the `notify` function.
   * @returns {object} The mock notification object with a spy method for the `notify` function.
   */

  replace(console, 'error', consoleSpy);

  replaceGetter(nodeNotifier, 'notify', stubNotify);

  afterEach(() => {
    setErrorShown(false);
    consoleSpy.resetHistory();
    mockNotifyFunction.resetHistory();
  });
  it('has arity of 1', () => {
    expect(errorHandler.length).to.eq(1);
  });

  it('is only called once', () => {
    errorHandler(mockError);
    errorHandler(mockError);
    expect(consoleSpy.calledOnce).to.eq(true);
    expect(mockNotifyFunction.calledOnce).to.eq(true);
  });

  it('Console is called with the correct arguments', () => {
    errorHandler(mockError);

    expect(
      consoleSpy.calledWithMatch(
        mockError.name,
        mockError.message,
        mockError.fileName,
        mockError.plugin
      )
    ).to.eq(true);
  });

  it('Notify is called with the correct arguments', () => {
    errorHandler(mockError);

    expect(
      mockNotifyFunction.calledWithMatch({
        message: `Error: ${mockError.message}`,
        title: 'Gulp HTML Build'
      })
    ).to.eq(true);
  });
});
