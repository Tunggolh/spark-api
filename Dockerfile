FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json tsconfig*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Remove source files
RUN rm -rf src

# Expose the port
EXPOSE 3000

# Start the app
CMD [ "npm", "start", "start:prod"]