FROM node:10.14.1
LABEL description="Image for run Tereza Perez Tours API" version="1.0.0" maintainer="Dextra"

ENV API_PATH="/api"

WORKDIR $API_PATH

COPY . $API_PATH

RUN npm i
RUN npm run build

EXPOSE 443
EXPOSE 8080

CMD [ "node", "./dist/src/main" ]
