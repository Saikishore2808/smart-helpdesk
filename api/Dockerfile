# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose port
EXPOSE 4000

# Set environment variable for Node
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
