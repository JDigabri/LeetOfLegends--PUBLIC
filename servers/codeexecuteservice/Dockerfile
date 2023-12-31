# Use Debian Bullseye Slim as the base image
FROM debian:bullseye-slim AS base

# Update package lists and install necessary packages
RUN apt-get update && apt-get install -y \
    btrfs-progs \
    e2fsprogs \
    iptables \
    openssl \
    xfsprogs \
    xz-utils \
    pigz \
    wget \
    curl \
    ca-certificates

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh

# Set up Docker-in-Docker
ENV DIND_COMMIT=65cfcc2
RUN wget -O /usr/local/bin/dind "https://raw.githubusercontent.com/docker/docker/${DIND_COMMIT}/hack/dind" && \
    chmod +x /usr/local/bin/dind

# Node.js setup in a new stage
FROM node:14-bullseye AS node_base
WORKDIR /usr/src/app

# Copy the Docker CLI and dind from the base stage
COPY --from=base /usr/bin/docker /usr/bin/docker
COPY --from=base /usr/local/bin/dind /usr/local/bin/dind

# Copy your application files (only necessary ones)
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the required port(s)
EXPOSE 8083

# Define entrypoint and command
ENTRYPOINT ["dind"]
CMD ["node", "src/app.js"]
