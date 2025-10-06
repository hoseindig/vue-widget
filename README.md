
vue Project – Widget Module
📦 Overview

This project is a Vue 3 application designed to provide a customizable widget with a modular structure.
It includes environment-based configuration, versioning, and mock data for easier development and testing.

⚙️ Project Setup
1. Clone Repository
git clone https://github.com/your-username/your-vue-project.git
cd your-vue-project

2. Install Dependencies
npm install

🚀 Run & Build
Development Mode
npm run dev


Runs the app locally at http://localhost:5173.

Production Build
npm run build


Builds the app for production into the dist/ folder.

Preview Build
npm run preview

🌍 Environment Configuration

All sensitive or configurable data should be placed in the .env file.

Example:

# Base URL for API requests
VITE_BASE_URL=https://api.example.com

# Widget name (used in UI and logs)
VITE_WIDGET_NAME=MyCustomWidget

# Project version (for display / debugging)
VITE_WIDGET_VERSION=1.0.0


⚠️ Note: All environment variables must start with VITE_ in order to be accessible inside Vue.

📂 Mock Data

Mock data is provided under the mock/ directory to simulate backend responses during development.

File: mock/menu.json

Purpose: Contains menu items and hierarchical navigation structure.

Usage: The app imports this file if the backend is not available.

Example snippet (mock/menu.json):