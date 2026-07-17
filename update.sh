#!/bin/bash

pushd /opt/data/docker-stack-home && git pull && docker compose up -d --remove-orphans
popd


