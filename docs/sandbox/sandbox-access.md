# Sandbox validator

The Five North sandbox validator is a shared validator that runs on DevNet and is available for approved projects to
use for testing and development purposes.

## How to request access to the sandbox validator

1. Reach out to Peter ([peter@fivenorthgroup.com](mailto:peter@fivenorthgroup.com)) or get an intro otherwise
2. Fill out a questionnaire at [https://forms.gle/AKJ79crekY5QsaUW7](https://forms.gle/AKJ79crekY5QsaUW7)
3. The Five North team looks over it to make a decision for approval
4. If approved, we set up a Slack channel with you and give access to intro docs

## Development Access

To access Ledger API for deploying DARs, creating contracts, querying ACS, fetching ledger updates etc., you will need to access Ledger API.

Below is the generic info:

- **Auth App**: [https://auth.sandbox.fivenorth.io](https://auth.sandbox.fivenorth.io)
- **Devnet validator**: [https://wallet.validator.devnet.sandbox.fivenorth.io/](https://wallet.validator.devnet.sandbox.fivenorth.io/)
- **Ledger REST endpoint**: [https://ledger-api.validator.devnet.sandbox.fivenorth.io/](https://ledger-api.validator.devnet.sandbox.fivenorth.io/)
- **Ledger WebSocket endpoint**: [wss://ledger-api.validator.devnet.sandbox.fivenorth.io/](wss://ledger-api.validator.devnet.sandbox.fivenorth.io/)

### Auth Token

To access Ledger API, you'll need a JWT token. The token can be acquired as below:

- Go to your auth app, then Application > Provider.
- Locate **Validator devnet m2m**, click on it.
- Click on it, then go to Edit. You will see:
  - Client ID
  - Client Secret
  - Those two are static. You can store them into your env vars (secure them obviously -- you don't want to leak it).
    Note: don't rotate the secret without letting us know, it will break the validator. To rotate secret, we need to coordinate.
- Normally, you may not have admin access to view this client id/secret yourself, in that case ping a 5N Node Operator.

Now with the above, you can exchange it for an access token. You can make this request:

```bash
curl -X POST 'https://auth.sandbox.fivenorth.io/application/o/token/' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' \
  --data 'client_id=<client_id>' \
  --data 'client_secret=<secret>' \
  --data 'audience=<client_id>' \
  --data 'scope=daml_ledger_api'
```

You will then get an `access_token` in the response. This access token expires every 8 hours, so code your app in a way to detect and refresh this.

### Access Ledger API

#### Http Rest API

https://ledger-api.validator.devnet.sandbox.fivenorth.io/

Then you can make a request to ledger and pass the access token as Bearer

**Example to access Ledger End:**

```bash
curl -X GET 'https://ledger-api.validator.devnet.sandbox.fivenorth.io/v2/state/ledger-end' \
  --header 'Authorization: Bearer <token>'
```

Or example to upload a DAR file

**OpenAPI of Ledger**: [https://docs.digitalasset.com/build/3.3/explanations/json-api/index.html#json-api](https://docs.digitalasset.com/build/3.3/explanations/json-api/index.html#json-api)

#### Websocket API

You can re-use same URL endpoint, using the same access token but with this format:

```bash
wscat -w -1 --connect \
  'wss://ledger-api.validator.devnet.sandbox.fivenorth.io/v2/state/active-contracts' -s 'jwt.token.<token>' \
  -s 'daml.ws.auth'
```

You can adapt to any websocket library. The `-s` is the subprotocol of websocket. When coding, make sure the ordering is correct.

### gRPC access

gRPC access is available upon request. Contact us on the Slack channel for this.
A static IP is required to whitelist on the validator side.