gala-ragdoll Usage Guide
============================

## Installation

#### Manual Installation

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

  Run the following commands to download and install gala--ragdoll and its dependencies.

  ```shell
  yum install gala-ragdoll # A-Ops configuration source tracing service
  yum install python3-gala-ragdoll
  
  yum install gala-spider # A-Ops architecture awareness service
  yum install python3-gala-spider
  ```

- Installing using the RPM packages. Download **gala-ragdoll-vx.x.x-x.oe1.aarch64.rpm**, and then run the following commands to install the modules. (`x.x-x` indicates the version. Replace it with the actual version number.)

  ```shell
  rpm -ivh gala-ragdoll-vx.x.x-x.oe1.aarch64.rpm
  ```



#### Installing Using the A-Ops Deployment Service

##### Editing the Task List

Modify the deployment task list and enable the steps for gala_ragdoll:

```yaml
---
step_list:
 ...
 gala_ragdoll:
   enable: false
   continue: false
 ...
```

##### Editing the Host List

For details about the host configuration, see section 2.2.3.10 in the [Deployment Management Manual](./deployment-management-manual.md).

##### Editing the Variable List

For details about the variable configuration, see section 2.2.3.10 in the [Deployment Management Manual](./deployment-management-manual.md).

##### Executing the Deployment Task

See section 3 in the [Deployment Management Manual](./deployment-management-manual.md) to execute the deployment task.



### Configuration File Description

```/etc/yum.repos.d/openEuler.repo``` is the configuration file used to specify the Yum source address. The content of the configuration file is as follows:

```
[OS]
name=OS
baseurl=http://repo.openeuler.org/openEuler-20.09/OS/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://repo.openeuler.org/openEuler-20.09/OS/$basearch/RPM-GPG-KEY-openEuler
```

### YANG Model Description

`/etc/yum.repos.d/openEuler.repo` is expressed using the YANG language. For details, see `gala-ragdoll/yang_modules/openEuler-logos-openEuler.repo.yang`.
The following extended fields are added:

| Extended Field Name | Extended Field Format| Example|
| ------------ | ---------------------- | ----------------------------------------- |
| path         | OS_TYPE:CONFIGURATION_FILE_PATH | openEuler:/etc/yum.repos.d/openEuler.repo |
| type         | Configuration file type | ini, key-value, json, text, and more |
| spacer       | Spacer between a configuration item and its value | " ", "=", ":", and more |

Attachment: Learning the YANG language: https://datatracker.ietf.org/doc/html/rfc7950/.

### Creating Domains using Configuration Source Tracing

#### Viewing the configuration file.

gala-ragdoll contains the configuration file of the configuration source tracing.

```
[root@openeuler-development-1-1drnd ~]# cat /etc/ragdoll/gala-ragdoll.conf
[git] // Defines the current Git information, including the directory and user information of the Git repository.
git_dir = "/home/confTraceTestConf" 
user_name = "user"
user_email = "email"

[collect] // The collect interface provided by A-Ops.
collect_address = "http://192.168.0.0:11111"
collect_api = "/manage/config/collect"

[ragdoll]
port = 11114

```

#### Creating the Configuration Domain


![](./figures/create_service_domain.png)



#### Adding Managed Nodes to the Configuration Domain

![](./figures/add_node.png)



#### Adding Configurations to the Configuration Domain 


![](./figures/add_config.png)

#### Querying the Expected Configuration


![](./figures/view_expected_config.png)

#### Deleting Configurations

![](./figures/delete_config.png)

#### Querying the Actual Configuration

![](./figures/query_actual_config.png)



#### Verifying the Configuration


![](./figures/query_status.png)



#### Configuration Synchronization

Not provided currently.
