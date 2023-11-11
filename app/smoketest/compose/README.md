# Compose smoketests

## REQUIREMENTS

- [Podman](https://podman.io/docs/installation) v4.7+
- [docker-compose](https://docs.docker.com/compose/install/standalone/) v2+

**Notes**: Alternatively, `docker` and `docker compose` plugin can be used.


## PULL IMAGES

To configure the container tool (e.g. `podman`) to pull images from Github Container Registry (`ghcr.io`):

- Generate a Github Personal Access Token (PAT) with `read:packages` scope.
- Login with container tool with

    ```bash
    $ podman login ghcr.io
    Username: <github_username>
    Password: <PAT>
    ```


For more details, follow this [guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic). **Note**: With `podman`, re-authentication across reboots might be necessary.

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
