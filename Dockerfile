FROM node:16.18.0-alpine as buildStage

RUN mkdir -p /home/react
WORKDIR /home/react

COPY client/package.json ./
RUN npm install

COPY client/ ./
RUN npm run build


FROM node:16.18.0-alpine

RUN mkdir -p /home/plex-calendar
WORKDIR /home/plex-calendar

COPY server/package.json ./
RUN npm install --omit=dev
ENV NODE_ENV=production
ENV PORT=5000

COPY server/ ./
COPY --from=buildStage /home/react/dist static
ENV TZ=America/Barbados

EXPOSE 5000
CMD ["node", "app"]