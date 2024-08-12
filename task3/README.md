This is a Kafka-based task management application where you can create and manage tasks. The application includes Kafka producers and consumers to handle task updates and status.

## Prerequisites

- Docker
- Node.js

## Setup Instructions

### Step 1: Run Zookeeper

First, you need to run Zookeeper in one container:

```bash
docker run -p 2181:2181 zookeeper
```

### Step 2: Run Kafka

Next, run Kafka in another container. Replace <PRIVATE_IP> with your machine's IP address:

```bash
docker run -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=<PRIVATE_IP>:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<PRIVATE_IP>:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```

### Step 3: Create Kafka Topics

Once Kafka is running, you can create the required topic by running admin.js

### Step 4: Run the Producer

The producer will send task updates to the Kafka topic through CLI.
It accepts `taskName` and `taskStatus` spparated by a ` `(space):

```bash
task-1 completed
```

OR

```bash
task-2 incomplete
```

### Step 5: Run the Consumer

The consumer will listen for task updates.
To run the consumer, pass the group ID as a command-line argument:

```bash
node consumer.js <group_id>
```
