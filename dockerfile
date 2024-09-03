# Use the official Node.js image
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package*.json ./
RUN npm install

# Copy the src directory and its contents
COPY . .

RUN npm run build

RUN npm install -g serve
CMD ["serve","-s","build"]

# Expose the application port
EXPOSE 3000

# Command to run the application
