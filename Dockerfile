FROM node:22.12.0-alpine3.21
WORKDIR /data
ARG ACC_ENV
COPY . .
RUN echo $ACC_ENV > .env
RUN yarn config set registry https://registry.npmmirror.com/
RUN npm config set registry https://registry.npmmirror.com/
RUN yarn &&  rm -rf .git
RUN yarn build
COPY web.js dist/.
EXPOSE 8080
ENTRYPOINT [ "node", "/data/dist/web.js","--directoryBrowse","no","-R","index.html"]