FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage - copy built files to volume
FROM alpine:latest
COPY --from=builder /app/dist /app/dist
CMD ["cp", "-r", "/app/dist/.", "/output/"]
