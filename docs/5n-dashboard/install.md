# Installation

In order to deploy 5N Dashboard, you will need to complete the following steps:

- Configure an OIDC application for the UI of 5N Dashboard.
- Install the software into your kubernetes cluster using our public helm chart.
- Expose the deployment with an ingress
- Upcoming: To enable database backup, pass in database address and s3 credential

## Setup

`5N Dashboard` is ideally deployed into the same cluster where your validator runs.

### Create an OIDC application for the UI Frontend

Follow the same steps for setting up a [auth0](https://docs.test.sync.global/validator_operator/validator_helm.html#configuring-an-auth0-tenant) or an [External OIDC Provider](https://docs.test.sync.global/validator_operator/validator_helm.html#oidc-provider-requirements). Specifically, create a new application similar to the wallet/cns and call it `5N Dashboard UI`. Once this has been created, take note of your app URL, its client id and audience.

Example, with Auth0, the value looks like this

- OIDC Authentication App URL: `https://<tenand-id>.<region>.auth0.com`. For other system this will usually 
- Client id: `<some-id>@clients`
- Audience: the audience of your app

Usually, you can follow exactly the same setup and URL configuration you use for the wallet ui app with different client id (or different audience if you had configure a separate audience).

### Deploy with the helm chart

Once having all the above value, use helm to deploy the latest version.

```
helm upgrade --install 5n-dashboard \
    oci://ghcr.io/fivenorth-io/helm/5n-dashboard \
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
  name: dashboard-ingress
  namespace: <name-space>
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "128M"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
spec:
  tls:
  - hosts:
    - host-name-to-access-the-dashboard
  - secretName: <secret-name-for-cert-of-our-ingress>
  ingressClassName: nginx
  rules:
  - host: host-name
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: fivenorth-dashboard
              port:
                number: 8080
```

If your DAR files are small and you usually won't bundle with multi upload, you can adjust the annotations to a reasonable number to match your expectation.


If your setup has TLS termination outside the cluster(such as at AWS/ALB load balancer, and the request just pass plaintext HTTP into the ingress service), your can simplify ingress to just



```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dashboard-ingress
  namespace: <name-space>
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "128M"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
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
              name: fivenorth-dashboard
              port:
                number: 8080
```

### Access the dashboard

After installing the dashboard, you can now login to it with the user that have primary party is the same as your validator operator party. Usually, this will be the same user that can access your validator wallet.
