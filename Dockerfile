# Use Docker Hardened Node.js image for secure, production-ready base
# Node.js 22.x with extended lifecycle support
FROM docker.io/library/node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
