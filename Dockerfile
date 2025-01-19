# This initial stage uses the node:20.12-alpine3.18 Docker image as a base to build your Angular application.
FROM node:20.12-alpine3.18 as build

# Setting the working directory in the Docker image.
WORKDIR /app

# Copying the package.json and package-lock.json files into the image.
COPY package.json package-lock.json ./

# This will install dependencies from your package.json file.
RUN npm install

# Copying the rest of your app's source code from your host to your image filesystem.
COPY . .

# This will build your Angular app in production mode.
RUN npx ng build --configuration production
RUN npx ng build --project product --output-hashing none --single-bundle true production


# This next stage uses the nginx:1.25.3-alpine Docker image as it's base.
FROM nginx:1.25.3-alpine

# These ARG and ENV lines allow for optional environment variables. They're not necessary for the setup but can be useful for things like setting a version number.
ARG VERSION_NUMBER_ARG=no-version
ENV TZ=Europe/Zurich
ENV VERSION_NUMBER=$VERSION_NUMBER_ARG

# Copies the custom NGINX configuration file you've written in your project to the right location in your Docker image.
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# These commands will set permissions for various NGINX locations to allow the nginx user to function correctly.
RUN touch /var/run/nginx.pid && \
  mkdir -p /var/cache/nginx && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/nginx.conf && \
  chown -R nginx:nginx /var/cache/nginx

# Changes to the nginx user, set up in the base image
USER nginx

# This copies the compiled Angular 'dist' directory into the nginx html directory.
COPY --from=build /app/dist/[path-to-index.html] /usr/share/nginx/html/
COPY --from=build /app/dist/[path-to-index.html] /usr/share/nginx/html/

# This makes port 8080 available to your host machine.
EXPOSE 8080

# This is starting NGINX and making sure it stays running. The "-g 'daemon off;'" part is grabbing the global configuration to modify it.
CMD ["nginx", "-g", "daemon off;"]