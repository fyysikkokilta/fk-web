import * as migration_20250509_154236_init from './20250509_154236_init';
import * as migration_20250515_170300 from './20250515_170300';
import * as migration_20250608_192758 from './20250608_192758';
import * as migration_20250608_193404 from './20250608_193404';
import * as migration_20250608_194422 from './20250608_194422';
import * as migration_20250610_172401 from './20250610_172401';
import * as migration_20250708_155208 from './20250708_155208';
import * as migration_20250712_112955 from './20250712_112955';

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
    name: '20250608_193404',
  },
  {
    up: migration_20250608_194422.up,
    down: migration_20250608_194422.down,
    name: '20250608_194422',
  },
  {
    up: migration_20250610_172401.up,
    down: migration_20250610_172401.down,
    name: '20250610_172401',
  },
  {
    up: migration_20250708_155208.up,
    down: migration_20250708_155208.down,
    name: '20250708_155208',
  },
  {
    up: migration_20250712_112955.up,
    down: migration_20250712_112955.down,
    name: '20250712_112955'
  },
];
