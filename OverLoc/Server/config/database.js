const sql = require('mssql/msnodesqlv8');

// config for your database
const config = {
  database: 'OverLoc',
  server: 'KHURRAMLAPTOP\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  },
};
exports.connect = async (query) => {
  await sql.connect(config);
  let res = { hasError: false, result: [], error: '' };
  try {
    const result = await sql.query(query);
    sql.close();
    res.result = result.recordset;
    return res;
  } catch (err) {
    res.hasError = true;
    res.error = err;
    return res;
  }
};
