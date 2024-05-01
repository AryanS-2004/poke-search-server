# POKESEARCH 

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Docker installed on your machine

### Installation

1. Install project dependencies by running the following command:

```bash
npm install
```

### Running the Server

1. Start a Redis server using Docker with the following command:

```bash
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

2. Start the server by running:

```bash
npm run start
```

3. Access the server at [http://localhost:3004](http://localhost:3004)


This `README.md` file provides three simple steps to get started with your project, including installing dependencies, running a Redis server using Docker, and starting the server itself. It also includes a link to access the server once it's running. Adjust the instructions as needed based on your project requirements.
