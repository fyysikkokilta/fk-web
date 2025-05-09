import * as migration_20250509_154236_init from './20250509_154236_init'

export const migrations = [
  {
    up: migration_20250509_154236_init.up,
    down: migration_20250509_154236_init.down,
    name: '20250509_154236_init'
  }
]
