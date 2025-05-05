# GPU Cost Optimizer Backend Documentation

## 1. Project Overview

The GPU Cost Optimizer Backend is designed to provide GPU cost optimization and recommendation services. It processes user inputs such as region, budget, use case, dataset size, and workload type to recommend the most cost-efficient GPU instances for their needs.

### Technology Stack and Dependencies
- **Node.js** with **Express** framework for building the REST API.
- **Axios** for making HTTP requests to external pricing APIs.
- **CORS** middleware to enable cross-origin requests.
- **dotenv** for environment variable management.
- **nodemon** for development auto-reloading.

## 2. Folder Structure and Key Files

- **index.js**: The main entry point of the backend application. Sets up the Express server, middleware, and routes.
- **config/**: Contains configuration files, including environment variable loading and app configuration.
- **controllers/**: Contains controller modules that handle incoming API requests and coordinate responses.
- **helpers/**: Contains helper data and utilities, such as GPU benchmark data and compatibility indices.
- **routes/**: Defines API routes and connects them to controller handlers.
- **services/**: Contains business logic and service modules that perform data processing, API calls, and calculations.

## 3. Configuration

- **config/main.js**: Loads environment variables using `dotenv` and exports configuration such as server port and external API URLs.
- Environment variables:
  - `PORT`: Port on which the server runs (default 3000).
  - `API_URL`: URL for external APIs used by the backend.

## 4. API Endpoints

- **GET /**: Root endpoint that returns a simple message indicating the backend is running.
- **POST /api/recommendations**: Main endpoint to get GPU recommendations.
  - Handled by `pricing.controller.js` via the `workLoadInputHandler` function.
  - Accepts JSON body with parameters: `region`, `datasetSize`, `budget`, `useCase`, `workloadType`.
  - Fetches pricing data for the specified region.
  - Calls the recommendations handler to process and return the best GPU instances based on input criteria.
  - Returns a JSON response with success status and recommended instance data.

## 5. Recommendation Logic

- **recommendations.controller.js**: Exposes `recommendationsHandler` which delegates to the `recommendationsApi` service.
- **services/recommendationApi.js**:
  - Processes pricing data and filters GPU instances based on compatibility, budget, and performance.
  - Uses GPU benchmark data and compatibility indices from `helpers/gpuRequirements.js`.
  - Parses GPU descriptions to extract model and GPU count.
  - Scales benchmarks by GPU count.
  - Computes performance scores using `services/performaceScoreCalculator.js`.
  - Calculates cost efficiency and sorts recommendations accordingly.

- **helpers/gpuRequirements.js**:
  - Contains benchmark metrics for various GPU models.
  - Defines compatibility indices for different use cases (AI, Rendering, Training, Inference, General).

- **services/performaceScoreCalculator.js**:
  - Computes performance scores based on workload type using weighted metrics.

- **services/gpuDescriptionParser.js**:
  - Parses GPU description strings to extract model and multiplier.

- **services/updateGpuBenchmarks.js**:
  - Scales benchmark metrics by the number of GPUs.

## 6. Error Handling and Logging

- Controllers handle errors by catching exceptions during API calls or processing.
- Errors are logged to the console with relevant messages.
- Clients receive appropriate HTTP status codes and error messages in JSON format.

## 7. Running the Backend

- Install dependencies:
  ```bash
  npm install
  ```
- Start the server:
  ```bash
  npm start
  ```
- The server listens on the port specified by the `PORT` environment variable or defaults to 5000.
- CORS is enabled for requests from `http://localhost:5173` (typically the frontend).

---

This documentation provides a comprehensive overview of the backend structure, functionality, and usage to assist developers and users in understanding and working with the GPU Cost Optimizer Backend.
