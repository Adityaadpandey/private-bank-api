import { getLogger } from "@private-bank/logger";
import { Kafka, Partitioners, Producer } from "kafkajs";

const logger = getLogger("@private-bank/kafka-client", "info");

class KafkaClient {
    private producer: Producer;
    private isConnected = false;
    private readonly kafka: Kafka;

    constructor(
        clientId: string,
        brokers: string[],
        options = {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.DefaultPartitioner,
        }
    ) {
        this.kafka = new Kafka({
            clientId,
            brokers,
        });

        this.producer = this.kafka.producer(options);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.producer.on("producer.connect", () => {
            this.isConnected = true;
            logger.info("Kafka producer connected");
        });

        this.producer.on("producer.disconnect", () => {
            this.isConnected = false;
            logger.info("Kafka producer disconnected");
        });

        this.producer.on("producer.network.request_timeout", (payload) => {
            logger.error("Kafka producer network request timeout", payload);
        });
    }

    public getProducer(): Producer {
        return this.producer;
    }

    public createConsumer(groupId: string) {
        return this.kafka.consumer({ groupId });
    }

    public isReady(): boolean {
        return this.isConnected;
    }

    public async connect(): Promise<void> {
        try {
            await this.producer.connect();
        } catch (error) {
            logger.error("Failed to connect Kafka producer", error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.producer.disconnect();
            this.isConnected = false;
        } catch (error) {
            logger.error("Failed to disconnect Kafka producer", error);
        }
    }
}

export default KafkaClient;

export interface KafkaMessage<T> {
    key: string;
    value: T;
}

export abstract class BaseProducer<T> {
    protected abstract readonly topic: string;
    private producer: Producer;

    constructor(producer: Producer) {
        this.producer = producer;
    }

    async publish(data: KafkaMessage<T>): Promise<void> {
        try {
            // 👇 Check if the producer is connected
            const kafkaClient = new KafkaClient("clientId", ["broker1"]); // Replace with actual clientId and brokers
            if (!kafkaClient.isReady()) {
                logger.warn("Producer not connected. Attempting to reconnect...");
                await this.producer.connect();
            }

            logger.info(`Publishing to topic: ${this.topic} - ${JSON.stringify(data)}`);

            await this.producer.send({
                topic: this.topic,
                messages: [
                    {
                        key: data.key,
                        value: JSON.stringify(data.value),
                    },
                ],
            });

            logger.debug(`Message published successfully to topic: ${this.topic}`);
        } catch (error) {
            logger.error(`Failed to publish message to topic ${this.topic}: ${error}`);
            throw error;
        }
    }

}
