# Assess IP Whitelisting status

To initialize your validator node, you need the following parameters that define the network you’re onboarding to and the secret required for doing so.

### Validating that your IP has been approved

!!! tip "Quorum"

    **Please note:** The following commands must run from the same egress IP from which you want to deploy your validator, e.g. from the same server that will run the docker compose or Kubernetes stack.

=== "DevNet"

    ```bash title="Check whitelisting status in devnet"
    for url in $(curl -sSL https://scan.sv-1.dev.global.canton.network.sync.global/api/scan/v0/scans | jq -r '.scans | .[].scans | .[] | .publicUrl' ); do
      echo -n "$url: ";
      curl -sSL --connect-timeout 5 --fail-with-body $url/api/scan/version | jq -r '.version';
    done
    ```

=== "TestNet"

    ```bash title="Check whitelisting status in TestNet"
    for url in $(curl -sSL https://scan.sv-1.test.global.canton.network.sync.global/api/scan/v0/scans | jq -r '.scans | .[].scans | .[] | .publicUrl' ); do
      echo -n "$url: ";
      curl -sSL --connect-timeout 5 --fail-with-body $url/api/scan/version | jq -r '.version';
    done
    ```

=== "MainNet"

    ```bash title="Check whitelisting status in MainNet"
    for url in $(curl -sSL https://scan.sv-1.global.canton.network.sync.global/api/scan/v0/scans | jq -r '.scans | .[].scans | .[] | .publicUrl' ); do
      echo -n "$url: ";
      curl -sSL --connect-timeout 5 --fail-with-body $url/api/scan/version | jq -r '.version';
    done
    ```