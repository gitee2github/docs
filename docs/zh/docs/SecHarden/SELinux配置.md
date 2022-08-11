# SELinux配置

## 概述

自主访问控制DAC（Discretionary Access Control）基于用户、组和其他权限，决定一个资源是否能被访问的因素是某个资源是否拥有对应用户的权限，它不能使系统管理员创建全面和细粒度的安全策略。SELinux（Security-Enhanced Linux）是Linux内核的一个模块，也是Linux的一个安全子系统。SELinux的实现了强制访问控制MAC（Mandatory Access Control ），每个进程和系统资源都有一个特殊的安全标签，资源能否被访问除了DAC规定的原则外，还需要判断每一类进程是否拥有对某一类资源的访问权限。

openEuler默认使用SELinux提升系统安全性。SELinux分为三种模式：

-   permissive：SELinux仅打印告警而不强制执行。
-   enforcing：SELinux安全策略被强制执行。
-   disabled：不加载SELinux安全策略。

## 配置说明

-   获取当前SELinux运行状态：
    ```
    # getenforce
    Enforcing
    ```

-   SELinux开启的前提下，设置运行状态为enforcing模式：
    ```
    # setenforce 1
    # getenforce
    Enforcing
    ```

-   SELinux开启的前提下，设置运行状态为permissive模式：
    ```
    # setenforce 0
    # getenforce
    Permissive
    ```

-   SELinux开启的前提下，设置当前SELinux运行状态为disabled（关闭SELinux，需要重启系统）。
    1. 修改SELinux配置文件/etc/selinux/config，设置“SELINUX=disabled”。
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=disabled
    ```
    2. 重启系统：
    ```
    # reboot
    ```
    3. 状态切换成功：
    ```
    # getenforce
    Disabled
    ```

-   SELinux关闭的前提下，设置SELinux运行状态为permissive：
    1. 修改SELinux配置文件/etc/selinux/config，设置“SELINUX=permissive”：
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=permissive
    ```
    2. 在根目录下创建.autorelabel文件：
    ```
    # touch /.autorelabel
    ```
    3. 重启系统，此时系统会重启两次：
    ```
    # reboot
    ```
    4. 状态切换成功：
    ```
    # getenforce
    Permissive
    ```

-   SELinux关闭的前提下，设置SELinux运行状态为enforcing：
    1. 按照上一步骤所述，设置SELinux运行状态为permissive。
    2. 修改SELinux配置文件/etc/selinux/config，设置“SELINUX=enforcing”：
    ```
    # cat /etc/selinux/config | grep "SELINUX="
    SELINUX=enforcing
    ```
    3. 重启系统：
    ```
    # reboot
    ```
    4. 状态切换成功：
    ```
    # getenforce
    Enforcing
    ```

## SELinux相关命令

-   查询运行SELinux的系统状态。SELinux status表示SELinux的状态，enabled表示启用SELinux，disabled表示关闭SELinux。Current mode表示SELinux当前的安全策略。

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
## 策略添加
-   从audit日志中获取并添加缺失策略（需要audit服务开启且audit日志中已经存在SELinux访问拒绝日志）。
    1. 查询audit日志中是否有SELinux访问拒绝日志，其中audit日志的路径视具体情况决定。
    ```
    # grep avc /var/log/audit/audit.log*
    ```
    2. 查询缺失规则。
    ```
    # audit2allow -a /var/log/audit/audit.log*
    ```
    3. 根据缺失规则生成一个策略模块，命名为demo。
    ```
    # audit2allow -a /var/log/audit/audit.log* -M demo
    ******************** IMPORTANT ***********************
    To make this policy package active, execute:
    semodule -i demo.pp
    ```
    4. 加载demo策略模块。
    ```
    # semodule -i demo.pp
    ```

-   编写并添加SELinux策略模块。
    1. 编写FC文件（涉及新增文件安全上下文需要编写）。
    ```
    # cat demo.fc 
    /usr/bin/example	--	system_u:object_r:example_exec_t:s0
    /resource	--	system_u:object_r:resource_file_t:s0
    ```
    2. 编写TE文件（仅供参考）。
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
    3. 编译demo.te为demo.mod。
    ```
    # checkmodule -Mmo demo.mod demo.te
    ```
    4. 打包demo.mod和demo.fc为策略模块文件。
    ```
    semodule_package -m demo.mod -f demo.fc -o demo.pp
    ```
    5. 加载策略模块。
    ```
    # semodule -i demo.pp
    ```
    6. 删除加载的策略模块。
    ```
    # semodule -r demo
    libsemanage.semanage_direct_remove_key: Removing last demo module (no other demo module exists at another priority).
    ```

## 功能验证
-   SELinux为白名单机制，未配置合理策略的模块可能会由于缺少权限无法正常运行。固对模块进行功能验证并适配合理的规则是很有必要的。
    1. 查看audit服务是否开启。
    ```
    # systemctl status auditd
    ```
    2. 设置SELinux模式为permissive(仅打印告警而不强制执行，参考 配置说明 )。
    ```
    # getenforce
    Permissive
    ```
    3. 全量跑测试模块的功能用例，查看audit日志中SELinux访问拒绝日志。
    ```
    # grep avc /var/log/audit/audit.log*
    ```
    4. 分析访问拒绝日志，并过滤出缺失的合理规则。
    ```
    type=AVC msg=audit(1596161643.271:1304): avc: denied { read } for pid=1782603 comm="smbd" name=".viminfo" dev="dm-0" ino=2488208 scontext=system_u:system_r:smbd_t:s0 tcontext=staff_u:object_r:user_home_t:s0 tclass=file permissive=1
    表示进程smbd（安全上下文为system_u:system_r:smbd_t:s0）对文件.viminfo（安全上下文为staff_u:object_r:user_home_t:s0）执行文件读操作被权限拒绝。
    permissive=1表示当前运行的是permissive模式，该日志只记录未执行禁止。
    ```
    4. 参考 策略添加，将缺少的合理规则补全。

## 注意事项

-   如用户需使能SELinux功能，建议通过dnf升级方式将selinux-policy更新为最新版本，否则应用程序有可能无法正常运行。升级命令示例：

    ```
    dnf update selinux-policy -y
    ```
    
-   如果用户由于SELinux配置不当（如误删策略或未配置合理的规则或安全上下文）导致系统无法启动，可以在启动参数中添加selinux=0，关闭SELinux功能，系统即可正常启动。

-   开启SELinux后，会对访问行为进行权限检查，对操作系统性能会有一定程度（与运行环境访问操作频率相关）的影响。