FROM docker.io/library/python:3.9-slim-bullseye AS base

USER root

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update

FROM base AS builder

WORKDIR /build

RUN apt-get install -y --no-install-recommends build-essential gcc ffmpeg libsm6 libxext6

COPY requirements.txt .

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

FROM base AS runner

ENV CONFIG_DIR=/opt/privacypal

RUN mkdir -p $CONFIG_DIR && chmod -R g=u $CONFIG_DIR

RUN adduser --system --ingroup root uvicorn

WORKDIR /app

COPY --from=builder /build/wheels /wheels

RUN apt-get install -y --no-install-recommends ffmpeg

RUN pip install --no-cache /wheels/*

COPY --chown=uvicorn . .

USER uvicorn

EXPOSE 3000

ENV PORT 3000
ENV HOST "0.0.0.0"

ENTRYPOINT ["sh", "entrypoint.sh"]
