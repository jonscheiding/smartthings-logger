import 'dotenv/config';
import debug from 'debug';

import './src/bunyan-logging/debug-structured';
import './src/bunyan-logging/debug-bunyan';
import run from './src/program';

debug.enable(process.env.DEBUG);

run(process.argv);
