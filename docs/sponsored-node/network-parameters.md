# Required Network Parameters

To initialize your validator node, you need the following parameters that define the network you’re onboarding to and the secret required for doing so.

??? Abstract "Resources"
    **DevNet:** [https://docs.dev.sync.global/validator_operator/validator_helm.html](https://docs.dev.sync.global/validator_operator/validator_helm.html)

    **TestNet:** [https://docs.test.sync.global/validator_operator/validator_helm.html](https://docs.test.sync.global/validator_operator/validator_helm.html)

    **MainNet:** [https://docs.sync.global/validator_operator/validator_helm.html](https://docs.sync.global/validator_operator/validator_helm.html)

### MIGRATION_ID
The current migration id of the network (dev/test/mainnet) you are trying to connect to. You can find this on [https://sync.global/sv-network/](https://sync.global/sv-network/).

### SPONSOR_SV_URL

The following are Five North's Super Validator (SV) URLs, and they will only function if Five North is your designated sponsor.

=== "DevNet"

    ```bash
    https://sv.sv-1.dev.global.canton.network.fivenorth.io
    ```

=== "TestNet"

    ```bash
    https://sv.sv-1.test.global.canton.network.fivenorth.io
    ```

=== "MainNet"

    ```bash
    https://sv.sv-1.global.canton.network.fivenorth.io
    ```

### TRUSTED_SCAN_URL
The scan URL of an SV that you trust and that is reachable by your validator, often your SV sponsor (Five North).

=== "DevNet"

    ```bash
    https://scan.sv-1.dev.global.canton.network.fivenorth.io
    ```

=== "TestNet"

    ```bash
    https://scan.sv-1.test.global.canton.network.fivenorth.io
    ```

=== "MainNet"

    ```bash
    https://scan.sv-1.global.canton.network.fivenorth.io
    ```

### Get Onboarding Secret

!!! tip "Egress IP"

    **Please note:** The following commands must run from the same egress IP from which you want to deploy your validator, e.g. from the same server that will run the docker compose or Kubernetes stack.

=== "DevNet"

    ```bash title="Get Onboarding Secret from DevNet"
    curl -X POST https://sv.sv-1.dev.global.canton.network.fivenorth.io/api/sv/v0/devnet/onboard/validator/prepare
    ```

=== "TestNet"

    Self-serve onboarding secrets are not available for TestNet. Please contact nodesupport@fivenorth.io to start the process

=== "MainNet"

    Self-serve onboarding secrets are not available for MainNet. Please contact nodesupport@fivenorth.io to start the process