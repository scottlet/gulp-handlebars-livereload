import { deleteAsync } from 'del';
import { CONSTS } from './CONSTS';

const { DIST_DEST, DEPLOY_TARGET } = CONSTS;

function clean() {
    return deleteAsync([DIST_DEST, DEPLOY_TARGET]);
}

export { clean };
