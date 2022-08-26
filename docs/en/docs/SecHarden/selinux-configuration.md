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
## Adding Policies
-   Obtain and add missing policies based on the audit logs. (The audit service must be enabled and SELinux access denial logs must exist in audit logs.)
    1. Check whether the audit logs contain SELinux access denial logs. Use the actual audit log path.
    ```
    # grep avc /var/log/audit/audit.log*
    ```
    2. Query missing rules.
    ```
    # audit2allow -a /var/log/audit/audit.log*
    ```
    3. Generate a policy module based on the missing rule and name it **demo**.
    ```
    # audit2allow -a /var/log/audit/audit.log* -M demo
    ******************** IMPORTANT ***********************
    To make this policy package active, execute:
    semodule -i demo.pp
    ```
    4. Load the **demo** policy module.
    ```
    # semodule -i demo.pp
    ```

-   Compose and add the SELinux policy module.
    1. Compose the FC file (if the security context of file creation is involved).
    ```
    # cat demo.fc 
    /usr/bin/example	--	system_u:object_r:example_exec_t:s0
    /resource	--	system_u:object_r:resource_file_t:s0
    ```
    1. Compose the TE file (example).
    ```
    # cat demo.te 
    module demo 1.0;
    require
    {
    	role unconfined_r;
    	role system_r;
    	type user_devpts_t;
    	type root_t;
    	attribute file_type;
    	attribute domain;
    	class dir { getattr search add_name create open remove_name rmdir setattr write };
    	class file { entrypoint execute getattr open read map setattr write create };
    	class process { sigchld rlimitinh siginh transition setcap getcap };
    	class unix_stream_socket { accept bind connect listen recvfrom sendto listen create lock read write getattr setattr getopt setopt append shutdown ioctl connectto };
    	class capability { chown dac_override dac_read_search };
    	class chr_file { append getattr ioctl read write };
    };
    role unconfined_r types example_t;
    role system_r types example_t;
    type example_exec_t, file_type;
    type resource_file_t, file_type;
    type example_t, domain;
    allow example_t user_devpts_t : chr_file { append getattr ioctl read write };
    allow example_t file_type : dir { getattr search };
    allow example_t example_exec_t : file { entrypoint execute getattr map open read };
    allow domain example_exec_t : file { execute getattr map open read };
    allow example_t example_exec_t : process { sigchld };
    allow domain example_t : process { rlimitinh siginh transition };
    allow example_t resource_file_t : file { create getattr open read setattr write };
    allow example_t root_t : dir { add_name create getattr open remove_name rmdir search setattr write };
    allow example_t example_t : unix_stream_socket { accept append bind connect create getattr getopt ioctl listen listen lock read recvfrom sendto setattr setopt shutdown write };
    allow example_t domain : unix_stream_socket { connectto };
    allow example_t example_t : capability { chown dac_override dac_read_search };
    allow example_t example_t : process { getcap setcap };
    type_transition domain example_exec_t : process example_t;
    type_transition example_t root_t : file resource_file_t "resource";
    ```
    1. Compile **demo.te** as **demo.mod**.
    ```
    # checkmodule -Mmo demo.mod demo.te
    ```
    1. Package **demo.mod** and **demo.fc** as a policy module file.
    ```
    semodule_package -m demo.mod -f demo.fc -o demo.pp
    ```
    1. Load the policy module.
    ```
    # semodule -i demo.pp
    ```
    1. Delete the loaded policy module file.
    ```
    # semodule -r demo
    libsemanage.semanage_direct_remove_key: Removing last demo module (no other demo module exists at another priority).
    ```

## Function Verification
-   SELinux adopts an whitelist mechanism. Modules that are not configured with proper policies may fail to run properly due to lack of permissions. It is necessary to verify the functions of the modules and configure reasonable rules.
    1. Check whether the audit service is enabled:
    ```
    # systemctl status auditd
    ```
    1. Set the SELinux mode to permissive. (Alarms are printed, but SELinux polices are not enforced. For details, see [Configuration Description](#configuration-description).)
    ```
    # getenforce
    Permissive
    ```
    1. Execute all function cases of the test module and check the SELinux access denial logs in the audit logs.
    ```
    # grep avc /var/log/audit/audit.log*
    ```
    1. Analyze access denial logs and filter out missing rules.
    ```
    type=AVC msg=audit(1596161643.271:1304): avc: denied { read } for pid=1782603 comm="smbd" name=".viminfo" dev="dm-0" ino=2488208 scontext=system_u:system_r:smbd_t:s0 tcontext=staff_u:object_r:user_home_t:s0 tclass=file permissive=1
    Indicates that the smbd process (security context: system_u:system_r:smbd_t:s0) is denied the permission to read the .viminfo file (security context: staff_u:object_r:user_home_t:s0).
    permissive=1 indicates that the permissive mode is running. This log records only the operations that are not forbidden.
    ```
    1. Supplement the missing rules by referring to [Adding Policies](#adding-policies).

## Precautions

-   Before enabling SELinux, you are advised to upgrade selinux-policy to the latest version using DNF. Otherwise, applications may fail to run properly. For example:

    ```
    dnf update selinux-policy -y
    ```
    
-   If the system cannot be started due to improper SELinux configuration (for example, a policy is deleted by mistake or no proper rule or security context is configured), you can add **selinux=0** to the startup parameters to disable SELinux.

-   After SELinux is enabled, permission check is performed on access behaviors, which affects the operating system performance to some extent (related to the frequency of access operations in the running environment).
