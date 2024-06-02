import { deleteAsync } from 'del';
import { CONSTS } from './CONSTS';

const { DIST_DEST, DEPLOY_TARGET } = CONSTS;

/**
 * Deletes the contents of the DIST_DEST and DEPLOY_TARGET directories.
 * @returns {Promise<string[]>} A promise that resolves when the directories have been deleted.
 */
function clean() {
  return deleteAsync([DIST_DEST, DEPLOY_TARGET]);
}

export { clean };
