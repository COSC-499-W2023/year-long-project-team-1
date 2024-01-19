FROM docker.io/library/python:3.12 AS deps

WORKDIR /build

COPY install_ffmpeg.sh .

RUN sh install_ffmpeg.sh

FROM public.ecr.aws/lambda/python:3.12

WORKDIR /app

COPY --from=deps /build/ffmpeg /usr/bin/ffmpeg

COPY requirements.txt  .

RUN  pip install -r requirements.txt

COPY video_processor.py lambda.py .

# Overwrite the command by providing a different command directly in the template.
CMD ["lambda.lambda_handler"]
