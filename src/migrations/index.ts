import * as migration_20250509_154236_init from './20250509_154236_init';
import * as migration_20250515_170300 from './20250515_170300';

export const migrations = [
  {
    up: migration_20250509_154236_init.up,
    down: migration_20250509_154236_init.down,
    name: '20250509_154236_init',
  },
  {
    up: migration_20250515_170300.up,
    down: migration_20250515_170300.down,
    name: '20250515_170300'
  },
];
