FROM ubuntu:16.04
MAINTAINER qiangyun.wu 842269153@qq.com



RUN apt-get update && apt-get install -y --no-install-recommends \
  unzip \
  wget \
  python \
  gcc \
  make \
  g++ \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION 8.4.0
# https://npm.taobao.org/mirrors/node/v6.5.0/node-v6.5.0.tar.gz
# https://github.com/nodejs/node/archive/v8.1.2.tar.gz
# node-6.5.0
WORKDIR /tmp
RUN  wget --no-check-certificate -O node.tar.gz  "https://github.com/nodejs/node/archive/v${NODE_VERSION}.tar.gz" \
	&& mkdir -p /tmp/node \
	&& tar zxf node.tar.gz -C /tmp

WORKDIR /tmp/node-${NODE_VERSION}
RUN ls -la
RUN  ./configure && make

RUN mv "/tmp/node-${NODE_VERSION}" /opt/ ; \
	ln -s "/opt/node-${NODE_VERSION}/node" /usr/local/bin/node; \
	ln -s "/opt/node-${NODE_VERSION}/deps/npm/bin/npm-cli.js" /usr/local/bin/npm

ENV PATH ${PATH}:/opt/node-${NODE_VERSION}/out/bin

RUN npm install -g yarn --registry=https://registry.npm.taobao.org
WORKDIR /workspace/
COPY ./* /workspace/
RUN yarn install
RUN ls -la
RUN npm run build:dll
EXPOSE 8000
CMD ["npm", "run", "dev"]
