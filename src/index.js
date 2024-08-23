require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const kafka = require('kafka-node');
const transactionRoutes = require('./routes/transactionRoutes');
const antiFraudService = require('./services/antiFraudService');
const listRoutes = require('./utils/listRoutes');
const logger = require('./middleware/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger);
app.use(transactionRoutes);


const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const admin = new kafka.Admin(client);

// Crear topic de Kafka:
// No pude crear el topic de kafka en la VM, por lo tanto lo cree manualmente
// antes de iniciar el servidor. Si se ejecuta el servidor sin crear el topic,
// el servidor no se iniciará. Si el topic existe, el servidor se iniciará, pasando
// por alto el error de creación del topic.
const topicsToCreate = [{
  topic: 'transaction_created',
  partitions: 1,
  replicationFactor: 1
}];

admin.createTopics(topicsToCreate, (error, result) => {
  if (error && error[0].error !== 'TopicExistsError') {
    console.error('Error creating topic:', error);
    process.exit(1);
  } else {
    console.log('Topic created successfully or already exists:', result);

    app.listen(port, () => {
      console.log(`Server running on port ${port}, Environment: ${process.env.NODE_ENV}`);
      antiFraudService.start();
      listRoutes(app);
    });
    client.close();
  }
});