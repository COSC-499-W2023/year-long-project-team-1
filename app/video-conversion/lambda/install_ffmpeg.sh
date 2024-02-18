#!/bin/sh
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

set -e

TEMP_DIR=$(mktemp -d)
OUTPUT_DIR=${OUTPUT_DIR:-$PWD}

VERSION=6.0.1
PACKAGE_NAME=ffmpeg-${VERSION}-amd64-static
SOURCE_URL=https://www.johnvansickle.com/ffmpeg/old-releases/${PACKAGE_NAME}.tar.xz


cd $TEMP_DIR

wget $SOURCE_URL
tar xvf ${PACKAGE_NAME}.tar.xz
mv ${PACKAGE_NAME}/ffmpeg $OUTPUT_DIR

cd -
