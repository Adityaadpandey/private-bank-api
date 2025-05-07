#!/bin/bash

(docker compose up)&
(cd api-gateway && npm start)&
(cd auth-service && npm start)&
(cd account-service && npm start)&

wait
# Wait for all background processes to finish
