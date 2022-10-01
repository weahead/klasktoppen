# Klasktoppen

Who comes out on top?

## Prerequisites

- [Docker](https://docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [mkcert](https://github.com/FiloSottile/mkcert)

## Setup local dev environment

Check [the mkcert documentation](https://github.com/FiloSottile/mkcert#installation) for detailed installation instructions.

To setup `mkcert` run the following (or the equivalent for your platform) in your terminal/shell and follow the prompts.

```
CAROOT=~/.mkcert mkcert -install
```

To start the project run the following in the project root directoy:

```
docker-compose run --rm -T cert
docker-compose up --build -d
```

You can then visit the following URLs for each service:

- Traefik Dashboard: https://dashboard.klasktoppen.weahead.me/
- Klasktoppen: https://klasktoppen.weahead.me/
- Prisma Studio: https://studio.klasktoppen.weahead.me/

### Custom path for mkcert

Make sure to set the environment variable MKCERT_ROOT before starting the services with Docker Compose.

## Interacting with npm/npx

```
docker-compose exec app npm ...

or

docker-compose exec app npx ...
```

## License

[X11](LICENSE)
