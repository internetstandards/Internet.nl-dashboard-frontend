# Build container to serve static content
FROM node AS build

RUN mkdir /src
WORKDIR /src

# Build dependencies first to allow them to be cached in a docker layer
ADD Makefile Makefile
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN make setup

ADD . /src/
RUN make build-gui-deploy

# Copy all compiled content into simple http server container
FROM nginx
COPY --from=build /src/dist/ /usr/share/nginx/html/
COPY misc/default.conf /etc/nginx/conf.d/default.conf
