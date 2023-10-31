# Compose smoketests

## REQUIREMENTS

- [Podman](https://podman.io/docs/installation) 4.7+
- [docker-compose](https://docs.docker.com/compose/install/standalone/) 1.29.2+

**Notes**: Alternatively, `docker` and `docker compose` plugin can be used.

## RUN

### Launch Podman API

With `podman`, Podman API is required to work with `docker-compose`. Launch Podman API as a user service by running:


```bash
systemctl --user enable --now podman.socket
```

Tell `docker-compose` about the API server:

```bash
export DOCKER_HOST=unix:///run/user/$(id -u)/podman/podman.sock
```

**Note:** Above steps are not required for `docker` usage.

### Configure AWS Credentials

To export the credentials for the processing server, run:

```bash
eval $(aws configure export-credentials --profile <your-profile> --format env)
```

### Launch services

To launch composed services, run:

```bash
bash smoketest.sh
```

To keep the video volumes after canceling run, use the `KEEP_VOLUMES` environment variable:

```bash
KEEP_VOLUMES=true bash smoketest.sh
```
