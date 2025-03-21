FROM node:alpine AS build
WORKDIR /usr/src/app
LABEL description="Like codepen...\
...but offline"
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod


FROM nginx:stable-alpine-slim
COPY --from=build /usr/src/app/dist/prototype/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
