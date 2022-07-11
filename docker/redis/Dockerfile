# Copyright 2022 (C) Emil Shari <emil.shari87@gmail.com>
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM redis:7.0.0-alpine as BASE

LABEL maintainer="Emil Shari <emil.shari87@gmail.com>"

ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG REDIS_URI

ARG REDIS_TLS_ENABLED
ARG REDIS_TLS_PORT
ARG REDIS_TLS_CERT_FILE
ARG REDIS_TLS_KEY_FILE
ARG REDIS_TLS_CA_CERT_FILE
ARG REDIS_TLS_DH_PARAMS_FILE
ARG REDIS_AOF_ENABLED

VOLUME [ "/var/lib/redis" ]

ENV REDIS_HOST ${REDIS_HOST}
ENV REDIS_PORT ${REDIS_PORT}
ENV REDIS_PASSWORD ${REDIS_PASSWORD}
ENV REDIS_URI ${REDIS_URI}
ENV REDIS_AOF_ENABLED ${REDIS_AOF_ENABLED}

ENV REDIS_TLS_ENABLED ${REDIS_TLS_ENABLED}
ENV REDIS_TLS_PORT ${REDIS_TLS_PORT}
ENV REDIS_TLS_CERT_FILE ${REDIS_TLS_CERT_FILE}
ENV REDIS_TLS_KEY_FILE ${REDIS_TLS_KEY_FILE}
ENV REDIS_TLS_CA_CERT_FILE ${REDIS_TLS_CA_CERT_FILE}
ENV REDIS_TLS_DH_PARAMS_FILE ${REDIS_TLS_DH_PARAMS_FILE}

WORKDIR /

ADD infrastructure/tls/certs /infrastructure/tls/certs
RUN chmod +x /tls/certs/redis.crt /tls/certs/redis.key /tls/certs/ca.crt

COPY docker/redis/bin/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]

EXPOSE ${REDIS_PORT}/tcp
EXPOSE ${REDIS_PORT}/udp