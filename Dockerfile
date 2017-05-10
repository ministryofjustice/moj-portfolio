FROM node:6.10-alpine

WORKDIR /home/node

COPY . .
RUN yarn install --frozen-lockfile --force
RUN yarn run build

# Bake-in production environment variables
ENV NODE_ENV=production

CMD [ "node", "server.js" ]
EXPOSE 3100
