FROM demery/docker-cra:v0.1.4

COPY env.schema.js ./env.schema.js
COPY build /usr/share/nginx/html
