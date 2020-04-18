# Full-automatic Installation Guide<a name="EN-US_TOPIC_0229291289"></a>

## Environment Requirements<a name="section624913414504"></a>

The environment requirements for full-automatic installation of openEuler using kickstart are as follows:

-   PM/VM \(for details about how to create VMs, see the documents from corresponding vendors\): includes the computer where kickstart is used for automatic installation and the computer where the kickstart tool is installed.
-   Httpd: stores the kickstart file.
-   TFTP: provides vmlinuz and initrd files.
-   DHCPD/PXE: provides the DHCP service.
-   ISO: openEuler-20.03-LTS-aarch64-dvd.iso

## Procedure<a name="section9467123415317"></a>

To use kickstart to perform full-automatic installation of openEuler, perform the following steps:

**Environment Preparation**

>![](public_sys-resources/icon-note.gif) **NOTE:**   
>Before the installation, ensure that the firewall of the HTTP server is disabled. Run the following command to disable the firewall:  
>```  
>iptables -F  
>```  

1.  Install httpd and start the service.

    ```
    # dnf install httpd -y
    # systemctl start httpd
    # systemctl enable httpd
    ```

2.  Install and configure TFTP.

    ```
    # dnf install tftp-server -y
    # vim /etc/xinetd.d/tftp
    service tftp
    {
    socket_type = dgram
    protocol = udp
    wait = yes
    user = root
    server = /usr/sbin/in.tftpd
    server_args = -s /var/lib/tftpboot
    disable = no
    per_source = 11
    cps = 100 2
    flags = IPv4
    }
    # systemctl start tftp
    # systemctl enable tftp
    # systemctl start xinetd
    # systemctl status xinetd
    # systemctl enable xinetd
    ```

3.  Run the following commands to prepare the installation source:

    ```
    # mount openEuler-20.03-LTS-aarch64-dvd.iso /mnt
    # cp -r /mnt/* /var/www/html/openEuler/
    ```

4.  Set and modify the kickstart configuration file  **openEuler-ks.cfg**. Select the HTTP installation source by referring to  [\#EN-US\_TOPIC\_0229291289/l1692f6b9284e493683ffa2ef804bc7ca](#l1692f6b9284e493683ffa2ef804bc7ca).

    ```
    #vim  /var/www/html/ks/openEuler-ks.cfg
    ====================================
    ***Modify the following information as required.***
    #version=DEVEL
    ignoredisk --only-use=sda
    autopart --type=lvm
    # Partition clearing information
    clearpart --none --initlabel
    # Use graphical install
    graphical
    # Keyboard layouts
    keyboard --vckeymap=cn --xlayouts='cn'
    # System language
    lang zh_CN.UTF-8
    #Use http installation source
    url  --url=//192.168.122.1/openEuler/
    %post
    #enable kdump
    sed  -i "s/ ro / ro crashkernel=1024M,high /" /boot/efi/EFI/openEuler/grub.cfg
    %end
    ...
    ```

5.  Modify the PXE configuration file  **grub.cfg**  as follows:

    ```
    # cp -r /mnt/images/pxeboot/* /var/lib/tftpboot/
    # cp /mnt/EFI/BOOT/grubaa64.efi /var/lib/tftpboot/
    # cp /mnt/EFI/BOOT/grub.cfg /var/lib/tftpboot/
    # ls /var/lib/tftpboot/
    grubaa64.efi  grub.cfg  initrd.img  TRANS.TBL  vmlinuz
    # vim /var/lib/tftpboot/grub.cfg
    set default="1"
    
    function load_video {
      if [ x$feature_all_video_module = xy ]; then
        insmod all_video
      else
        insmod efi_gop
        insmod efi_uga
        insmod ieee1275_fb
        insmod vbe
        insmod vga
        insmod video_bochs
        insmod video_cirrus
      fi
    }
    
    load_video
    set gfxpayload=keep
    insmod gzio
    insmod part_gpt
    insmod ext2
    
    set timeout=60
    
    
    ### BEGIN /etc/grub.d/10_linux ###
    menuentry 'Install openEuler 20.03 LTS' --class red --class gnu-linux --class gnu --class os {
            set root=(tftp,192.168.1.1)
            linux /vmlinuz ro inst.geoloc=0 console=ttyAMA0 console=tty0 rd.iscsi.waitnet=0 inst.ks=http://192.168.122.1/ks/openEuler-ks.cfg
            initrd /initrd.img
    }
    ```

6.  Run the following commands to configure DHCP \(which can be replaced by DNSmasq\):

    ```
    # dnf install dhcp -y
    #
    # DHCP Server Configuration file.
    #   see /usr/share/doc/dhcp-server/dhcpd.conf.example
    #   see dhcpd.conf(5) man page
    #
    # vim /etc/dhcp/dhcpd.conf
    ddns-update-style interim;
    ignore client-updates;
    filename "grubaa64.efi";  # pxelinux location of the startup file;
    next-server 192.168.122.1;     # (IMPORTANT) TFTP server IP address;
    subnet 192.168.122.0 netmask 255.255.255.0 {
    option routers 192.168.111.1; # Gateway address
    option subnet-mask 255.255.255.0; # Subnet mask
    range dynamic-bootp 192.168.122.50 192.168.122.200; # Dynamic IP address range
    default-lease-time 21600;
    max-lease-time 43200;
    }
    # systemctl start dhcpd
    # systemctl enable dhcpd
    ```


**Installing the System**

1.  On the  **Start boot option**  screen, press  **F2**  to boot from the PXE and start automatic installation.

    ![](figures/en-us_image_0229291270.png)

    ![](figures/en-us_image_0229291286.png)

    ![](figures/en-us_image_0229291247.png)

2.  The automatic installation window is displayed.
3.  Verify that the installation is complete.

    ![](figures/completing-the-automatic-installation.png)

