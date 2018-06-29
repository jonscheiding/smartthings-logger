import 'dotenv/config';
import debug from 'debug';

import './src/logging/debug-structured';
import run from './src/program';

debug.enable(process.env.DEBUG);

run(process.argv);
