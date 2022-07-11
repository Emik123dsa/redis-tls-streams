#!/bin/bash

# COPIED/MODIFIED from the redis server gen-certs util
# https://github.com/redis/redis/blob/cc0091f0f9fe321948c544911b3ea71837cf86e3/utils/gen-test-certs.sh

# Generate some test certificates which are used by the regression test suite:
#
#   tls/certs/ca.{crt,key}          Self signed CA certificate.
#   tls/certs/redis.{crt,key}       A certificate with no key usage/policy restrictions.
#   tls/certs/client.{crt,key}      A certificate restricted for SSL client usage.
#   tls/certs/server.{crt,key}      A certificate restricted for SSL server usage.
#   tls/certs/redis.dh              DH Params file.

generate_cert() {
    local name=$1
    local cn="$2"
    local opts="$3"

    local keyfile=tls/certs/${name}.key
    local certfile=tls/certs/${name}.crt

    [ -f $keyfile ] || openssl genrsa -out $keyfile 2048
    openssl req \
        -new -sha256 \
        -subj "/O=Redis Test/CN=$cn" \
        -key $keyfile | \
        openssl x509 \
            -req -sha256 \
            -CA tls/certs/ca.crt \
            -CAkey tls/certs/ca.key \
            -CAserial tls/certs/ca.txt \
            -CAcreateserial \
            -days 365 \
            $opts \
            -out $certfile
}

mkdir -p certs/redis
[ -f tls/certs/ca.key ] || openssl genrsa -out tls/certs/ca.key 4096
openssl req \
    -x509 -new -nodes -sha256 \
    -key tls/certs/ca.key \
    -days 3650 \
    -subj '/O=Redis Test/CN=Certificate Authority' \
    -out tls/certs/ca.crt

cat > tls/certs/openssl.cnf <<_END_
[ server_cert ]
keyUsage = digitalSignature, keyEncipherment
nsCertType = server
[ client_cert ]
keyUsage = digitalSignature, keyEncipherment
nsCertType = client
_END_


generate_cert server "Server-only" "-extfile tls/certs/openssl.cnf -extensions server_cert"
generate_cert client "Client-only" "-extfile tls/certs/openssl.cnf -extensions client_cert"
generate_cert redis "redis"

[ -f tls/certs/redis.dh ] || openssl dhparam -out tls/certs/redis.dh 2048