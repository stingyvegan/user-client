FROM demery/docker-cra:v0.1.2

COPY env.schema.js ./env.schema.js
COPY build /usr/share/nginx/html
