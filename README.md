# Cloudonix Store
**Cloudonix Store** is a simple frontend application built with Angular 19 that interacts with a REST service to manage a collection of products for an online store. The project was developed as part of a technical challenge, with a focus on modern Angular features such as Web Components and responsiveness.

<img src="https://github.com/user-attachments/assets/e59e458c-1417-4db0-bdad-97be9bae8303" width="430px" height="932px" >



## Features

- **Authorization Login**: The application requires an authorization key to access the product list.
- **Product CRUD**: The application allows creating, editing, and deleting products.
- **Web Components**: Custom components for editing product properties.
- **Responsiveness**: The application is designed to work well on mobile devices.
- **Docker**: The application can be run in a Docker container.

## Technologies Used

- **Angular 19**
- **Web Components**
- **Docker**
- **Angular Material**
- **RxJS**
- **TypeScript**

## How to Run

### Prerequisites

- **Node.js** (recommended version: 16 or higher)
- **Angular CLI** (globally installed)
- **Docker** (for running the application in a container)

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IcaroMiranda98/cloudonix-store.git
   cd cloudonix-store

2. **Install dependencies**:
   ```bash
   npm install
3. **Build of Product WebComponent**:
   ```bash
   npm buildProduct
3. **Run the application**:
   ```bash
   npm run start

### Using Docker
1. **Build the Docker image:**:
   ```bash
   docker build -t cloudonix-store . && docker run -d -p 8081:80 --name cloudonix-store-container cloudonix-store

2. **On your favourite browser, try**
   ```bash
   http://localhost:8081

## Running unit tests

As there wasn't enough time to implement unit tests, after sending the repository, I am continuing to work on them in a development branch. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


