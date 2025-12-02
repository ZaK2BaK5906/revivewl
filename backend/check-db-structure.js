const mysql = require('mysql2/promise');

async function checkDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'zak',
    password: 'Floflo1101*',
    database: 'revive_wl'
  });

  const tables = [
    'scenarios',
    'rule_questions',
    'lexicon_questions',
    'chat_messages',
    'tickets',
    'ticket_comments',
    'whitelists'
  ];

  for (const table of tables) {
    console.log(`\n==== ${table.toUpperCase()} ====`);
    try {
      const [rows] = await connection.query(`DESCRIBE ${table}`);
      rows.forEach(row => {
        console.log(`  ${row.Field} (${row.Type})`);
      });
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
    }
  }

  await connection.end();
}

checkDB().catch(console.error);
