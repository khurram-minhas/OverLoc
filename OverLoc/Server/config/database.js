const sql = require('mssql');

// config for your database
const config = {
  user: "sa",
  password: "12345OHdf%e",
  server: 'localhost',
  database: 'OverLoc',
  trustServerCertificate: true,
};

exports.connect = async (query) => {
  await sql.connect(config)
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
