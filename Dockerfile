FROM node:8.4
MAINTAINER qiangyun.wu 842269153@qq.com
RUN npm install -g yarn --registry=https://registry.npm.taobao.org
WORKDIR /workspace/
COPY ./ /workspace/
RUN yarn install
RUN ls -la
RUN npm run build:dll
EXPOSE 8000
CMD ["npm", "run", "dev"]
