# Динамическое управление ресурсами контейнера (syscontainer-tools)

- [Динамическое управление ресурсами контейнера (syscontainer-tools)](#dynamically-managing-container-resources-(syscontainer-tools))
  - [Управление устройствами](#device-management)
  - [Управление NIC](#nic-management)
  - [Управление маршрутами](#route-management)
  - [Управление монтированием томов](#volume-mounting-management)

В общих контейнерах недоступны функции управления ресурсами. К примеру, блочное устройство нельзя добавить в общий контейнер, также в такой контейнер нельзя вставить физическую или виртуальную карту NIC. В системном контейнере применяются инструменты syscontainer-tools, которые служат для динамического монтирования или размонтирования блочных устройств, сетевых устройств, маршрутов и томов для контейнеров.

Чтобы использовать эту функцию, сначала необходимо установить syscontainer-tools.

```
[root@localhost ~]# yum install syscontainer-tools
```

## Управление устройствами

### Описание функционала

С помощью isulad-tools можно добавлять в контейнер имеющиеся на хосте блочные устройства (например, диски и диспетчеры логических томов) или устройства символьного ввода-вывода (например, графические процессоры GPU, группировщики и FUSE). После чего эти устройства можно использовать в контейнере. Например, командой **fdisk** форматируется диск и записываются данные в файловую систему. Если устройства больше не требуется, isulad-tools позволяет удалить их из контейнера и вернуть на хост.

### Формат команды

```
isulad-tools [COMMADN][OPTIONS] <container_id> [ARG...]
```

В данном формате:

**COMMAND**: команда, связанная с управлением устройствами.

**OPTIONS**: параметр, поддерживаемый командой управления устройствами.

**container\_id:** идентификатор контейнера.

**ARG**: параметр, соответствующий команде.

### Описание параметров

| **Команда**   | **Описание функционала**                                     | **Описание параметров**                                      | Формат параметров                                            |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| add-device    | Добавление имеющихся на хосте блочных устройств или устройств символьного ввода-вывода в контейнер. | Поддерживаемые параметры: <br /> ·      **--blkio-weight-device**: устанавливает вес операций ввода-вывода (относительный вес в диапазоне от 10 до 100) блочного устройства.  <br />·      **--device-read-bps**: ограничение скорости чтения для блочного устройства (байт/с). <br /> ·      **--device-read-iops**: ограничение скорости чтения для блочного устройства (операций ввода-вывода/с).<br />  ·      **--device-write-bps**: ограничение скорости записи для блочного устройства (байт/с).<br />  ·      **--device-write-iops**: ограничение скорости записи для блочного устройства (операций ввода-вывода/с).<br />  ·      **--follow-partition**: если блочное устройство является базовым блочным устройством (первичный блочный диск SCSI), установите этот параметр, чтобы добавить все разделы первичного диска. <br /> ·      **--force**: если в контейнере уже существует какое-либо блочное устройство или устройство символьного ввода-вывода, используйте этот параметр для перезаписи старых файлов таких устройств. ·      **--update-config-only**: обновление только конфигурационных файлов и без добавления дисков. | Формат параметров: *hostdevice***[:***containerdevice***][:***permission***] [***hostdevice***[:***containerdevice***][:***permission***]]**  <br />В данном формате: *hostdevice*: путь на хосте для хранения устройства. *containerdevice*: путь в контейнере для хранения устройства.  <br />*permission*: разрешение на выполнение операции с устройством в контейнере. |
| remove-device | Удаление блочных устройств или устройств символьного ввода-вывода с контейнера и восстановление их на хосте. | Поддерживаемые параметры:  <br />**--follow-partition**: если блочное устройство является базовым блочным устройством (первичный блочный диск SCSI), установите этот параметр, чтобы удалить все разделы первичного диска из контейнера и восстановить их на хосте. | Формат параметра: *hostdevice***[:***containerdevice***] [***hostdevice***[:***containerdevice***]]**  В данном формате: *hostdevice*: путь на хосте для хранения устройства. *containerdevice*: путь в контейнере для хранения устройства. |
| list-device   | Вывод списка всех имеющихся в контейнере блочных устройств или устройств символьного ввода-вывода. | Поддерживаемые параметры:<br />  ·      **--pretty**: вывод данных в формате JSON. <br /> ·      **--sub-partition**: этот флаг добавляется, чтобы отобразить первичный диск и его подразделы. | --                                                           |
| update-device | Обновление QoS диска.                                        | Поддерживаемые параметры:<br />  ·      **--device-read-bps**: ограничение скорости чтения для блочного устройства (байт/с). Рекомендуется установить этому параметру значение не меньше 1024. <br /> ·      **--device-read-iops**: ограничение скорости чтения для блочного устройства (операций ввода-вывода/с). <br /> ·      **--device-write-bps**: ограничение скорости записи для блочного устройства (байт/с). Рекомендуется установить этому параметру значение не меньше 1024. <br /> ·      **--device-write-iops**: ограничение скорости записи для блочного устройства (операций ввода-вывода/с). | --                                                           |

### Ограничения

- Устройства можно добавлять или удалять при условии, если экземпляры контейнера не запущены в работу. После завершения операции контейнер необходимо запустить, чтобы проверить статус устройства. Доступна также функция динамического добавления устройства в процессе работы контейнера.
- Не выполняйте с этой операцией одновременно команду **fdisk** для форматирования дисков в контейнере и на хосте. В противном случае это повлияет на загрузку контейнерного диска.
- Если при выполнении команды **add-device** для добавления диска в определенный каталог контейнера родительский каталог в контейнере является многоуровневым каталогом (например, **/dev/a/b/c/d/e**), и уровень каталога не задан, **isulad-tools** автоматически создает соответствующий каталог в контейнере. При удалении диска созданный родительский каталог не удаляется. При повторном выполнении команды **add-device** для добавления устройства в данный родительский каталог на экране появится сообщение о том, что устройство уже существует и его нельзя добавить.
- При добавлении диска или обновлении параметров диска командой **add-device** необходимо сконфигурировать QoS диска. Не устанавливайте параметру ограничения скорости записи или чтения для блочного устройства (в количестве операций ввода-вывода/с или в байтах/с) маленькое значение. Если значение слишком маленькое, диск может быть нечитаемым (фактическая причина заключается в очень медленной скорости), что скажется на функционировании служб.
- Если для ограничения веса определенного блочного устройства выполняется команда **--blkio-weight-device**, и данное блочное устройство поддерживает только режим BFQ, возможно появление ошибки с рекомендацией проверить текущую среду ОС и убедиться, что настройка веса блочного устройства BFQ поддерживается.

### Пример

- Запуск системного контейнера и настройка **hook spec** в скрипте выполнения функции перехвата isulad hook.
  
  ```
  [root@localhost ~]# isula run -tid --hook-spec /etc/isulad-tools/hookspec.json --system-container --external-rootfs /root/root-fs none init
  eed1096c8c7a0eca6d92b1b3bc3dd59a2a2adf4ce44f18f5372408ced88f8350
  ```

- Добавление блочного устройства к контейнеру.
  
  ```
  [root@localhost ~]# isulad-tools add-device ee /dev/sdb:/dev/sdb123
  Add device (/dev/sdb) to container(ee,/dev/sdb123) done.
  [root@localhost ~]# isula exec ee fdisk -l /dev/sdb123
  Disk /dev/sdb123: 50 GiB, 53687091200 bytes, 104857600 sectors
  Units: sectors of 1 * 512 = 512 bytes
  Sector size (logical/physical): 512 bytes / 512 bytes
  I/O size (minimum/optimal): 512 bytes / 512 bytes
  Disklabel type: dos
  Disk identifier: 0xda58a448
  
  Device        Boot Start       End   Sectors Size Id Type
  /dev/sdb123p1       2048 104857599 104855552  50G  5 Extended
  /dev/sdb123p5       4096 104857599 104853504  50G 83 Linux
  ```

- Обновление информации об устройстве.
  
  ```
  [root@localhost ~]# isulad-tools update-device --device-read-bps /dev/sdb:10m ee
  Update read bps for device (/dev/sdb,10485760) done.
  ```

- Удаление устройства.
  
  ```
  [root@localhost ~]# isulad-tools remove-device ee /dev/sdb:/dev/sdb123
  Remove device (/dev/sdb) from container(ee,/dev/sdb123) done.
  Remove read bps for device (/dev/sdb) done.
  ```

## Управление NIC

### Описание функционала

Используя isulad-tools, можно вставлять в контейнер имеющиеся на хосте физические или виртуальные карты NIC. Если карты NIC больше не требуются, isulad-tools позволяет удалить их из контейнера и вернуть на хост. Кроме того, можно динамически изменять настройки NIC. Чтобы вставить физическую карту NIC, добавьте имеющуюся на хосте карту к контейнеру. Чтобы вставить виртуальную карту NIC, создайте пару виртуальных интерфейсов veth, один из них должен быть в контейнере.

### Формат команды

```
isulad-tools [COMMADN][OPTIONS] <container_id>
```

В данном формате:

**COMMAND**: команда, связанная с управлением картами NIC.

**OPTIONS**: параметр, поддерживаемый командой управления картами NIC.

**container\_id:** идентификатор контейнера.

### Описание параметров

| Команда    | Описание функционала                                         | **Описание параметров**                                      |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| add-nic    | Создание карты NIC для контейнера.                           | Поддерживаемые параметры:<br /> ·      **-- type**: тип карты NIC. Поддерживаются только типы **eth** и **veth**. <br /> ·      **--name**: имя карты NIC. Формат: **[***host***:]***container*. Если значение *host* не указано, используется случайное значение.  <br />·      **--ip**: IP-адрес карты NIC. <br /> ·      **--mac**: MAC-адрес карты NIC.<br /> ·      **--bridge**: сетевой мост, привязанный к карте NIC.<br />  ·      **--mtu**: значение MTU карты NIC. Значение по умолчанию — **1500**.<br />  ·      **--update-config-only**: если этот флаг установлен, обновляются конфигурационные файлы, но карты NIC не добавляются.<br />  ·      **--qlen**: значение QLEN. Значение по умолчанию — **1000**. |
| remove-nic | Удаление карт NIC с контейнера и восстановление их на хосте. | Поддерживаемые параметры:<br /> ·      **--type**: тип карты NIC. <br /> ·      **--name**: имя карты NIC. Формат: **[***host***:]***container*. |
| list-nic   | Вывод списка всех карт NIC в контейнере.                     | Поддерживаемые параметры:<br />·      **--pretty**: вывод данных в формате JSON.<br />·      **--filter**: вывод фильтрованных данных в определенном формате, например **--filter' {"ip":"192.168.3.4/24", "Mtu":1500}'**. |
| update-nic | Изменение параметров конфигурации указанной карты NIC в контейнере. | Поддерживаемые параметры:  <br />·      **--name**: имя карты NIC в контейнере. Параметр обязательный.  <br />·      **--ip**: IP-адрес карты NIC. <br />·      **--mac**: MAC-адрес карты NIC. <br /> ·     **--bridge**: сетевой мост, привязанный к карте NIC.  <br />·      **--mtu**: значение MTU карты NIC.  <br />·      **--update-config-only**: если этот флаг установлен, обновляются конфигурационные файлы, но карты NIC не обновляются.  <br />·      **--qlen**: значение QLEN. |



### Ограничения

- Можно добавлять физические карты NIC (eth) и виртуальные интерфейсы NIC (veth).
- При добавлении NIC доступны функции конфигурирования данного устройства. Параметры настройки включают **--ip**, **--mac**, **--bridge**, **--mtu**, **--qlen**.
- В контейнер можно добавить максимум восемь физических карт NIC.
- Если устройство eth NIC добавляется в контейнер командой **isulad-tools add-nic** без добавления параметра **hook**, необходимо вручную удалить NIC перед тем, как контейнер завершит работу. В противном случае имя карты eth NIC на хосте будет заменено именем карты, находящейся в контейнере.
- При выполнении команды **add-nic** используйте исходный MAC-адрес для физической карты NIC (за исключением 1822 VF NIC). Не изменяйте MAC-адрес в контейнере или при выполнении команды **update-nic**.
- Используя команду **isulad-tools add-nic,** установите значение MTU. Диапазон значений зависит от модели NIC.
- При использовании isulad-tools для добавления NIC и маршрутов в контейнеры рекомендуется сначала добавить NIC командой **add-nic**, а затем добавить маршруты командой **add-route**. При использовании isulad-tools для удаления NIC и маршрутов из контейнеров рекомендуется сначала удалить маршруты командой **remove-route**, а затем удалить NIC командой **remove-nic**.
- При использовании isulad-tools для добавления NIC одна карта NIC добавляется только в один контейнер.

### Пример

- Запуск системного контейнера и настройка **hook spec** в скрипте выполнения функции перехвата isulad hook.
  
  ```
  [root@localhost ~]# isula run -tid --hook-spec /etc/isulad-tools/hookspec.json --system-container --external-rootfs /root/root-fs none init
  2aaca5c1af7c872798dac1a468528a2ccbaf20b39b73fc0201636936a3c32aa8
  ```

- Добавление виртуальной карты NIC к контейнеру.
  
  ```
  [root@localhost ~]# isulad-tools add-nic --type "veth" --name abc2:bcd2 --ip 172.17.28.5/24 --mac 00:ff:48:13:xx:xx --bridge docker0 2aaca5c1af7c
  Add network interface to container 2aaca5c1af7c (bcd2,abc2) done  
  ```

- Добавление физической карты NIC к контейнеру.
  
  ```
  [root@localhost ~]# isulad-tools add-nic --type "eth" --name eth3:eth1 --ip 172.17.28.6/24  --mtu 1300  --qlen 2100 2aaca5c1af7c
  Add network interface to container 2aaca5c1af7c (eth3,eth1) done
  ```
  
  > ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:  
При добавлении виртуальной или физической карты NIC убедитесь, что она находится в состоянии бездействия. Добавление NIC, которая в данный момент находится в обслуживании, приведет к отключению системы от сети.

## Управление маршрутами

### Описание функционала

Инструменты isulad-tools можно использовать для динамического добавления или удаления таблиц маршрутизации для системных контейнеров.

### Формат команды

```
isulad-tools [COMMADN][OPTIONS] <container_id> [ARG...]
```

В данном формате:

**COMMAND**: команда, связанная с управлением маршрутами.

**OPTIONS**: параметр, поддерживаемый командой управления маршрутами.

**container\_id:** идентификатор контейнера.

**ARG**: параметр, соответствующий команде.

### Описание API

| Команда      | **Описание функционала**                             | Описание параметров                                          | **Формат параметров**                                        |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| add-route    | Добавление правил сетевой маршрутизации в контейнер. | Поддерживаемые параметры:  <br />**--update-config-only**: если этот параметр настроен, обновляются конфигурационные файлы, но маршрутные таблицы не обновляются. | Формат параметра: **[{***rule1***},{***rule2***}]** Пример *rule*:  '[{"dest":"default", "gw":"192.168.10.1"},{"dest":"192.168.0.0/16","dev":"eth0","src":"192.168.1.2"}]'  ·      **dest**: целевая сеть. Если этот параметр не указан, используется шлюз по умолчанию.  <br />·      **src**: IP-адрес источника маршрута.  <br />·      **gw**: маршрутный шлюз.  <br />·      **dev**: сетевое устройство. |
| remove-route | Удаление маршрута из контейнера.                     | Поддерживаемые параметры:  <br />**--update-config-only**: если этот параметр настроен, обновляются конфигурационные файлы, но маршруты из контейнера не удаляются. | Формат параметра: **[***{rule1}***,***{rule2}***]** Пример *rule*:  '[{"dest":"default", "gw":"192.168.10.1"},{"dest":"192.168.0.0/16","dev":"eth0","src":"192.168.1.2"}]'  ·      **dest**: целевая сеть. Если этот параметр не указан, используется шлюз по умолчанию.  <br />·      **src**: IP-адрес источника маршрута.  <br />·      **gw**: маршрутный шлюз.  <br />·      **dev**: сетевое устройство. |
| list-route   | Вывод списка всех правил маршрутизации в контейнере. | Поддерживаемые параметры:  <br />·      **--pretty**: вывод данных в формате JSON.  <br />·      **--filter**: вывод фильтрованных данных в определенном формате, например **--filter' {"ip":"192.168.3.4/24", "Mtu":1500}'**. | --                                                           |



### Ограничения

- При использовании isulad-tools для добавления NIC и маршрутов в контейнеры рекомендуется сначала добавить NIC командой **add-nic**, а затем добавить маршруты командой **add-route**. При использовании isulad-tools для удаления NIC и маршрутов из контейнеров рекомендуется сначала удалить маршруты командой **remove-route**, а затем удалить NIC командой **remove-nic**.
- При добавлении правила маршрутизации к контейнеру убедитесь, что добавляемое правило не противоречит существующим правилам маршрутизации в контейнере.

### Пример

- Запуск системного контейнера и настройка **hook spec** в скрипте выполнения функции перехвата isulad hook.
  
  ```
  [root@localhost ~]# isula run -tid --hook-spec /etc/isulad-tools/hookspec.json --system-container --external-rootfs /root/root-fs none init
  0d2d68b45aa0c1b8eaf890c06ab2d008eb8c5d91e78b1f8fe4d37b86fd2c190b
  ```

- Добавление физической карты NIC в системный контейнер с помощью isulad-tools.
  
  ```
  [root@localhost ~]# isulad-tools add-nic --type "eth" --name enp4s0:eth123 --ip 172.17.28.6/24  --mtu 1300  --qlen 2100 0d2d68b45aa0
  Add network interface (enp4s0) to container (0d2d68b45aa0,eth123) done
  ```

- Добавление таблицы маршрутизации в системный контейнер с помощью isulad-tools. Пример формата:  **\[{"dest":"default", "gw":"192.168.10.1"},{"dest":"192.168.0.0/16","dev":"eth0","src":"192.168.1.2"}]**. Если параметр **dest** не будет указан, его значением станет **default**.
  
  ```
  [root@localhost ~]# isulad-tools add-route 0d2d68b45aa0 '[{"dest":"172.17.28.0/32", "gw":"172.17.28.5","dev":"eth123"}]'
  Add route to container 0d2d68b45aa0, route: {dest:172.17.28.0/32,src:,gw:172.17.28.5,dev:eth123} done
  ```

- Проверка, что в контейнер добавлено правило маршрутизации.
  
  ```
  [root@localhost ~]# isula exec -it 0d2d68b45aa0 route
  Kernel IP routing table
  Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
  172.17.28.0     172.17.28.5     255.255.255.255 UGH   0      0        0 eth123
  172.17.28.0     0.0.0.0         255.255.255.0   U     0      0        0 eth123
  ```

## Управление монтированием томов

### Описание функционала

В общем контейнере настройкой параметра **--volume** во время создания контейнера монтируются каталоги или тома хоста на контейнере для совместного использования ресурсов. Но уже во время работы контейнера нельзя выполнять операции размонтирования каталогов или томов, которые были смонтированы в контейнер, или размонтирования каталогов или томов хоста, смонтированных в контейнер. Динамически монтировать каталоги или тома хоста в контейнер и удалять каталоги или тома из контейнера с использованием инструмента isulad-tools может только системный контейнер.

### Формат команды

```
isulad-tools [COMMADN][OPTIONS] <container_id> [ARG...]
```

В данном формате:

**COMMAND**: команда, связанная с управлением маршрутами.

**OPTIONS**: параметр, поддерживаемый командой управления маршрутами.

**container\_id:** идентификатор контейнера.

**ARG**: параметр, соответствующий команде.

### Описание API

**Табл. 1**    

| **Команда** | Описание функционала                                         | Описание параметров                                          | Формат параметров                                            |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| add-path    | Добавление имеющихся на хосте файлов или каталогов в контейнер. | --                                                           | Формат файла выглядит следующим образом:  hostpath:containerpath:permission [hostpath:containerpath:permission ...]  <br />В данном формате:  <br />*hostpath*: путь на хосте для хранения тома. *containerpath*: путь в контейнере для хранения тома.  <br />*permission*: разрешение на выполнение операций по указанному пути монтирования в контейнере. |
| remove-path | Удаление каталогов или файлов с контейнера и восстановление их на хосте. | --                                                           | Формат параметра: *hostpath***:***containerpath***[***hostpath***:***containerpath* **]**  <br />В данном формате:  <br />*hostpath*: путь на хосте для хранения тома. *containerpath*: путь в контейнере для хранения тома. |
| list-path   | Вывод списка всех каталогов хранения путей в контейнере.     | Поддерживаемые параметры:  <br />**--pretty**: вывод данных в формате JSON. | --                                                           |



### Ограничения

- При выполнении команды **add-path** укажите абсолютный путь в качестве пути монтирования.
- Точка монтирования /.sharedpath генерируется на хосте после настройки пути монтирования командой **add-path**.
- В контейнер можно добавить максимум 128 томов.
- Не перезаписывайте командой **add-path** корневой каталог (/) в контейнере каталогом хоста. Это может негативно отразиться на работе функций.

### Пример

- Запуск системного контейнера и настройка **hook spec** в скрипте выполнения функции перехвата isulad hook.
  
  ```
  [root@localhost ~]# isula run -tid --hook-spec /etc/isulad-tools/hookspec.json --system-container --external-rootfs /root/root-fs none init
  e45970a522d1ea0e9cfe382c2b868d92e7b6a55be1dd239947dda1ee55f3c7f7
  ```

- Монтирование имеющегося на хосте каталога в контейнер с помощью инструмента isulad-tools и реализация режима совместного использования ресурсов.
  
  ```
  [root@localhost ~]# isulad-tools add-path e45970a522d1 /home/test123:/home/test123
  Add path (/home/test123) to container(e45970a522d1,/home/test123) done.
  ```

- Создание файла в каталоге **/home/test123** хоста и проверка доступности файла из контейнера.
  
  ```
  [root@localhost ~]# echo "hello world" > /home/test123/helloworld
  [root@localhost ~]# isula exec e45970a522d1 bash
  [root@localhost /]# cat /home/test123/helloworld
  hello world
  ```

- Удаление каталога монтирования из контейнера с использованием инструмента isulad-tools.
  
  ```
  [root@localhost ~]# isulad-tools remove-path e45970a522d1 /home/test123:/home/test123
  Remove path (/home/test123) from container(e45970a522d1,/home/test123) done
  [root@localhost ~]# isula exec e45970a522d1 bash
  [root@localhost /]# ls /home/test123/helloworld
  ls: cannot access '/home/test123/helloworld': No such file or directory
  ```