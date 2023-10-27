FROM docker.io/library/python:3.8-slim-bullseye AS builder

USER root

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /build

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential gcc ffmpeg libsm6 libxext6

COPY requirements.txt .

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

FROM docker.io/library/python:3.8-slim-bullseye AS runner

USER root

ENV CONFIG_DIR=/opt/privacypal

RUN mkdir -p $CONFIG_DIR && chmod -R g=u $CONFIG_DIR

RUN adduser --system --ingroup root gunicorn

WORKDIR /app

COPY --from=builder /build/wheels /wheels


RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg

RUN pip install --no-cache /wheels/*

COPY --chown=gunicorn . .

USER gunicorn

EXPOSE 3000

ENV PORT 3000
ENV HOST "0.0.0.0"

ENV PRIVACYPAL_INPUT_VIDEO_DIR /opt/privacypal/videos/input_videos
ENV PRIVACYPAL_OUT_VIDEO_DIR /opt/privacypal/videos/out_videos

CMD ["sh", "entrypoint.sh"]
