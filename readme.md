
# 🏦 Private Bank API

A scalable **Banking Microservices System** built using modern technologies like **TypeScript**, **Node.js**, **Kafka**, **Redis**, and **PostgreSQL**, implementing **event-driven architecture**, **Saga Pattern**, and complete **end-to-end testing**.

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🧱 Architecture](#-architecture)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [♻️ Saga Pattern](#️-saga-pattern)
- [📦 Shared Packages](#-shared-packages)
- [🧰 Tech Stack](#-tech-stack)
- [✅ TODOs](#-todos)
- [📜 License](#-license)

---

## ✨ Features

✅ Microservice architecture
🔐 JWT authentication & authorization
💸 Secure transaction processing
🧠 Kafka-based async event handling
🔁 Saga pattern for distributed transactions
📦 Internal NPM packages for shared utilities
🧪 Full test coverage with Jest
📊 Redis + Kafka dashboards
🐳 Dockerized for local and cloud deployment

---

## 🧱 Architecture

### 🧩 Core Microservices

| 🧰 Service            | ⚙️ Port | 📝 Description                  | ✅ Status |
|----------------------|--------|--------------------------------|-----------|
| 🌐 API Gateway        | `6000` | Entry point for client traffic | ✅ Done    |
| 🔐 Auth Service       | `6001` | User auth & session management | ✅ Done    |
| 🏦 Account Service    | `6002` | User accounts handling         | ✅ Done    |
| 💳 Transaction Service| `6003` | Money movement & transfers     | ✅ Done    |

### 📡 Supporting Services

| 🧰 Service   | ⚙️ Port | 📝 Description                  |
|-------------|--------|---------------------------------|
| 🧠 Redis     | `6379` | Caching and session store       |
| 🖥️ Redis UI | `8001` | Redis management interface      |
| 🔄 Kafka UI | `8080` | Kafka topic/consumer visibility |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js
- Docker & Docker Compose
- PostgreSQL & Kafka setup

### 🛠️ Setup

```bash
git clone https://github.com/Adityaadpandey/private-bank-api.git
cd private-bank-api
chmod +x *.sh
./run.sh
````

This will:

* Spin up Redis, Postgres, Kafka, and all services
* Initialize databases
* Run service health checks

---

## 🧪 Testing

Run the full test suite (E2E + integration):

```bash
npm run test:e2e
```

🧪 **Tests cover:**

* ✅ Registration, login, logout flows
* ✅ Account create/list/delete
* ✅ Internal transactions (credit/debit)
* ✅ Full money transfer flow with failure handling
* ✅ Saga rollback and compensation logic
* ✅ Auth & permission checks

---

## 📁 Project Structure

```bash
.
├── _bruno/          # Bruno's custom scripts for dev tasks
├── account-service/
├── api-gateway/
├── auth-service/
├── transaction-services/
├── packages/
│   ├── constants/       # System-wide enums & identifiers
│   ├── logger/          # Centralized logging module
│   ├── kafka-client/    # Kafka producer/consumer utilities
│   └── redis-client/    # Redis connection & cache manager
├── e2e-tests/
├── docker-compose.yml
├── run.sh               # Start all services
├── init.sh              # Initialize databases and services
├── packageUpgrade.sh    # Upgrades our custom packages thoughout the project
└── README.md
```

---

## ♻️ Saga Pattern

The **Saga Pattern** ensures consistent state across services by chaining events and triggering compensations when failures occur.

**Example Transfer Flow:**

1. 💳 Debit source account
2. 🧠 Kafka event published
3. 💰 Try crediting destination account
4. ❌ Failure? 🔁 Compensate debit

Handled with:

* Kafka producers & consumers
* Status tracking (`initiated`, `completed`, `failed`)
* Compensation event handlers

---

## 📦 Shared Packages

Reusable, internal packages under the `/packages` directory:

| 📦 Package     | 🔧 Purpose                                 |
| -------------- | ------------------------------------------ |
| `constants`    | Shared enums, config keys, identifiers     |
| `logger`       | Centralized logger using `winston`         |
| `kafka-client` | Kafka producers, consumers, client wrapper |
| `redis-client` | Redis setup, cache set/get utils           |

Install within services like:

```ts
import { logger } from '@private-bank/logger';
import { KafkaProducer } from '@private-bank/kafka-client';
```

---

## 🧰 Tech Stack

* 🧑‍💻 **Language**: TypeScript
* ⚙️ **Backend**: Node.js + Express
* 🧠 **Cache**: Redis
* 💬 **Messaging**: Kafka
* 🐘 **Database**: PostgreSQL
* 🧪 **Testing**: Jest + Supertest
* 🐳 **DevOps**: Docker + Docker Compose


---

## 📜 License

MIT License. See [`LICENSE`](./LICENSE) for details.

---

## 🙌 Author

Made with 💙 by [@Adityaadpandey](https://github.com/Adityaadpandey)
