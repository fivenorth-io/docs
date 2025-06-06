# Hosted Node Bundle

Five North Hosted Node Bundle is an archive contains a few things:

- VPN Profile
- Kube Config for DevNet/MainNet and TesNet if applicable

You should have received a bundle share securely through Bitwarden. Download it, extract it somewhere. It usually contains 3 files

- `<your-company-name>-<your-name>.conf`: this is your vpn profile
- `devnet`: this is kubeconfig for devnet. You should store it somewhere. A good place is ~/.kube/your-company-name/devnet
- `mainnet`: similar to above for mainnet. ~/.kube/your-company-name/mainnet

Install https://www.wireguard.com/install/ client for your machine. Then import the VPN profile

## Development Setup

### Port forward to ledger grpc 

When you want to connect to the k8s cluster, activate your vpn. From the shell run the below command

```
# replace to mainnet but please be super careful. Uploading wrong dar file risk brisk your validator. For mainnet best to drive it through your CI system. 

export KUBECONFIG=~/.kube/your-company-name/devnet
```

Now you will be able to interact with kubernetes and can do port forward to participant as follow

```
 kubectl -n validator1 port-forward $(kubectl -n validator1 get pod | grep participant |awk '{print $1}') 5002:5002
```

Now using `grpcurl` you can interact with the ledger grpc 

```
grpcurl -plaintext localhost:5002 com.digitalasset.canton.admin.participant.v30.PackageService.ListDars
```

When you deploy your app to the cluster, you will just use `participant:5002` instead of  localhost:5002 . Inside the kube cluster, participant:5002 routes to grpc ledger port.

### Log Viewing

You can install tool such as https://github.com/stern/stern

Then after setting up your KUBECONFIG to point to the right file, use

```
stern participant -n validator1 --tail 0
```

you will be able to stream all the log to your console.
