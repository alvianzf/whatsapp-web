FROM node:18-alpine
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
RUN set -x \
    && adduser -S pptruser \
    && addgroup pptruser \
    && addgroup pptruser pptruser \
    && addgroup pptruser audio \
    && addgroup pptruser video
RUN chmod 1777 /tmp
RUN mkdir -p /home/pptruser
RUN mkdir -p /home/pptruser/.npm
RUN mkdir -p /opt/biteship-whatsapp-node
RUN chown -R pptruser /home/pptruser/.npm
RUN chown -R pptruser /tmp
RUN chown -R pptruser /opt/biteship-whatsapp-node
USER pptruser
WORKDIR /opt/biteship-whatsapp-node
COPY package.json package-lock.json ./
RUN npm ci 
COPY . .
CMD ["sh", "-c", "npm start"]
