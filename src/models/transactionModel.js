const pool = require('../config/database.js');

const createTransaction = async (transaction) => {
  const { accountexternaliddebit, accountexternalidcredit, tranfertypeid, value, status } = transaction;
  const result = await pool.query(
    'INSERT INTO transactions (accountexternaliddebit, accountexternalidcredit, tranfertypeid, value, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [accountexternaliddebit, accountexternalidcredit, tranfertypeid, value, status]
  );
  return result.rows[0];
};

const getTransactionById = async (id) => {
  const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
  return result.rows[0];
};

const updateTransactionStatus = async (id, status) => {
  await pool.query('UPDATE transactions SET status = $1 WHERE id = $2', [status, id]);
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransactionStatus,
};