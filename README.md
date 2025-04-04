# Node.js Project

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v20.18.3 or later recommended)
* NPM (v10.8.2 or later recommended)

### Development Environment (Optional)

eslint:
prettiefy

Extensions (VSC):

* Prettier ESLint
* ESLint
* Prettier - Code formatter

### Installation

1. Clone the repository:
   ```
   cd ~/Documents
   git clone git@github.com:HCorte/BackendChallenge.git
   cd ~/Documents/BackendChallenge
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

#### Without Docker

1. Start RabbitMQ (if running locally, ensure it's installed and running on default port `5672`)
2. Build Project to compile
   ```
   npm run build
   ```
3. Start the Node.js server:
   ```
   npm start
   ```

#### Using Docker

1. Start RabbitMQ using Docker:
   ```
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
   ```
2. Start the Node.js server:
   ```
   npm start
   ```

## Message Broker - RabbitMQ

RabbitMQ is a message broker that enables communication between different services using message queues. It helps in decoupling microservices, ensuring reliable message delivery, and improving scalability.

### Why Use RabbitMQ?

* **Decoupling**: Allows independent microservices to communicate without tight dependencies.
* **Scalability**: Manages message queues efficiently, distributing workload among consumers.
* **Reliability**: Supports message acknowledgment, ensuring no message is lost.

### Connecting to RabbitMQ

In your Node.js application, you can use `<span>amqplib</span>` to connect to RabbitMQ and send/receive messages.

#### Example: Sending and Receiving Messages

Install `amqplib`:

```
npm install amqplib
```

**Producer (Sending Messages):**

```
const amqp = require('amqplib');

async function sendMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });
    const message = 'Hello, RabbitMQ!';
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Sent: ${message}`);

    setTimeout(() => {
        connection.close();
    }, 500);
}

sendMessage();
```

**Consumer (Receiving Messages):**

```
const amqp = require('amqplib');

async function receiveMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}`);

    channel.consume(queue, (msg) => {
        if (msg) {
            console.log(`Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
}

receiveMessage();
```

### Monitoring RabbitMQ

If RabbitMQ is installed locally, enable the plugin with:

```
sudo rabbitmq-plugins enable rabbitmq_management
```

If you are using the RabbitMQ management plugin (`rabbitmq:management` Docker image), you can access the management UI:

* URL: [http://localhost:15672]()
* Default Credentials:
  * Username: `guest`
  * Password: `guest`

## Conclusion

This project demonstrates how to integrate RabbitMQ with a Node.js application for message-driven communication. Modify the queue names and settings as needed for your application.

---
