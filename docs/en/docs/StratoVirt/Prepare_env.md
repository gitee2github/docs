# Preparing the Environment

[[toc]]

## Usage

- StratoVirt supports only Linux VMs that use the x86_64 or AArch64 processor architecture and start the VM with same architecture.
- StratoVirt can be compiled, commissioned, and deployed only on openEuler 20.09 and later versions.
- StratoVirt can run with non-root permissions.

## Environment Requirements

The following environment is required for running StratoVirt:

- /dev/vhost-vsock device (for implementing the MMIO)
- Nmap tool
- Kernel image and rootfs image



## Preparing Devices and Tools

- StratoVirt needs to implement the MMIO device. Therefore, before running StratoVirt, ensure that the `/dev/vhost-vsock` device exists.

  Check whether the device exists.

  ```
  $ ls /dev/vhost-vsock
  /dev/vhost-vsock
  ```

  If the device does not exist, run the following command to generate the /dev/vhost-vsock device:

  ```
  $ modprobe vhost_vsock
  ```


- To use QMP commands, install the nmap tool. After configuring the yum source, run the following command to install the nmap tool:

  ```
  $ yum install nmap
  ```

## Preparing Images

### Creating the Kernel Image

The StratoVirt of the current version supports only the PE kernel image of the x86_64 and AArch64 platforms. The kernel image in PE format can be generated by using the following method:

1. Run the following command to obtain the kernel source code of the openEuler:

   ```
   $ git clone https://gitee.com/openeuler/kernel
   $ cd kernel
   ```

2. Run the following command to check and switch the kernel version to 4.19:

   ```
   $ git checkout kernel-4.19
   ```

3. Configure and compile the Linux kernel. It is better to use the recommended configuration file ([Obtain configuration file](https://gitee.com/openeuler/stratovirt/tree/master/docs/kernel_config)). Copy it to the kernel directory, and rename it as `.config`. You can also run the following command to configure the kernel as prompted:

   ```
   $ make menuconfig
   ```

4. Run the following command to create and convert the kernel image to the PE format. The converted image is vmlinux.bin.

   ```
   $ make -j vmlinux && objcopy -O binary vmlinux vmlinux.bin
   ```
   
   After the compilation is complete, the kernel image vmlinux.bin is generated in the current directory.
   
   ​

## Creating the Rootfs Image

The rootfs image is a file system image. When the StratoVirt is started, the ext4 image with init can be loaded. To create an ext4 rootfs image, perform the following steps:

1. Prepare a file with a proper size (for example, create a file with the size of 10 GiB in /home).

   ```
   $ cd /home
   $ dd if=/dev/zero of=./rootfs.ext4 bs=1G count=10
   ```

2. Create an empty ext4 file system on this file.

   ```
   $ mkfs.ext4 ./rootfs.ext4
   ```

3. Mount the file image. Create the /mnt/rootfs directory and mount rootfs.ext4 to the /mnt/rootfs directory as user root.

   ```
   $ mkdir /mnt/rootfs
   $ cd /home
   $ sudo mount ./rootfs.ext4 /mnt/rootfs && cd /mnt/rootfs
   ```
   
4. Obtain the latest alpine-mini rootfs of the corresponding processor architecture.

   - If the AArch64 processor architecture is used, run the following command:

     ```
     $ wget http://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/aarch64/alpine-minirootfs-3.12.0-aarch64.tar.gz
     $ tar -zxvf alpine-minirootfs-3.12.0-aarch64.tar.gz
     $ rm alpine-minirootfs-3.12.0-aarch64.tar.gz
     ```


   - For the x86_64 processor architecture, run the following command:

     ```
     $ wget http://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/x86_64/alpine-minirootfs-3.12.0-x86_64.tar.gz
     $ tar -zxvf alpine-minirootfs-3.12.0-x86_64.tar.gz
     $ rm alpine-minirootfs-3.12.0-x86_64.tar.gz
     ```


5. Run the following command to create a simple /sbin/init for the ext4 file image:

   ```
   $ rm sbin/init; touch sbin/init && cat > sbin/init <<EOF
   #! /bin/sh
   mount -t devtmpfs dev /dev
   mount -t proc proc /proc
   mount -t sysfs sysfs /sys
   ip link set up dev lo
   
   exec /sbin/getty -n -l /bin/sh 115200 /dev/ttyS0
   poweroff -f
   EOF
   
   sudo chmod +x sbin/init
   ```

6. Uninstall the rootfs image.

   ```
   $ cd /home; umount /mnt/rootfs
   ```

   Then, the rootfs is created successfully. You can use the ext4 rootfs image file rootfs.ext4, which is stored in the /home directory.