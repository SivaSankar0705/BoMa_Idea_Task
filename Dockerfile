FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY prisma/ ./prisma/
RUN cd prisma && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/prisma/out ./prisma/out
COPY api/package*.json ./api/
RUN cd api && npm install
# COPY prisma/index.js ./prisma

EXPOSE 3080

CMD ["node", "./prisma/index.js"]