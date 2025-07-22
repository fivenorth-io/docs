# Installation

To deploy the 5N Dashboard, you’ll need to complete these steps:

- Configure an OIDC application for the 5N Dashboard UI.
- Install the software into your Kubernetes cluster using our public Helm chart.
- Expose the deployment via an ingress.
- (Upcoming) To enable database backups, provide your database address and S3 credentials.

## Setup

`5N Dashboard` is ideally deployed in the same cluster where your validator runs.

### Configure an OIDC application for the 5N Dashboard UI.

Follow the steps for setting up either an [auth0](https://docs.test.sync.global/validator_operator/validator_helm.html#configuring-an-auth0-tenant) or an [External OIDC Provider](https://docs.test.sync.global/validator_operator/validator_helm.html#oidc-provider-requirements). Specifically, create a new application similar to the wallet/cns and call it `5N Dashboard UI`. Once this has been created, take note of your app URL, its client id and audience.

Example, with Auth0, the value looks like this

- OIDC Authentication App URL: `https://<tenand-id>.<region>.auth0.com`.
- Client id: `<some-id>@clients`
- Audience: the audience of your app

You can usually reuse the same setup and URL configuration as your wallet UI app, but specify a different client ID or audience if needed.

### Install the software into your Kubernetes cluster using our public Helm chart.

Once you have the above values, deploy the latest version using Helm:

```
helm upgrade --install 5n-dashboard \
    oci://ghcr.io/fivenorth-io/helm/5n-dashboard \
    -n <namespace> \
    --version <version> \
    --set auth.url=<auth-app-url> --set auth.clientId=<client-id> --set auth.audience=<audience>
```

To find the latest version, visit the [release note](/5n-dashboard/release/)

### Expose the deployment via an ingress.

The dashboard uses a single deployment for both UI and backend to simplify routing.

Here’s an example NGINX ingress:

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

Once deployed, log in using a user whose primary party matches your validator operator party. This is typically the same user you use to access your validator wallet.
