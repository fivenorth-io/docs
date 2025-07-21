# Installation

In order to deploy 5N Dashboard, you will need to complete the following steps:

- Configure an OIDC application for the UI of 5N Dashboard.
- Install the software into your kubernetes cluster using our public helm chart.
- Expose the deploy with an ingress
- (Optionally): To enable database backup, pass in database address.

## Setup

`5N Dashboard` is ideally deployed into the same cluster where your validator run.

### Create an OIDC application for the UI Frontend

Follow the same steps for setting up auth0 or an External OIDC Provider. Specifically, create a new application similar to the wallet/cns named '`5N Dashboard` UI'. Once this has been created, take note of your app URL and its client id.

With Auth0, the value looks like this

- AUTH URL: `https://<tenand-id>.<region>.auth0.com`
- Client id: `<some-id>@clients`
- Audience: the audienec value of the API


### Deploy with the helm chart

```
helm upgrade --install 5n-dashboard-app \
    oci://ghcr.io/fivenorth-io/helm/5n-dashboard-app \
    -n <namespace> \
    --version <version> \
    --set auth.url=<auth-app-url> --set auth.clientId=<client-id> --set auth.audience=<audience>
```

To get the latest version, vist [release note](/5n-dashboard/release/)

### Ingress

We struct the app in a way there is just a single deployment to handle  both of UI and backend, therefore simplify routing layer.

Simply create an ingress that route the port 8080 of the 5n-dashboard-app service. This is an example ingress with ingress nginx.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: 5n-dashboard-app
  namespace: $NAMESPACE
spec:
  tls:
  - hosts:
    - host-name
  - secretName: ${SECRET_NAME}
  ingressClassName: nginx
  rules:
  - host: host-name
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: 5n-dashboard-app
              port:
                number: 8080
```

If your setup has TLS termination outside the cluster it can just be


```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: 5n-dashboard-app
  namespace: $NAMESPACE
spec:
  ingressClassName: nginx
  rules:
  - host: host-name
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: 5n-dashboard-app
              port:
                number: 8080
```


### Access the dashboard

After installing the dashboard, you can now login to it with the user that have primary party is the same as your validator operator party. Usually, this will be the same user that can access your validator wallet.
