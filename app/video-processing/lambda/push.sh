#!/bin/bash

docker build --platform linux/amd64 -t vidproc-lambda .
docker tag vidproc-lambda:latest 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
docker push 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
