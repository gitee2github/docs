# Uninstallation
## Precautions
- Before uninstalling iSulad, you need to stop the container to prevent the processes in the container from running and occupying host resources after the uninstallation.

- Before uninstalling iSulad, you need to store the data that needs to be persisted in the container to the volume to prevent data loss after the uninstallation.

## Procedure

To uninstall iSulad, perform the following operations:

1.  Uninstall iSulad and its dependent software packages.
    -   If the  **yum**  command is used to install iSulad, run the following command to uninstall iSulad:

        ```
        $ sudo yum remove iSulad
        ```

    -   If the  **rpm**  command is used to install iSulad, uninstall iSulad and its dependent software packages. Run the following command to uninstall an RPM package.

        ```
        sudo rpm -e iSulad-xx.xx.xx-YYYYmmdd.HHMMSS.gitxxxxxxxx.aarch64.rpm
        ```

2.  Images, containers, volumes, and related configuration files are not automatically deleted. The reference command is as follows:

    ```
    $ sudo rm -rf /var/lib/iSulad
    ```


