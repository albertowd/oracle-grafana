#/bin/sh
docker run --rm -v "$PWD:/project:rw" alpine:latest sh -c "\
    apk -U add go nodejs npm tar --no-cache &&\
    apk add mage --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/ &&\
    mkdir /build/ &&\
    cd /build/ &&\
    cp -ra /project/. /build/ &&\
    mage -v &&\
    npm ci &&\
    npm run build &&\
    rm ./dist/gpx_oracle_grafana_darwin* ./dist/gpx_oracle_grafana_linux_ar* ./dist/gpx_oracle_grafana_windows* &&\
    mv ./dist/ ./albertowd-oracle-grafana/ &&\
    tar -cvzf ./alberto-oracle-grafana.tar.gz ./albertowd-oracle-grafana/ &&\
    cp ./alberto-oracle-grafana.tar.gz /project/
    "