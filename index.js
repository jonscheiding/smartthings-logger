import 'dotenv/config';
import debug from 'debug';

import run from './src/program';

debug.enable(process.env.DEBUG);

run(process.argv);
