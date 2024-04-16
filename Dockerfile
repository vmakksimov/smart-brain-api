FROM node:carbon

WORKDIR /user/src/smart-brain-api

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]