#/bin/sh
docker stop development-grafana
npm run dev
mage -v
docker start development-grafana
docker logs -f development-grafana
