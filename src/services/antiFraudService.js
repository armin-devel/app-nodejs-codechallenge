const dotenv = require('dotenv');
dotenv.config();
const kafka = require('kafka-node');
const transactionModel = require('../models/transactionModel.js');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'transaction_created', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', async (message) => {
  const transaction = JSON.parse(message.value);

  // Determinar el estado de la transacción basado en el valor
  if (transaction.value > 1000) {
    transaction.status = 'rejected';
  } else {
    transaction.status = 'approved';
  }

  try {
    await transactionModel.updateTransactionStatus(transaction.id, transaction.status);
    console.log(`Transaction ${transaction.id} updated to ${transaction.status}`);
  } catch (error) {
    console.error('Error updating transaction status', error);
  }
});

consumer.on('error', (error) => {
  console.error('Error in Kafka Consumer', error);
});

const start = () => {
  console.log('Anti-Fraud Service started');
};

module.exports = {
  start,
};