# Use an official Node.js image as the base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build", "-l", "3000"]
