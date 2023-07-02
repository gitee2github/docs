# 环境要求
##### 操作系统要求
-   x2openEuler  web工具部署要求
    **表 1** 操作系统要求
    <a id="sheet1"></a>
    <table><thead align="left">
        <tr>
            <th>部署环境</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>CentOS 7.6/openEuler 20.03-LTS-SPx</td>
            <td>
                <ul>
                    <li>保持与待升级节点连接的内部网络联通</li>
                    <li>操作系统软件包应当更新至最新版本</li>
                    <li>操作系统防火墙应设置安全策略</li>
                    <li>部署环境最好为非生产环境</li>
                    <li>操作系统密码应当符合密码安全规范且定期更新</li>
                </ul>
            </td>
        </tr>
    </table>
-   x2openEuler  CLI 工具部署要求（CLI工具会通过web工具自动完成部署）
    >![](public_sys-resources/icon-note.gif) **说明：** 
    >待升级环境必须能够保证兼容安装openEuler 20.03-LTS-SP1操作系统。

-   待升级节点操作系统要求
    **表 2** 操作系统要求
    <a id="sheet2"></a>
    <table><thead align="left">
        <tr>
            <th>待升级操作系统</th>
            <th>升级目标操作系统</th>
        </tr>
        <tr>
            <td rowspan="2">CentOS 7.x</td>
            <td>openEuler 20.03-LTS-SPx</td>
        </tr>
        <tr>
            <td>openEuler 22.03-LTS</td>
        </tr>
        <tr>
            <td>CentOS 8.x</td>
            <td>openEuler 22.03-LTS</td>
        </tr>
    </table> 

    >![](public_sys-resources/icon-note.gif) **说明：** 
    >x2openEuler工具默认支持源操作系统版本 CentOS 7.6，目标操作系统版本 openEuler 20.03-LTS-SP1，可通过[安装操作系统支持包](CommonOperation.md#updatedatabasepackage)支持更多操作系统。
##### 硬件要求
部署x2openEuler web工具硬件要求如[表3](#sheet3)所示。

**表 3**  硬件要求
<a id="sheet3"></a>
<table><thead align="left">
    <tr>
        <th>硬件类型</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>服务器</td>
        <td>
            <ul>
                <li>x86服务器</li>
                <li>基于鲲鹏916/920的服务器</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>CPU</td>
        <td>四核2.5GHz及以上（8核心及以上）</td>
    </tr>
    <tr>
        <td>内存</td>
        <td>系统空闲内存要求16GB及以上</td>
    </tr>
    <tr>
        <td>安装空间</td>
        <td>20GB及以上剩余空间</td>
    </tr>
</table>

>![](public_sys-resources/icon-note.gif) **说明：** 
>待升级节点无特别要求，但需要保持内存在2GB及以上，否则会导致升级因内存不足而失败。

# 获取软件包
安装过程中所需软件包如[表4](#sheet4)所示。

**表 4**  获取工具软件包
<a id="sheet4"></a>
<table><thead align="left">
    <tr>
        <th>软件包名称</th>
        <th>软件包说明</th>
        <th>获取方法</th>
    </tr>
    <tr>
        <td>
            <ul>
                <li>x86服务器：x2openEuler-core-x.x.x-xx.x86_64.rpm</li>
                <li>基于鲲鹏916/920的服务器：x2openEuler-core-x.x.x-xx.aarch64.rpm</li>
            </ul>
        </td>
        <td>x2openEuler工具安装包</td>
        <td><a href="https://repo.oepkgs.net/openEuler/rpm/openEuler-20.03-LTS-SP1/contrib/x2openEuler/">oepkgs社区获取软件包</a></td>
    </tr>
</table>

>![](public_sys-resources/icon-note.gif) **说明：** 
>-   软件包名称中的“x.x.x”表示版本号。
>-   软件包中包含有针对待升级节点的分析工具接口。

# 软件数字签名验证<a id="pgpverfy"></a>
为了防止软件包在传递过程或存储期间被恶意篡改，下载软件包时需下载对应的数字签名文件用于完整性验证。

在软件包下载之后，请参考《OpenPGP签名验证指南》，对从社区站点获取的软件包进行PGP数字签名校验。如果校验失败，请不要使用该软件包，重新从社区网站获取即可。

使用软件包安装/升级之前，也需要按上述过程先验证软件包的数字签名，确保软件包未被篡改。

运营商客户请访问：[PGP Verify](https://support.huawei.com/carrier/navi?coltype=software#col=software&detailId=PBI1-253374093&path=PBI1-253383977/PBI1-23710112/PBI1-21431666/PBI1-253386765/PBI1-22562161)

企业客户请访问：[PGP Verify](https://support.huawei.com/enterprise/zh/tool/pgp-verify-TL1000000054)

# 安装<a id="install"></a>

##### 前提条件

-   已获取x2openEuler工具安装包。
-   已安装远程SSH登录工具，如Xshell、MobaXterm、PuTTY等。
-   已安装sftp工具。
-   待升级环境可以通过网络访问本地配置的CentOS yum源。
-   工具安装环境需开启工具端口。

##### 操作步骤

1.  此处以在x86环境上安装x2openEuler工具为例，使用sftp工具将安装包x2openEuler-core-_x.x.x-xx_.x86\_64.rpm上传至远程服务器的/root目录下。
2.  使SSH远程登录工具登录至需要远程服务器命令行界面。
3.  （可选）如果服务器OS防火墙已开启，执行如下操作开通服务器OS防火墙端口（如果服务器OS防火墙没有开启，请跳过此步骤）。

    >![](public_sys-resources/icon-note.gif) **说明：** 
    >-   以下命令中的18082端口是在启动web服务时默认的HTTPS端口号，请根据实际情况修改。
    >-   若用户还配置了硬件防火墙，则需要用户联系相关的网络管理员同步完成对硬件防火墙的配置，开通需要访问的端口。

    1.  执行以下命令查看防火墙是否开启：

        ```
        systemctl status firewalld
        ```

        显示“inactive”表示防火墙没有开启，请跳过以下步骤。

    2.  执行以下命令查看端口是否开通：

        ```
        firewall-cmd --query-port=18082/tcp
        ```

        提示“no”表示端口未开通。

    3.  执行以下命令永久开通端口：

        ```
        firewall-cmd --add-port=18082/tcp --permanent
        ```

        提示“success”表示开通成功。

    4.  执行以下命令重新载入配置。

        ```
        firewall-cmd --reload
        ```

    5.  再次执行以下命令查看端口是否开通：

        ```
        firewall-cmd --query-port=18082/tcp
        ```

        提示“yes”表示端口已开通。

        >![](public_sys-resources/icon-note.gif) **说明：** 
        >如果想要移除端口，请执行以下命令：
        >```
        >firewall-cmd --permanent --remove-port=18082/tcp
        >```
        >提示“success”表示端口移除成功。
        >移除成功后再执行以下命令重新载入配置。
        >```
        >firewall-cmd --reload
        >```


4.  执行以下命令安装x2openEuler工具。

    ```
    yum install -y /root/x2openEuler-core-x.x.x-xx.x86_64.rpm
    ```

5.  工具包安装成功后，执行以下命令启动web服务。

    >![](public_sys-resources/icon-note.gif) **说明：** 
    >-   如web服务受SELinux策略无法正常运行，请更改SELinux策略或[关闭SELinux](CommonOperation.md#seoff)。
    >-   如web服务需停止或重启请参考[启动/停止/重启服务](CommonOperation.md#servicemanager)。
    >-   首次启动服务时，需要配置MariaDB用户密码。密码需要满足如下复杂度要求：
    >    -   密码长度为8\~32个字符
    >    -   必须包含大写字母、小写字母、数字、特殊字符（\`\~!@\#$%^&\*\(\)-\_=+\\|\[\{\}];:'",<.\>/?）中的两种及以上类型的组合
    >    -   密码不能包含空格
    >    -   密码不能是用户名
    >    -   密码不能在[弱口令字典](CommonOperation.md#weakpasswd)中
    >-   建议对数据库x2openEuler用户密码定期进行修改，确保业务安全运行。
    >-   如本地已存在MariaDB数据库，建议更新MariaDB到最新版本，并禁止远程访问数据库。

    ```
    cd /usr/local/x2openEuler/portal/service
    bash service_init.sh
    ```

    根据回显交互信息提示完成服务启动配置。

    1.  配置数据库。

        ```
        Start MariaDB customize configure
        MariaDB is active.
        
        NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
              SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!
        
        In order to log into MariaDB to secure it, we'll need the current
        password for the root user.  If you've just installed MariaDB, and
        you haven't set the root password yet, the password will be blank,
        so you should just press enter here.
        
        Enter current password for root (enter for none):
        OK, successfully used password, moving on...
        
        Setting the root password ensures that nobody can log into the MariaDB
        root user without the proper authorisation.
        
        You already have a root password set, so you can safely answer 'n'.
        
        Change the root password? [Y/n] n
         ... skipping.
        
        By default, a MariaDB installation has an anonymous user, allowing anyone
        to log into MariaDB without having to have a user account created for
        them.  This is intended only for testing, and to make the installation
        go a bit smoother.  You should remove them before moving into a
        production environment.
        
        Remove anonymous users? [Y/n] y
         ... Success!
        
        Normally, root should only be allowed to connect from 'localhost'.  This
        ensures that someone cannot guess at the root password from the network.
        
        Disallow root login remotely? [Y/n] y
         ... Success!
        
        By default, MariaDB comes with a database named 'test' that anyone can
        access.  This is also intended only for testing, and should be removed
        before moving into a production environment.
        
        Remove test database and access to it? [Y/n] y
         - Dropping test database...
         ... Success!
         - Removing privileges on test database...
         ... Success!
        
        Reloading the privilege tables will ensure that all changes made so far
        will take effect immediately.
        
        Reload privilege tables now? [Y/n] y
         ... Success!
        
        Cleaning up...
        
        All done!  If you've completed all of the above steps, your MariaDB
        installation should now be secure.
        
        Thanks for using MariaDB!
        ```

    2.  配置x2openEuler服务。

        -   配置数据库用户x2openEuler密码。
        -   配置是否启用SSH身份验证。
        -   配置Web Server的IP地址。
        -   配置HTTPS端口，默认端口为18082。
        -   配置GUNICORN端口，默认端口为18080。

        ```
        Enter the password of the root user of the MariaDB again:
        Set the password of the x2openEuler user for MariaDB:
        If the selected database already exists, it will be overwritten.
        Use default x2openEulerDb database? [Y/n]y
        MariaDB is configured successfully.
        
        If authentication is enabled, the SSH connection fails after the fingerprint of the machine changes.
        Please confirm whether public key authentication is not required for SSH connection(y/n default: n):
        Use default x2openEuler database? [Y/n]y
        MariaDB is configured successfully.
        If authentication is enabled, the SSH connection fails after the fingerprint of the machine changes.
        Please confirm whether public key authentication is not required for SSH connection(y/n default: n):y
        Start Nginx service and Gunicorn service
        Ip address list:
        sequence_number         ip_address              device
        [1]                     x.x.x.x                 enp1s0
        Enter the sequence number of listed ip as web server ip(default: 1): 1
        Set the web server IP address x.x.x.x
        Please enter HTTPS port(default: 18082):
        The HTTPS port 18082 is valid.  Set the HTTPS port to 18082 (y/n default: y):
        Set the HTTPS port 18082
        Please enter gunicorn port(default: 18080):
        The GUNICORN port 18080 is valid.  Set the GUNICORN port to 18080 (y/n default: y):
        Set the GUNICORN port 18080
        The Nginx and Gunicorn ports are set up successfully.
        Installing the django dependent environment.
        The django dependency environment is installed successfully.
        Generating the Django secret key.
        Generate the Django secret key successfully.
        Migrations for 'certificatemanager':
          /usr/local/x2openEuler/portal/src/certificatemanager/migrations/0001_initial.py
            - Create model CertificateInfo
            - Create model CertPathConfig
            - Create model ScheduleTask
        Migrations for 'config':
          /usr/local/x2openEuler/portal/src/config/migrations/0001_initial.py
            - Create model RollbackFilterConfig
            - Create model UserConfig
        ...
        Running migrations:
          Applying contenttypes.0001_initial... OK
          Applying contenttypes.0002_remove_content_type_name... OK
          Applying auth.0001_initial... OK
          Applying auth.0002_alter_permission_name_max_length... OK
          Applying auth.0003_alter_user_email_max_length... OK
        ...
        Installed 1 object(s) from 1 fixture(s)
        Installed 1 object(s) from 1 fixture(s)
        Installed 13 object(s) from 1 fixture(s)
        Installed 52 object(s) from 1 fixture(s)
        Installed 2 object(s) from 1 fixture(s)
        Encrypting phase successfully.
        It may take a few minutes to generate the certificate, please wait...
        Certificate generated successfully. You can import the root certificate to the browser to mask security alarms when you access the tool. The root certificate is stored in /usr/local/x2openEuler/portal/thirdapp/nginx-install/webui/ca.crt.
        Web console is now running, go to: https://x.x.x.x:18082/x2openEuler/#/login
        ```

# 验证
##### web模式下验证安装结果

登录Web界面，详细步骤请参见[登录x2openEuler工具Web界面](Introduce.md#loginweb)，能够成功登录说明x2openEuler工具安装成功。

##### CLI模式下验证安装结果

1.  使用SSH远程登录工具，进入待升级节点命令行界面。
2.  执行如下命令查看版本信息。

    ```
    rpm -qa x2openEuler-core
    ```

    显示如下格式内容说明安装成功（其中“x.x.x-x”表示版本号，请以实际情况为准）。

    ```
    x2openEuler-core-x.x.x-x.x86_64
    ```
# 升级及回退
## 升级
##### 版本支持
当前支持3.0.RC1升级到3.0.RC1后续版本。
##### 前提条件
-   已将所需升级的鲲鹏代码迁移工具的软件包下载到本地，并确认软件包与服务器硬件平台一致。

    获取软件包后，需要校验软件包，确保与网站上的原始软件包一致，详细步骤请参见[软件数字签名验证](#pgpverfy)。

-   升级前请确认x2openEuler工具可以正常使用。
-   工具默认安装在“/usr/local/x2openEuler”目录，升级前请确认安装空间充足。
-   3.0.RC1之前的历史版本请参考[通过升级脚本进行升级](#upgradeinshell)章节升级至3.0.RC1。
##### 操作步骤
1.  使用SSH远程登录工具，进入Linux操作系统命令行界面。
2.  将x2openEuler工具软件包传输至服务器自定义目录下，执行以下命令进行升级。

    ```
    cd 自定义目录
    rpm -Uvh x2openEuler-core-x.x.x-xx.x86_64.rpm
    ```

3.  升级完成后执行以下命令启动工具服务，重新登录x2openEuler工具即可。

    ```
    systemctl start nginx_x2openEuler.service
    systemctl start gunicorn_x2openEuler.service
    ```
## 通过升级脚本进行升级<a id="upgradeinshell"></a>
支持3.0.RC1之前的历史版本升级至3.0.RC1。
##### 前提条件
-   已获取x2openEuler 3.0.RC1版本安装包到本地，并确认安装包与服务器硬件平台一致。获取软件包后，需要对软件包进行校验，确保与网站上的原始软件包一致，详细步骤请参见[软件数字签名验证](#pgpverfy)。
-   升级前请确认x2openEuler工具可以正常使用。
##### 操作步骤
>![](public_sys-resources/icon-notice.gif) **须知：** 
    >-  不支持在评估或升级任务执行过程中升级，请确保升级时没有任务在运行。
    >-  升级过程中请勿执行Ctrl+Z、Ctrl+C和重启操作系统。
1.  使用SSH远程登录工具，进入Linux操作系统命令行界面，并上传x2openEuler 3.0.RC1 安装包。
2.  执行以下命令解压安装包，从解压后的文件夹中获取“db_migrate.sh”文件。
    ```
    rpm2cpio x2openEuler-core-3.0.0-xxx.rpm | cpio -id ./usr/local/x2openEuler/portal/src/db_migrate.sh 
    ```
3.  进入安装包存放目录，以root用户执行以下命令进行历史版本工具的数据库迁移。
    ```
    bash ./usr/local/x2openEuler/portal/src/db_migrate.sh
    ```
    返回信息如下：
    ```
    The data is backed up successfully. You can uninstall the old version.
    ```
    迁移完成后卸载旧版本x2openEuler。
    >![](public_sys-resources/icon-note.gif) **说明：** 
    >完成备份后请确保“/opt/back_up”目录下包含db.sqlite3、output.tar.gz、x2openEuler-upgrade.tar.gz等文件及x2openEuler文件夹。
4.  参考[安装章节](#install)，安装x2openEuler 3.0.RC1 版本工具。安装完成后，执行以下命令启动“db_migrate.sh”。
    ```
    bash /usr/local/x2openEuler/portal/src/db_migrate.sh
    ```
5.  数据库文件迁移完成后，重新登录x2openEuler工具web界面，查看历史版本工具的相关服务、数据及状态是否正常。
## 升级后回退
将3.0.RC1版本工具回退至工具升级前版本。
##### 前提条件
-   当前工具由3.0.RC1之前版本升级至3.0.RC1版本。
-   “/opt/back_up”备份文件存在。
-   已获取3.0.RC1之前版本的安装包。

##### 操作步骤
>![](public_sys-resources/icon-note.gif) **说明：** 
    >若回退前版本工具中存在环境检查通过的任务，则需在回退完成后卸载掉对应待升级节点的x2openEuler-upgrade包(例：x2openEuler-upgrade-x.x.x.x86_64)。

1.  使用SSH远程登录工具，进入Linux操作系统命令行界面。
2.  执行以下命令复制“db_migrate.sh”文件至自定义目录。（此处以"/home"目录为例）
    ```
    cp /usr/local/x2openEuler/portal/src/db_migrate.sh /home/
    ```
3.  参考[卸载章节](#uninstall)，卸载3.0.RC1版本x2openEuler工具。
4.  参考[安装章节](#install)，安装需要回退版本的x2openEuler安装包。   
5.  进入“db_migrate.sh”文件所在路径，执行以下命令进行回退操作。
    ```
    bash db_migrate.sh rollback
    ```
    回显信息如下时代表已完成回退操作。   
    ```
    System rollback succeeded.
    ```                         


# 卸载<a id="uninstall"></a>
##### 前提条件
没有正在运行中的任务。
##### 操作步骤
1.  使用SSH工具远程登录进入操作系统命令行界面_。_
2.  执行如下命令卸载x2openEuler工具。

    ```
    yum -y remove x2openEuler-core-x.x.x-x.x86_64
    ```

    >![](public_sys-resources/icon-note.gif) **说明：** 
    >-   当用户执行卸载命令时，如果有正在运行的任务，用户需要先终止或等待运行的任务结束。若用户仍选择卸载，当前运行的任务会直接中断。
    >-   当用户执行卸载命令时，需要确保当前用户所在客户端为唯一操作远端服务器x2openEuler工具的客户端，否则可能会因删除用户失败而导致工具卸载失败。
    >-   卸载完成后，x2openEuler用户、“/home/x2openEuler“和“/var/spool/mail/x2openEuler“相关文件目录会被自动移除，以保证系统环境安全。

3.  清理x2openEuler工具的数据库。
    1.  执行以下命令输入密码后登录MariaDB。

        ```
        mysql -u root -p
        ```

    2.  执行以下SQL语句删除x2openEuler工具的数据库。此处以删除名为x2openEulerDb的数据库为例。

        ```
        DROP DATABASE IF EXISTS x2openEulerDb;
        ```

    3.  执行以下SQL语句清除x2openEuler工具的数据库用户。

        ```
        DELETE FROM mysql.user WHERE User='x2openEuler';
        DELETE FROM mysql.db WHERE User='x2openEuler';
        ```

    4.  执行以下SQL语句查询并确认x2openEuler工具的数据库及用户是否已删除。

        ```
        show databases;
        SELECT Host,User,Password FROM mysql.user;
        ```

4.  （可选）卸载MariaDB。

    >![](public_sys-resources/icon-notice.gif) **须知：** 
    >卸载MariaDB之前，请确保业务环境无MariaDB使用需求且不影响运行环境及业务。

    1.  执行以下命令卸载MariaDB。

        ```
        rpm -qa | grep mariadb | xargs yum remove -y
        ```

    2.  执行以下命令清除配置目录。

        ```
        rm -rf /etc/my.cnf
        rm -rf /var/lib/mysql/
        ```

