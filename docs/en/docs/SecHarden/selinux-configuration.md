# SELinux Configuration

## Overview

Discretionary access control \(DAC\) determines whether a resource can be accessed based on users, groups, and other permissions. It does not allow the system administrator to create comprehensive and fine-grained security policies. SELinux \(Security-Enhanced Linux\) is a module of the Linux kernel and a security subsystem of Linux. SELinux implements mandatory access control \(MAC\). Each process and system resource has a special security label. In addition to the principles specified by the DAC, the SELinux needs to determine whether each type of process has the permission to access a type of resource.

By default, openEuler uses SELinux to improve system security. SELinux has three modes:

-   **permissive**: The SELinux outputs alarms but does not forcibly execute the security policies.
-   **enforcing**: The SELinux security policies are forcibly executed.
-   **disabled**: The SELinux security policies are not loaded.

## Configuration Description

-   Obtain the SELinux running status:
    ```
    # getenforce
    Enforcing
    ```

-   Set the enforcing mode when SELinux is enabled:
    ```
    # setenforce 1
    # getenforce
    Enforcing
    ```

-   Set the permissive mode when SELinux is enabled:
    ```
    # setenforce 0
    # getenforce
    Permissive
    ```

-   Disable SELinux when SELinux is enabled. (A reboot is required.)
    1. Modify the SELinux configuration file **/etc/selinux/config** and set **SELINUX=disabled**.
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=disabled
    2. Reboot the system.
    ```
    # reboot
    ```
    3. The status is changed successfully.
    ```
    # getenforce
    Disabled
    ```

-   Set the permissive mode when SELinux is disabled:
    1. Modify the SELinux configuration file **/etc/selinux/config** and set **SELINUX=permissive**.
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=permissive
    2. Create the **.autorelabel** file in the root directory.
    ```
    # touch /.autorelabel
    ```
    3. Reboot the system. The system will restart twice.
    ```
    # reboot
    ```
    4. The status is changed successfully.
    ```
    # getenforce
    Permissive
    ```

-   Set the enforcing mode when SELinux is disabled:
    1. Set SELinux to the permissive mode.
    2. Modify the SELinux configuration file **/etc/selinux/config** and set **SELINUX=enforcing**.
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=enforcing
    ```
    3. Reboot the system.
    ```
    # reboot
    ```
    4. The status is changed successfully.
    ```
    # getenforce
    Enforcing
    ```

## SELinux Commands

-   Query the SELinux status.  **SELinux status**  indicates the SELinux status.  **enabled**  indicates that SELinux is enabled, and  **disabled**  indicates that SELinux is disabled.  **Current mode**  indicates the current mode of the SELinux.

    ```
    # sestatus
    SELinux status:                 enabled
    SELinuxfs mount:                /sys/fs/selinux
    SELinux root directory:         /etc/selinux
    Loaded policy name:             targeted
    Current mode:                   enforcing
    Mode from config file:          enforcing
    Policy MLS status:              enabled
    Policy deny_unknown status:     allowed
    Memory protection checking:     actual (secure)
    Max kernel policy version:      31
    ```

## Precautions

-   Before enabling SELinux, you are advised to upgrade selinux-policy to the latest version using DNF. Otherwise, applications may fail to run properly. For example:

    ```
    dnf update selinux-policy -y
    ```
    
-   If the system cannot be started due to improper SELinux configuration (for example, a policy is deleted by mistake or no proper rule or security context is configured), you can add **selinux=0** to the startup parameters to disable SELinux.

