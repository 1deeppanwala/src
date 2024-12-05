# Use official Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the application files
COPY . .

# Install dependencies
RUN npm install

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
