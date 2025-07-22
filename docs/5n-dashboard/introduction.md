# Overview

Welcome to the `5N Dashboard`, a high-performance and intuitive application designed to support Canton validator operations. The app simplifies the management of DAR files, users and parties on the validator. It is designed to be lean, simple, and fast, easily deployable as a single binary written in Golang, with a low memory footprint. This single binary includes both the backend and the frontend.

Beyond DAR file management, the Dashboard provides comprehensive support for managing parties and users directly on your Canton validator. You can effortlessly onboard new participants, manage their permissions, and ensure a secure and efficient operational environment.

One of the standout features is the interactive shell. It allows executing shell scripts directly within the Kubernetes cluster, with the output streamed in real-time to the browser. This capability provides unparalleled control and visibility, making debugging, deployment, and operational tasks significantly more efficient. All common credentials are auto‑populated and set as environment variables for convenience.

The `5N Dashboard` is designed to be stateless. It can be deployed alongside an existing cluster, added to a fresh new system, or integrated with an already deployed standalone validator. It doesn’t try to control or dictate how you deploy your Canton validator. As long as it can connect to the Ledger API and the Ledger Admin API, the `5N Dashboard` works as expected.

The goal of the `5N Dashboard` is to give developers and administrators the tools needed to effectively deploy, monitor, maintain, and back up both the node and their Canton‑based applications.

We welcome any feedback, email us at nodesupport@fivenorth.io

## Features

- DAR file management with multi‑file uploads and version control.
- Manage users and parties.
- Interactive Shell Execution/History
- Backup identities dump

## Upcoming 

- Auto‑backup node identities and databases to the cloud (supporting S3, GCS, Wasabi, and Cloudflare R2).

## Demo Videos

### DARs management

<video controls>
  <source src="/assets/5n-dashboard/dar-management.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Users management

<video controls>
  <source src="/assets/5n-dashboard/manage-user.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Parties management

<video controls>
  <source src="/assets/5n-dashboard/manage-party.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Shell execution

<video controls>
  <source src="/assets/5n-dashboard/run-shell.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Screenshots

### DAR files management

![DAR Management](../assets/5n-dashboard/001 list dar.png){: width="20%"} ![Search DAR](../assets/5n-dashboard/002 seach dar.png){: width="20%"} ![Upload DAR](../assets/5n-dashboard/003 upload dar.png){: width="20%"} ![Upload DAR](../assets/5n-dashboard/004 upload suceed.png){: width="20%"}

### Users Management
![List User](../assets/5n-dashboard/010 list user.png){: width="25%"} ![Create User](../assets/5n-dashboard/011 create user.png){: width="25%"} ![Delete User](../assets/5n-dashboard/012 delete user.png){: width="25%"}


### Parties Management

![List Party](../assets/5n-dashboard/020 list party.png){: width="25%"} ![Local Party](../assets/5n-dashboard/021 local party.png){: width="25%"} ![Create Party](../assets/5n-dashboard/022 create party.png){: width="25%"} 

### Backup

![Backup](../assets/5n-dashboard/030 backup.png){: width="25%"}

### Shell

![Shell](../assets/5n-dashboard/040 shell.png){: width="25%"}


