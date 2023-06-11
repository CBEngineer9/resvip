# grab built app
FROM node:16-alpine3.16 as deploy
WORKDIR /app
# COPY /app/package.json ./
# COPY /app/src ./src
COPY . .
RUN npm install -p
# RUN mkdir -p storage/buku storage/jadwal storage/mahasiswa storage/materi storage/tugas
# Bundle app source
ENTRYPOINT ["node","/app/src/app.js"]