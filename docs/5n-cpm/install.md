# Installation

In order to deploy 5n cpm, you will need to complete the following steps:

- Getting a license. License is per validator. Reach out to nodesupport@fivenorth.io or ping our team on Slack to acquire a license.

- Install the software into your kubernetes cluster using our public helm chart.

- Expose the deploy with an ingress

## License

Without the license, you can still using the software, There will be a banner on top to remind you activate a license.


## Setup

5N CPM is ideally deployed into the same cluster where your validator run.

### Create an OIDC application for the UI Frontend

Follow the same steps for setting up a auth0 or an External OIDC Provider. Specifically, create a new application similar to the wallet/cns named '5N CPM UI'. Once this has been created, update your AUTH_CLIENT_ID enviroment variable to be the Client ID of that new application.

### Determine the user id

### Create Kubernetes secret

### Deploy with the helm chart

### Deploy with manifest file directly

### Deploy with docker compose

TBD

### Ingress

Simply expose the port 8080 of the 5n-cpn service. This is an example ingress with ingress nginx.

```
```
