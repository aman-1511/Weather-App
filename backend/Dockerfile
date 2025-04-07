# Use Node.js 16 or 18 as the base image
FROM node:16

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your server runs on
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
