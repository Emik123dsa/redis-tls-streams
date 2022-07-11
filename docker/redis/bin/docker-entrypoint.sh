#!/usr/bin/env sh
set -e

# redis-cli --tls --cert $REDIS_TLS_CERT_FILE --cacert $REDIS_TLS_CA_CERT_FILE --key $REDIS_TLS_KEY_FILE -a $REDIS_PASSWORD

redis-server --tls-port $REDIS_TLS_PORT --port $REDIS_PORT \
    --tls-cert-file $REDIS_TLS_CERT_FILE \
    --tls-key-file $REDIS_TLS_KEY_FILE \
    --tls-ca-cert-file $REDIS_TLS_CA_CERT_FILE \
    --tls-dh-params-file $REDIS_TLS_DH_PARAMS_FILE \
    --appendonly $REDIS_AOF_ENABLED
    --requirepass $REDIS_PASSWORD