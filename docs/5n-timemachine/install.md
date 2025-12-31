# Installation

To deploy the 5N Time Machine, you’ll need to complete these steps:

- A Postgres database with a user that can create a schema and table
- Install the software into your Kubernetes cluster using our public Helm chart.
- Ledger credential, ideally a readonly user with `Can Read As Any party` permisison so it can see on the update.

## Setup

`5N Time Machine` can be run anywhere as long as it can reach your ledger and 


### Prepare Secret

Create a secret call `time-machine-secrets` in the namespace that you're going to deploy the app to with below key

- AUTH_CLIENT_ID": "<m2m-client-id>
- AUTH_CLIENT_SECRET": "<m2m-client-secret>"
- AUTH_URL": "<oidc-url>"
- AUTH_AUDIENCE": "<auth-audience>"
- CANTON_VERSION": 3.4"
- DATABASE_URL": "postgres://<user>:<password>@host:port/dbname",
- DBMATE_MIGRATIONS_TABLE: a table to track migration, default is "schema_migrations_time_machine"
- LEDGER_API_BASE_URL": "<your-ledger-api-base-url>",
- MIGRATION_ID: current migration id

### Install the software into your Kubernetes cluster using our public Helm chart.

Once you have the above values, deploy the latest version using Helm:

```
helm upgrade --install time-machine \
    oci://ghcr.io/fivenorth-io/helm/time-machine \
    -n <namespace> \
    --version <version> \
    --set image.tagversion
```

To find the latest version, visit the [release note](/time-machine/release/)
