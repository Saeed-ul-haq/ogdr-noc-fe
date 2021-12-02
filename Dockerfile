# Build front-end files
FROM node:12-alpine AS ams-fe
WORKDIR /fecode
COPY . /fecode
ARG NPM_AUTH_TOKEN
ARG GIT_COMMIT_HASH
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN echo $BUILD_PROFILE_NAME && echo -e "@target-energysolutions:registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc \
   && yarn && yarn build

# Nginx based web server
FROM nginx:1.13-alpine
COPY --from=ams-fe /fecode/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_proxy.conf /etc/nginx/nginx_proxy.conf
RUN echo -e "#!/bin/sh\n"\
    "for i in \$(env); do\n"\
    "  PREFIX=\`echo \$i | cut -c1-10\`\n"\
    "  if [ \"\$PREFIX\" = 'MEERA_APP_' ]; then\n"\
    "    VAR=\`echo \$i | cut -d= -f1\`\n"\
    "    eval \"VAL=\\\${\$VAR}\"\n"\
    "    OLD=\"{\$VAR}\"\n"\
    "    echo \"replacing \$OLD with \$VAL\"\n"\
    "    sed -i \"s:\$OLD:\${VAL//:/\\:}:g\" /usr/share/nginx/html/index.html\n"\
    "  fi\n"\
    "done\n"\
    "gzip -kc /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.gz\n"\
    "nginx -g 'daemon off;'\n" > /init.sh
EXPOSE 80
CMD ["sh", "/init.sh"]
