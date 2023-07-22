#/bin/sh
npm run dev && mage -v
docker restart development-grafana
docker logs -f development-grafana
