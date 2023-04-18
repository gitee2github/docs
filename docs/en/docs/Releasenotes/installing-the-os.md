# Installing the OS

## Release Files

The openEuler release files include [ISO release packages](http://archives.openeuler.openatom.cn/openEuler-20.09/ISO/), [VM images](http://archives.openeuler.openatom.cn/openEuler-20.09/virtual_machine_img/), [container images](http://archives.openeuler.openatom.cn/openEuler-20.09/docker_img/), and [repo sources](http://archives.openeuler.openatom.cn/openEuler-20.09/). The following tables describe those files respectively.

**Table 1** ISO release packages

| Name                                       | Description                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| openEuler-20.09-aarch64-dvd.iso            | Basic installation ISO file of the AArch64 architecture, including the core components for running the minimum system. |
| openEuler-20.09-everything-aarch64-dvd.iso | Full installation ISO file of the AArch64 architecture, including all components for running the entire system. |
| openEuler-20.09-debuginfo-aarch64-dvd.iso  | ISO file for openEuler debugging in the AArch64 architecture, including the symbol table information required for debugging. |
| openEuler-20.09-x86_64-dvd.iso             | Basic installation ISO file of the x86_64 architecture, including the core components for running the minimum system. |
| openEuler-20.09-everything-x86_64-dvd.iso  | Full installation ISO file of the x86_64 architecture, including all components for running the entire system. |
| openEuler-20.09-debuginfo-x86_64-dvd.iso   | ISO file for openEuler debugging in the x86_64 architecture, including the symbol table information required for debugging. |
| openEuler-20.09-source-dvd.iso             | ISO file of the openEuler source code.                       |

**Table 2** VM images

| Name                             | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| openEuler-20.09.aarch64.qcow2.xz | VM image of openEuler in the AArch64 architecture. |
| openEuler-20.09.x86_64.qcow2.xz  | VM image of openEuler in the x86_64 architecture.  |

>![](./public_sys-resources/icon-note.gif) **NOTE:**
>
>The default password of root user of the VM image is **openEuler12#$**. Change the password upon the first login.

**Table 3** Container images

| Name                            | Description                                               |
| ------------------------------- | --------------------------------------------------------- |
| openEuler-docker.aarch64.tar.xz | Container image of openEuler in the AArch64 architecture. |
| openEuler-docker.x86_64.tar.xz  | Container image of openEuler in the x86_64 architecture.  |

**Table 4** Repo sources

| Name                | Description                               |
| ------------------- | ----------------------------------------- |
| ISO                 | Stores ISO images.                        |
| OS                  | Stores basic software package sources.    |
| debuginfo           | Stores debugging package sources.         |
| docker_img          | Stores container images.                  |
| virtual_machine_img | Stores VM images.                         |
| everything          | Stores full software package sources.     |
| extras              | Stores extended software package sources. |
| source              | Stores source code software package.      |
| update              | Stores upgrade software package sources.  |
| EPOL                | Stores extended openEuler packages.       |

## Minimum Hardware Specifications

The following table lists the minimum hardware specifications for openEuler 20.09.

**Table 5** Minimum hardware requirements

| Component  | Minimum Hardware Specification                      |
| ---------- | --------------------------------------------------- |
| CPU        | Kunpeng 920 (AArch64) / x86_64 (later than Skylake) |
| Memory     | ≥ 8 GB                                              |
| Hard drive | ≥ 120 GB                                            |

## Hardware Compatibility

The following table lists the supported servers and configurations of openEuler.

**Table 6** Supported servers and configurations

<table>
  <tr>
    <th>Vendor</th>
    <th>Server</th>
    <th>Server Model</th>
    <th>Component</th>
 <th>Typical Configuration</th>
  </tr>
  <tr>
    <td rowspan="3">Huawei</td>
    <td rowspan="3">TaiShan 200</td>
    <td rowspan="3">2280 balanced model</td>
 <td>CPU</td>
 <td>Kunpeng 920</td>
  </tr>
  <tr>
 <td>Memory</td>
 <td>4 x 32 GB 2933MHz</td>
  </tr>
  <tr>
    <td>Network</td>
    <td>TM210</td>
  </tr>
  <tr>
    <td rowspan="3">Huawei</td>
    <td rowspan="3">FusionServer Pro</td>
    <td rowspan="3">2288H V5 rack server</td>
 <td>CPU</td>
 <td>Intel(R) Xeon(R) Gold 5118 CPU @ 2.30GHz</td>
  </tr>
  <tr>
 <td>Memory</td>
 <td>4 x 32 GB 2400MHz</td>
  </tr>
  <tr>
    <td>Network</td>
    <td>X722</td>
  </tr>
</table>
