# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

# Set the port to 3001
ENV PORT=3001

# Expose port 3001 to Docker
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
