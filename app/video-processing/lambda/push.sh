# Copyright [2023] [Privacypal Authors]
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

#!/bin/bash

aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin 063327155631.dkr.ecr.ca-central-1.amazonaws.com
docker build --platform linux/amd64 -t vidproc-lambda .
docker tag vidproc-lambda:latest 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
docker push 063327155631.dkr.ecr.ca-central-1.amazonaws.com/vidproc-lambda:latest
