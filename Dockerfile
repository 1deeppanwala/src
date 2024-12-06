# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to start the application
CMD ["node", "app.js"]
