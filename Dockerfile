# Download Node Alpine image
FROM node:alpine As build

# Setup the working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy other files and folder to working directory
COPY . .

# Build Angular application in PROD mode
RUN npm run build --prod

# Download NGINX Image
FROM nginx:alpine
# Copy built angular app files to NGINX HTML folder
COPY --from=build /usr/src/app/dist/prototype/ /usr/share/nginx/html

#FROM nginx:alpine
#COPY ./dist/prototype/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
