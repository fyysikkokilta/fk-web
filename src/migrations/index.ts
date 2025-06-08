import * as migration_20250509_154236_init from './20250509_154236_init';
import * as migration_20250515_170300 from './20250515_170300';
import * as migration_20250608_192758 from './20250608_192758';
import * as migration_20250608_193404 from './20250608_193404';

export const migrations = [
  {
    up: migration_20250509_154236_init.up,
    down: migration_20250509_154236_init.down,
    name: '20250509_154236_init',
  },
  {
    up: migration_20250515_170300.up,
    down: migration_20250515_170300.down,
    name: '20250515_170300',
  },
  {
    up: migration_20250608_192758.up,
    down: migration_20250608_192758.down,
    name: '20250608_192758',
  },
  {
    up: migration_20250608_193404.up,
    down: migration_20250608_193404.down,
    name: '20250608_193404'
  },
];
