FROM node

WORKDIR /user/src/smart-brain-api

COPY ./ ./

RUN npm install


CMD [ "/bin/bash" ]