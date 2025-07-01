# Installation

In order to deploy 5n cpm, you will need to complete the following steps:

- Getting a license. License is per validator. Reach out to nodesupport@fivenorth.io or ping our team on Slack to acquire a license.

- Install the software into your kubernetes cluster using our public helm chart.

- Expose the deploy with an ingress

## Setup

5N CPM is ideally deployed into the same cluster where your validator run.

### Create an OIDC application for the UI Frontend

Follow the same steps for setting up auth0 or an External OIDC Provider. Specifically, create a new application similar to the wallet/cns named '5N CPM UI'. Once this has been created, take note of your app URL and its client id.

With Auth0, the value looks like this

- AUTH URL: https://<tenand-id>.<region>.auth0.com
- client id: <some-id>@clients


### Deploy with the helm chart

```
helm upgrade --install 5n-cpm-app oci://ghcr.io/fivenorth-io/helm/5n-cpm-app -n validator1 --version 0.3.0 --set auth.url=<auth-app-url> --set auth.clientId=<client-id>
```

### Ingress

Simply create an ingress that route the port 8080 of the 5n-cpm-app service. This is an example ingress with ingress nginx.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: 5n-cpm
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
              name: 5n-cpm-app
              port:
                number: 8080
```

If your setup has TLS termination outside the cluster it can just be


```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: 5n-cpn
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
              name: 5n-cpm-app
              port:
                number: 8080
```
