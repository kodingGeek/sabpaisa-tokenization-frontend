# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Build the application with error handling
ENV CI=false
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production stage - simplified nginx
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Remove default nginx config and create our own
RUN rm -f /etc/nginx/conf.d/default.conf && \
    echo 'server {' > /etc/nginx/conf.d/app.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/app.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/app.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/app.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/app.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/app.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/app.conf && \
    echo '    }' >> /etc/nginx/conf.d/app.conf && \
    echo '}' >> /etc/nginx/conf.d/app.conf

EXPOSE 80

# Use exec form to ensure signals are handled correctly
CMD ["nginx", "-g", "daemon off;"]