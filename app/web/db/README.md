# PrivacyPal Database Initialization

Database intialization and migration tool for PrivacyPal.

## REQUIREMENTS

### Build requirements

- [Podman](https://podman.io/docs/installation) 4.7+

### Run requirements

- [Podman](https://podman.io/docs/installation) 4.7+
- [Node.js](https://nodejs.org/en) v18+
- npm v9.8.1+ (Installed with Node)
- [Make](https://www.gnu.org/software/make/) 4+

## BUILD

### Launch a Postgres Instance

This will launch a Postgres container and set up an `.env` file with `DATABASE_URL` pointing to that instance.

```bash
make start-db setup-env 
```

### Generate latest DDL

Once a Postgres instance is launched and environment configured, run the following to generate the latest migration DDL:

```
make generate-migration
```

### Container image build

This builds the a container image and publish to the local image registry. The image will include the `prisma.schema` and migration history (i.e. `migrations` directory).

```bash
make oci-build
```

## RUN

### Run locally with podman

To launch the initialization container against an existing Postgres instance, run: 
```bash
DATABASE_URL=some-url make run
```
