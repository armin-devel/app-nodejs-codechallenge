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
  console.log('Message received from Kafka:', transaction);
  
  try {
    // Guardar la transacción en la base de datos
    await transactionModel.createTransaction(transaction);
    console.log('Transaction saved to database', transaction);
  } catch (error) {
    console.error('Error saving transaction to database', error);
  }
});

consumer.on('error', (error) => {
  console.error('Error in Kafka Consumer', error);
});