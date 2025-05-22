FROM nginx:stable-alpine-slim
LABEL maintainer="craigiswayne@gmail.com"
RUN apk update && apk add --no-cache openssl

RUN mkdir /etc/nginx/certs

RUN openssl req -x509 -nodes -days 365 \
    -subj "/C=XX/ST=SomeState/L=SomeCity/O=MyOrg/CN=localhost" \
    -newkey rsa:2048 -keyout /etc/nginx/certs/your_domain.key \
    -out /etc/nginx/certs/your_domain.crt

ARG BUILD_DIR=./dist/prototype/browser
ENV BUILD_DIR=$BUILD_DIR

COPY ./dist/prototype/browser /usr/share/nginx/html
COPY docker.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
