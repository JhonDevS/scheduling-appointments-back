const { Sequelize, SequelizeStorage, Umzug } = require('umzug');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'scheduling_db',
  username: 'postgres',
  password: 'postgres',
  logging: false,
});

const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: path.join(__dirname, 'src/migrations'), ignore: ['index.js'] }],
  },
  storage: new SequelizeStorage({ sequelize }),
});

// Test what context is passed
umzug.on('migrating', name => {
  console.log('Migration:', name, 'is about to run');
});

(async () => {
  try {
    const pending = await umzug.pending();
    console.log('Pending:', pending.length);
    if (pending.length > 0) {
      console.log('First migration file:', pending[0].path);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
