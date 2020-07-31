FROM registry.cn-shenzhen.aliyuncs.com/depoga_public/node:10.17.0
WORKDIR /data
ARG ACC_ENV
COPY . .
RUN echo $ACC_ENV > .env
RUN yarn && apk del .build-deps && rm -rf .git
RUN yarn build
COPY web.js dist/.
ENTRYPOINT [ "node", "/data/dist/web.js","--directoryBrowse","no","-R","index.html"]