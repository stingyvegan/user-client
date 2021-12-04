# Stingy Vegan Client

This project is currently using `create-react-app` unejected.

## Development

To get started developing simply run `npm ci` to installed packages followed by `npm start` to start the dev server.

## Build for Production

If you want to create a production build manually use `npm run build`.

## Dockerisation

[docker-cra](https://github.com/danielemery/docker-cra) is used to package the bundle into a docker image and to allow environment variables to be set at runtime instead of buildtime.

The following steps can be followed to build and test the dockerised application locally.

```sh
# Ensure packages are installed
npm ci

# Run a CRA build
npm run build

# Build the docker container
docker build -t sv-user-client .

# Run the docker container
docker run --env-file=.env -p 8080:80 sv-user-client
```

After that your app should be available at http://localhost:8080/

## Notes

This repo is a rewrite of https://github.com/stingyvegan/sv-client
