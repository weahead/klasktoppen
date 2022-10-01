FROM node:16-slim AS develop
ENV NEXT_TELEMETRY_DISABLED 1
ENV npm_config_update_notifier false
ENV NODE_ENV development
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
EXPOSE 3000
ENTRYPOINT ["/bin/bash"]
CMD ["-c", "npm install && npm run dev"]
