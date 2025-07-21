# Overview

Welcome to the `5N Dashboard`, a performance and intuitive application designed to support Canton validator operation. The app simplifies the management of DAR files, users and party on the validator. It is designed to be lean, simple, and fast, easily deployable as a single binary written in Golang, with a low memory footprint. This single binary including both of the backend and the UI.

Beyond DAR file management, this application provides comprehensive support for managing parties and users directly on your Canton validator. You can effortlessly onboard new participants, manage their permissions, and ensure a secure and efficient operational environment.

One of the standout features is its interactive shell. This allows you to execute shell scripts directly within your Kubernetes cluster, with the output streamed in real-time to your browser. This capability provides unparalleled control and visibility, making debugging, deployment, and operational tasks significantly more efficient. All the common credential is auto populate and set in environment variable for your convenience.

`5N Dashboard` was designed to be stateless, operate along with en existing cluster, you can add it to a fresh new system, or to an already deployed validator. It doesn't want to control and dictacte how you deploy your Canton validator. As long as we can connect to Ledger API and Ledger Admin API, `5N Dashboard` will works.

`5N Dashboard` goal is to help developers and administrators with the tools needed to effectively deploy, monitor, maintain and backup both of the node and their Canton-based applications.

We welcome any feedback, email us at nodesupport@fivenorth.io

## Features

- Managar DAR files, multi uploads.
- Manage User&amp; Party.
- Interactive Shell Execution/History
- Backup Identitities Dump

## Upcoming 

- Auto Backup Node Identities and Database to cloud: support S3, GCS, and Wasabi and CloudFlare R2

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
  <source src="/assets/5n-dashboard/2025-06-27 00-04-28.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Shell execution

<video controls>
  <source src="/assets/5n-dashboard/2025-06-27 00-17-44.mp4" type="video/mp4">
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


