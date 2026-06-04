# StockPulse

StockPulse is a microservices-based inventory management platform designed to simulate how modern retail and e-commerce systems handle authentication, inventory tracking, order processing, and service monitoring.

The project was built as part of the LogicVeda Web Development Domain and focuses on scalability, reliability, and maintainability through a distributed architecture.

## Project Overview

Traditional inventory systems often become difficult to scale when authentication, inventory management, and order processing are tightly coupled into a single application.

StockPulse addresses this by separating responsibilities into independent services that communicate through APIs. This approach improves fault isolation, makes services easier to maintain, and better reflects how production systems are designed.

## Features

* User registration and authentication using JWT
* Inventory tracking and stock management
* Order processing workflow
* Event-based order timeline
* Low-stock monitoring
* Centralized API Gateway
* Service health monitoring
* Graceful failure handling
* Dockerized deployment
* Load testing and performance validation
* Administrative dashboard for system visibility

## Architecture

```txt
React Dashboard
        |
        v
    API Gateway
        |
        v
+-------------------------------+
| Authentication Service        |
| Inventory Service             |
| Orders Service                |
+-------------------------------+
        |
        v
Event Timeline and Monitoring
```

## Technology Stack

| Category          | Technology             |
| ----------------- | ---------------------- |
| Frontend          | React, Vite            |
| Backend           | Node.js, Express       |
| Authentication    | JWT, bcrypt            |
| API Communication | REST APIs, Axios       |
| Containerization  | Docker, Docker Compose |
| Testing           | Postman, Autocannon    |

## Performance Testing

System performance was evaluated using Autocannon against the API Gateway.

Test Configuration:

* 50 concurrent users
* 20-second duration

Results:

* Over 27,000 requests processed
* Approximately 1,340 requests per second
* Average latency of 36 milliseconds
* No service failures during testing

These results demonstrate stable performance under concurrent load.

## Resilience Testing

To evaluate fault tolerance, the Inventory Service was intentionally stopped during order execution.

Observed behavior:

* Orders failed safely
* Failure events were recorded
* Remaining services continued operating
* Normal processing resumed after service restoration

This confirms the system can tolerate partial failures without complete disruption.

## Running the Project

Clone the repository:

```bash
git clone https://github.com/siyaapatel06/stockpulse-microservices-inventory.git
cd stockpulse-microservices-inventory
```

Start all services:

```bash
docker compose up --build
```

Dashboard:

```txt
http://localhost:5173
```

API Gateway:

```txt
http://localhost:4003
```

Health Monitoring:

```txt
http://localhost:4003/api/health
```

## What I Learned

This project helped me gain practical experience with microservices architecture, API design, authentication workflows, service communication, Docker-based deployment, and system testing.

More importantly, it reinforced the idea that production-ready software requires not only features, but also observability, testing, documentation, and resilience.

## Future Improvements

Potential future enhancements include:

* PostgreSQL database integration
* Event streaming with Kafka or RabbitMQ
* Kubernetes deployment
* CI/CD automation
* Role-based access control
* Cloud deployment

## Author

Siya Patel

LogicVeda Web Development Domain
