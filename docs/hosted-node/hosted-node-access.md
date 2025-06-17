# Hosted Node Bundle

Five North Hosted Node Bundle is an archive containing a few things:

- VPN Profile
- Kube Config for DevNet, MainNet and TestNet if applicable

You should have received a bundle shared securely through Bitwarden. Download and extract it. It typically contains 3 files

- `<your-company-name>-<your-name>.conf`: this is your vpn profile
- `devnet`: this is kubeconfig for devnet. You should store it somewhere. A good place is `~/.kube/your-company-name/devnet`
- `mainnet`: similar to above for mainnet. `~/.kube/your-company-name/mainnet`

Install [Wireguard](https://www.wireguard.com/install/) client for your machine and then import the VPN profile.

## Development Setup

Ideally, you should get a development environment runnning locally in your docker compose. But sometimes it can be useful to connect to a devnet node. While we do not recommend doing so for MainNe, it can be valuable to develop interactively against an actual development node.

### Port forward to ledger grpc

When you want to connect to the k8s cluster, activate your vpn. From the shell run the below command

```bash
# replace to mainnet but please be super careful. Uploading wrong dar file risk brisk your validator. For mainnet best to drive it through your CI system.

export KUBECONFIG=~/.kube/your-company-name/devnet
```

Now you will be able to interact with kubernetes and can do port forward to participant as follow

```bash
 kubectl -n validator1 port-forward $(kubectl -n validator1 get pod | grep participant |awk '{print $1}') 5002:5002
```

Now using `grpcurl` you can interact with the ledger grpc

```bash
grpcurl -plaintext localhost:5002 com.digitalasset.canton.admin.participant.v30.PackageService.ListDars
```

When you deploy your app to the cluster, you will just use `participant:5002` instead of `localhost:5002`. Inside the kube cluster, `participant:5002` routes to grpc ledger port.

### Log Viewing

You can install tools such as [Stern](https://github.com/stern/stern) to faciliate log viewing. For example, using Stern and after setting up your `KUBECONFIG` to point to the right file, you can stream all logs to your console.

```bash
stern participant -n validator1 --tail 0
```

