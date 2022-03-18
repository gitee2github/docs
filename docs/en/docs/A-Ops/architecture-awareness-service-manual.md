# Architecture Awareness Service Manual

## Installation

### Manual Installation

- Installing using the repo source mounted by Yum.

  Configure the Yum sources **openEuler21.09** and **openEuler21.09:Epol** in the **/etc/yum.repos.d/openEuler.repo** file.

  ```ini
  [openEuler21.09] # openEuler 21.09 official source
  name=openEuler21.09
  baseurl=https://repo.openeuler.org/openEuler-21.09/everything/$basearch/ 
  enabled=1
  gpgcheck=1
  gpgkey=https://repo.openeuler.org/openEuler-21.09/everything/$basearch/RPM-GPG-KEY-openEuler
  
  [Epol] # openEuler 21.09:Epol official source
  name=Epol
  baseurl=https://repo.openeuler.org/openEuler-21.09/EPOL/main/$basearch/ 
  enabled=1
  gpgcheck=1
  gpgkey=https://repo.openeuler.org/openEuler-21.09/OS/$basearch/RPM-GPG-KEY-openEuler
  ```

  Run the following commands to download and install gala-ragdoll and its dependencies.

  ```shell
  # A-Ops architecture awareness service, usually installed on the master node
  yum install gala-spider 
  yum install python3-gala-spider
  
  # A-Ops architecture awareness probe, usually installed on the master node
  yum install gala-gopher 
  ```

- Installing using the RPM packages. Download **gala-ragdoll-vx.x.x-x.oe1.aarch64.rpm**, and then run the following commands to install the modules. (`x.x-x` indicates the version. Replace it with the actual version number.)

  ```shell
  rpm -ivh gala-spider-vx.x.x-x.oe1.aarch64.rpm
  
  rpm -ivh gala-gopher-vx.x.x-x.oe1.aarch64.rpm
  ```



### Installing Using the A-Ops Deployment Service

#### Editing the Task List

Modify the deployment task list and enable the steps for gala_ragdol:

```yaml
---
step_list:
 ...
 gala_gopher:
   enable: false
   continue: false
 gala_spider:
   enable: false
   continue: false
 ...
```

#### Editing the Host List

For details about the host configuration, see section 2.2.3.8 in the [Deployment Management Manual](./deployment-management-manual.md).

#### Editing the Variable List

For details about the variable configuration, see section 2.2.3.8 in the [Deployment Management Manual](./deployment-management-manual.md).

#### Executing the Deployment Task

See section 3 in the [Deployment Management Manual](./deployment-management-manual.md) to execute the deployment task.