# Overview

Welcome to the `5N CPM`, short for `5N Canton Package Manager`, a performance and intuitive application designed to support Canton validator operation. The app simplifies the management of DAR files, users and party on the validator. It is designed to be lean, simple, and fast, easily deployable as a single binary written in Golang, with a low memory footprint. This single binary including both of the backend and the UI.

Beyond DAR file management, this application provides comprehensive support for managing parties and users directly on your Canton validator. You can effortlessly onboard new participants, manage their permissions, and ensure a secure and efficient operational environment.

One of the standout features is its interactive shell. This allows you to execute shell scripts directly within your Kubernetes cluster, with the output streamed in real-time to your browser. This capability provides unparalleled control and visibility, making debugging, deployment, and operational tasks significantly more efficient. All the common credential is auto populate and set in environment variable for your convenience.

5N CPM goal is to help developers and administrators with the tools needed to effectively deploy, monitor, maintain and backup both of the node and their Canton-based applications.

We welcome any feedback, email us at nodesupport@fivenorth.io

## Features

- Managar DAR files, multi uploads.
- Manage User&amp; Party.
- Auto Backup Node Identities and Database to cloud: support S3, GCS, and Wasabi and CloudFlare R2
- Interactive Shell Execution/History

## Demo Video

<video controls>
  <source src="/assets/5n-cpm/2025-06-26-manage-dar.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Screenshots

### DAR files management

![DAR Management](../assets/5n-cpm/dar.png){: width="25%"} ![DAR Upload](../assets/5n-cpm/dar-upload.png){: width="25%"}

### Users Management

![Create User](../assets/5n-cpm/create-user.png){: width="25%"} ![List User](../assets/5n-cpm/list-user.png){: width="25%"}

### Parties Management

![Create Party](../assets/5n-cpm/create-party.png){: width="25%"} ![List Party](../assets/5n-cpm/list-party.png){: width="25%"}

### Backup

![Backup](../assets/5n-cpm/backup.png){: width="25%"}

### Shell

![Shell](../assets/5n-cpm/shell.png){: width="25%"}


