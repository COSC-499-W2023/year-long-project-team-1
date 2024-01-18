#!/bin/bash

aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin 063327155631.dkr.ecr.ca-central-1.amazonaws.com
docker build --platform linux/amd64 -t vidproc-lambda .
docker tag vidproc-lambda:latest 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
docker push 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
