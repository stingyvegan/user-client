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
docker run --env-file=.env -p 3000:80 sv-user-client
```

After that your app should be available at http://localhost:3000/

## Helm

Helm templates are provided to deploy the user client to a kubernetes cluster.

Requirements

- Istio installed and enabled on the namespace
- Docker registry created in namespace (see below)

### Create required secret

The helm chart expects a secret to have been created in the target namespace with the provided credentials to pull the stingyvegan containers. See example of the command to create the secret below.

```
kubectl create secret docker-registry registry-github-stingyvegan --docker-server=ghcr.io --docker-username=danielemery --docker-password=REPLACE_ME --docker-email="danielremery@gmail.com" -n stingyvegan
```

### Using "official" Helm repository

```sh
helm repo add stingyvegan https://helm.stingyvegan.com
helm install -n stingyvegan user-client stingyvegan/sv-user-client -f ./helm/values.yaml
```

### Testing

```sh
# Install using local chart
helm install -n stingyvegan stingyvegan ./helm
# Uninstall
helm uninstall -n stingyvegan stingyvegan
```

## Notes

This repo is a rewrite of https://github.com/stingyvegan/sv-client
