import { sync } from 'del';
import { CONSTS } from './CONSTS';

const { DIST_DEST, DEPLOY_TARGET } = CONSTS;

function clean(cb) {
    sync([DIST_DEST, DEPLOY_TARGET]);
    cb();
}

export { clean };
