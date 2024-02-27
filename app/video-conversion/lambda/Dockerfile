FROM docker.io/library/python:3.12 AS deps

WORKDIR /build

COPY install_ffmpeg.sh .

RUN sh install_ffmpeg.sh

FROM public.ecr.aws/lambda/python:3.12

COPY --from=deps /build/ffmpeg /usr/bin/ffmpeg

COPY lambda.py .

# Overwrite the command by providing a different command directly in the template.
CMD ["lambda.lambda_handler"]
