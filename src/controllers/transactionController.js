const kafka = require('kafka-node');
const transactionModel = require('../models/transactionModel.js');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
  console.error('Error in Kafka Producer', error);
});

const createTransaction = async (req, res) => {
  const { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value } = req.body;

  try {
    const transaction = await transactionModel.createTransaction({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      status: 'pending',
    });

    console.log('Transaction created:', transaction);

    producer.send(
      [{ topic: 'transaction_created', messages: JSON.stringify(transaction) }],
      (err, data) => {
        if (err) {
          console.error('Failed to send message to Kafka', err);
        } else {
          console.log('Message sent to Kafka', data);
        }
      }
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionModel.getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error retrieving transaction', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTransaction,
  getTransaction,
};