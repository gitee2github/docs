# 账户权限说明
##### 注意事项
请注意，产品功能运行涉及以下账户，如[表1](#sheet1)所示，请注意信息保护，定期维护账户安全。

>![](public_sys-resources/icon-notice.gif) **须知：** 
>由于root用户拥有最高权限，直接使用root用户登录服务器可能会存在安全风险。您可以通过配置禁止root用户SSH登录的选项，来提升系统安全性。具体配置如下：先以普通用户登录服务器，切换至root登录后检查/etc/ssh/sshd\_config配置项PermitRootlogin，如果显示no，说明禁止了root用户登录；如果显示yes，则需要将配置项PermitRootlogin设置为no。

**表 1**  账户清单
<a id="sheet1"></a>
<table>
    <tr>
        <th>应用环境</th>
        <th>用户名/用户类型</th>
        <th>默认密码</th>
        <th>用户用途</th>
        <th>备注</th>
    </tr>
    <tr>
        <td rowspan="2">x2openEuler工具（web端）</td>
        <td>x2openEulerAdmin</td>
        <td>NA</td>
        <td>x2openEuler工具管理员账户</td>
        <td>
            <ul>
                <li>创建工具普通用户</li>
                <li>进行工具系统配置</li>
                <li>创建、执行、管理工具任务</li>
                <li>管理工具弱口令字典</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><i>x2openEulerAdmin</i></td>
        <td>NA</td>
        <td>
            <p>x2openEuler工具普通用户</p>
            说明：<br>
            普通用户由x2openEuler管理员用户创建。
        </td>
        <td>创建、执行、管理x2openEuler任务</td>
    </tr>
    <tr>
        <td rowspan="3">x2openEuler工具部署环境</td>
        <td>x2openEuler</td>
        <td>NA</td>
        <td>x2openEuler 评估分析功能专有用户</td>
        <td>默认禁止远程登录</td>
    </tr> 
    <tr>
        <td>root</td>
        <td>NA</td>
        <td>工具部署环境root用户</td>
        <td>部署x2openEuler工具</td>
    </tr>    
    <tr>
        <td><i>User</i></td>
        <td>NA</td>
        <td>工具部署环境普通用户</td>
        <td>部署x2openEuler工具</td>
    </tr>  
    <tr>
        <td rowspan="2">待升级节点</td>
        <td>root</td>
        <td>NA</td>
        <td>待升级节点root用户</td>
        <td>进行升级任务使用</td>
    </tr>
    <tr>
        <td><i>User</i></td>
        <td>NA</td>
        <td>待升级节点普通用户</td>
        <td>工具创建任务时使用</td>
    </tr>
    <tr>
        <td rowspan="2">x2openEuler工具（MariaDB数据库）</td>
        <td>root</td>
        <td>NA</td>
        <td>MariaDB管理员用户</td>
        <td>创建x2openEuler普通用户、数据库维护</td>
    </tr>
    <tr>
        <td>x2openEuler</td>
        <td>NA</td>
        <td>x2openEuler工具数据库用户</td>
        <td>x2openEuler工具数据库操作</td>
    </tr> 
</table>

# 工具使用说明
鲲鹏代码迁移工具安装完成后，存放在“/usr/local/x2openEuler/portal/service/”下的工具使用说明如[表2](#sheet2)。

**表 2**  工具使用说明
<table>
    <tr>
        <th>工具名称</th>
        <th>工具存放路径</th>
        <th>工具执行方式</th>
        <th>工具配置参数</th>
        <th>工具使用描述</th>
    </tr>
    <tr>
        <td>change_ip_x2openEuler.sh</td>
        <td>/usr/local/x2openEuler/portal/service/change_ip_x2openEuler.sh</td>
        <td>bash change_ip_x2openEuler.sh</td>
        <td>-</td>
        <td>修改x2openEuler工具web访问的IP地址。</td>
    </tr>
    <tr>
        <td>delete_file.sh</td>
        <td>/usr/local/x2openEuler/portal/service/delete_file.sh</td>
        <td>bash delete_file.sh</td>
        <td>-</td>
        <td>安全删除文件。</td>
    </tr>
    <tr>
        <td>mariadb.sh</td>
        <td>/usr/local/x2openEuler/portal/service/mariadb.sh</td>
        <td>bash mariadb.sh</td>
        <td>-</td>
        <td>数据库服务。</td>
    </tr>
    <tr>
        <td>service_daemon.sh</td>
        <td>/usr/local/x2openEuler/portal/service/service_daemon.sh</td>
        <td>bash service_daemon.sh</td>
        <td>-</td>
        <td>nginx和gunicorn服务检测。</td>
    </tr>
    <tr>
        <td>service_init.sh</td>
        <td>/usr/local/x2openEuler/portal/service/service_init.sh</td>
        <td>bash service_init.sh</td>
        <td>-</td>
        <td>初始化x2openEuler工具服务。</td>
    </tr>
    <tr>
        <td>set_ssh_host_key_check_config.sh</td>
        <td>/usr/local/x2openEuler/portal/service/set_ssh_host_key_check_config.sh</td>
        <td>bash set_ssh_host_key_check_config.sh</td>
        <td>-</td>
        <td>设置ssh连接是否启用匹配公钥。</td>
    </tr>
    <tr>
        <td>service_gunicorn.sh</td>
        <td>/usr/local/x2openEuler/portal/service/service_gunicorn.sh</td>
        <td>bash service_gunicorn.sh</td>
        <td>-</td>
        <td>gunicorn服务控制。</td>
    </tr>
    <tr>
        <td>service_nginx.sh</td>
        <td>/usr/local/x2openEuler/portal/service/service_nginx.sh</td>
        <td>bash service_nginx.sh</td>
        <td>-</td>
        <td>nginx服务控制。</td>
    </tr>
    <tr>
        <td>update_db_pwd.sh</td>
        <td>/usr/local/x2openEuler/portal/service/update_db_pwd.sh</td>
        <td>bash update_db_pwd.sh</td>
        <td>-</td>
        <td>修改x2openEuler密码后更新到工具使用。</td>
    </tr>
</table>

# 运行环境数据使用说明
##### 注意事项
请注意，产品功能涉及的数据使用场景如下如[表3](#sheet3)所示，请注意信息保护。
##### 运行环境数据场景使用说明
**表 3** 数据信息使用说明
<a id="sheet"></a>
<table>
    <tr>
        <th>收集信息的场景或功能</th>
        <th>收集信息使用的命令或文件</th>
        <th>信息采集必要性</th>
        <th>有无额外收集数据</th>
        <th>信息使用的目的</th>
        <th>信息存储及保护措施</th>
        <th>信息销毁</th>
    </tr>
    <tr>
        <td rowspan="2">
            <ul>
                <li>配置与硬件信息收集</li>
                <li>配置信息差异分析</li>
                <li>硬件兼容性评估</li>
            </ul>
        </td>
        <td>
            <ul>
                <li>/bin/cat /boot/grub2/grub.cfg</li>
                <li>/usr/sbin/lspci -nvvv</li>
                <li>/usr/sbin/lspci -xxx</li>
                <li>/bin/netstat -npl</li>
                <li>/usr/sbin/sysctl -a</li>
                <li>/usr/sbin/dmidecode -t bios -t system -t baseboard -t chassis -t processor -t memory -t cache -t connector -t slot</li>
                <li>/usr/sbin/dmidecode -s system-product-name</li>
                <li>/bin/cat /boot/efi/EFI/centos/grub.cfg</li>
                <li>/bin/cat /etc/default/grub</li>
            </ul>
        </td>
        <td>必须采集</td>
        <td>无</td>
        <td>用于进行硬件兼容性评估和配置信息差异分析。</td>
        <td rowspan="2">
            <ul>
                <li>硬件兼容性评估采集的数据存放到内存中，不做持久化保存。</li>
                <li>配置与硬件信息收集采集的数据，保存在文件中，文件属主、属组为x2openEuler，其它用户无权限。</li>
            </ul>
        </td>
        <td rowspan="2">
            <ul>
                <li>x2openEuler用户可以删除“/opt/x2openEuler/output/”目录下存储的配置与硬件信息收集采集的数据文件。</li>
                <li>工具卸载时会完全删除“/opt/x2openEuler/output/”目录下存储的配置与硬件信息收集采集的数据文件。</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>
            <ul>
                <li>/boot/grub2/grub.cfg</li>
                <li>/etc/default/grub</li>
                <li>/usr/include/asm/unistd_64.h</li>
                <li>/etc/fstab</li>
                <li>/etc/profile</li>
                <li>/etc/sysctl.conf</li>
                <li>/boot/conifg-*</li>
            </ul>
        </td>
        <td>必须采集</td>
        <td>无</td>
        <td>用于进行配置差异分析。</td>
    </tr>
</table>

# 相关链接
**表 4** 相关链接
<a id="sheet4"></a>
<table>
    <tr>
        <th>相关内容</th>
        <th>网址</th>
    </tr>
    <tr>   
        <td>openEuler开源社区</td>
        <td>https://www.openeuler.org/zh/</td>
    </tr>
    <tr>   
        <td>openEuler开发资源</td>
        <td>https://www.hikunpeng.com/developer/openEuler</td>
    </tr>
    <tr>   
        <td>openEuler repo源</td>
        <td>https://repo.openeuler.org/openEuler-20.03-LTS/ISO/</td>
    </tr>
    <tr>   
        <td>openEuler oec-application项目交流</td>
        <td>https://gitee.com/openeuler/oec-application</td>
    </tr>
    <tr>   
        <td>华为云开源镜像仓</td>
        <td>https://mirrors.huaweicloud.com/repository/conf/CentOS-AltArch-7.repo
            https://mirrors.huaweicloud.com/epel/7/$basearch
        </td>
    </tr>
    <tr>   
        <td>升级操作系统数据包</td>
        <td>https://repo.oepkgs.net/openEuler/rpm/openEuler-20.03-LTS-SP1/contrib/x2openEuler/noarch/Packages/</td>
    </tr>
</table>

# 术语

<table border=“0”>
    <tr>
        <td colspan=“2”>
        <b>F</b>
        </td>
    </tr>
    <tr>
        <td>服务器</td>
        <td>服务器是在网络环境中为客户（Client）提供各种服务的特殊计算机。</td>
    </tr>
    <tr>
        <td colspan=“2”><b>W</b></td>
    </tr>
    <tr>
        <td>物理机</td>
        <td>与宿主机相对，指部署了普通操作系统的主机或未部署操作系统的裸机。</td>
    </tr>
    <tr>
        <td colspan=“2”><b>X</b></td>
    </tr>
    <tr>
        <td>虚拟机</td>
        <td>在计算机科学中的体系结构里，是指一种特殊的软件，他可以在计算机平台和终端用户之间创建一种环境，而终端用户则是基于这个软件所创建的环境来操作软件。</td>
    </tr>
    <tr>
        <td colspan=“2”><b>Y</b></td>
    </tr>
    <tr>
        <td>业务软件</td>
        <td>指业务运行所安装的主软件，不包括软件安装和运行的依赖软件。</td>
</table>

# 缩略语

<table border="0">
    <tr>
        <td colspan="3">
        <b>B</b>
        </td>
    </tr>
    <tr>
        <td>BIN</td>
        <td>Binary</td>
        <td>一种二进制文件</td>
    </tr>
    <tr>
        <td colspan="3">
        <b>G</b>
        </td>
    </tr>
    <tr>
        <td>GZIP</td>
        <td>GNU ZIP</td>
        <td>一种文件压缩格式</td>
    <tr>
        <td colspan="3">
        <b>J</b>
        </td>
    </tr>
    <tr>
        <td>JAR</td>
        <td>Java Archive</td>
        <td>一种Java软件包格式文件</td>
    </tr>
    <tr>
        <td colspan="3">
        <b>P</b>
        </td>
    </tr>
    <tr>
        <td>PY</td>
        <td>-</td>
        <td>一种Python的可执行文件</td>
    </tr>
    <tr>
        <td>PYC</td>
        <td>-</td>
        <td>一种二进制文件</td>
    </tr>
    <tr>
        <td colspan="3">
        <b>R</b>
        </td>
    </tr>
    <tr>
        <td>RPM</td>
        <td>RHEL Package Manager</td>
        <td>一种Linux软件包格式</td>
    </tr>
    <tr>
        <td colspan="3">
        <b>T</b>
        </td>
    </tr>
    <tr>
        <td>TAR</td>
        <td>-</td>
        <td>一种Linux软件包格式</td>
    </tr>
    <tr>
        <td colspan="3">
        <b>Z</b>
        </td>
    </tr>
    <tr>
        <td>ZIP</td>
        <td>-</td>
        <td>一种文件压缩格式</td>
    </tr>

</table>