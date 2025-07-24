import * as migration_20250509_154236_init from './20250509_154236_init';
import * as migration_20250515_170300 from './20250515_170300';
import * as migration_20250608_192758 from './20250608_192758';
import * as migration_20250608_193404 from './20250608_193404';
import * as migration_20250608_194422 from './20250608_194422';
import * as migration_20250610_172401 from './20250610_172401';
import * as migration_20250708_155208 from './20250708_155208';
import * as migration_20250712_112955 from './20250712_112955';
import * as migration_20250712_210500 from './20250712_210500';
import * as migration_20250718_165314 from './20250718_165314';
import * as migration_20250718_172710 from './20250718_172710';
import * as migration_20250719_154021 from './20250719_154021';
import * as migration_20250724_152528 from './20250724_152528';
import * as migration_20250724_160732 from './20250724_160732';

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
    name: '20250712_112955',
  },
  {
    up: migration_20250712_210500.up,
    down: migration_20250712_210500.down,
    name: '20250712_210500',
  },
  {
    up: migration_20250718_165314.up,
    down: migration_20250718_165314.down,
    name: '20250718_165314',
  },
  {
    up: migration_20250718_172710.up,
    down: migration_20250718_172710.down,
    name: '20250718_172710',
  },
  {
    up: migration_20250719_154021.up,
    down: migration_20250719_154021.down,
    name: '20250719_154021',
  },
  {
    up: migration_20250724_152528.up,
    down: migration_20250724_152528.down,
    name: '20250724_152528',
  },
  {
    up: migration_20250724_160732.up,
    down: migration_20250724_160732.down,
    name: '20250724_160732'
  },
];
