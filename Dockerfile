FROM node:22.12.0

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip postgresql postgresql-contrib

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY .env ./

RUN npm run build

# Expose the application port (optional, based on your app)
EXPOSE 8000

# Initialize PostgreSQL
USER postgres
RUN service postgresql start && \
    psql --command "ALTER USER postgres WITH PASSWORD 'postgres';" && \
    psql --command "CREATE DATABASE \"qp-assessment\";" && \
    echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/15/main/pg_hba.conf && \
    echo "listen_addresses='*'" >> /etc/postgresql/15/main/postgresql.conf

USER root
RUN service postgresql restart

# Expose PostgreSQL port
EXPOSE 5432

# Start both PostgreSQL and your Node.js app
CMD ["sh", "-c", "service postgresql start && node dist/main.js"]