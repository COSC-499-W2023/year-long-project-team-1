#!/bin/sh
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
