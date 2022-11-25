# Конфигурирование виртуальной машины

## Обзор

В отличие от Libvirt, который для настройки виртуальных машин использует XML-файлы, программное обеспечение StratoVirt позволяет конфигурировать данные о процессоре, памяти и диске виртуальной машины с помощью параметров командной строки или файла JSON. В данном разделе приведено описание двух методов конфигурирования.

> ![](./figures/en-05.png)
> 
> Если доступны оба метода, рекомендуется отдать предпочтение командной строке.
> 
> В этом документе /path/to/socket — это файл сокета, путь к которому определяет пользователь.

## Спецификации

- Количество процессоров ВМ: \[1254]
- Объем памяти ВМ: \[256 МиБ,512 ГиБ]
- Количество дисков виртуальной машины (включая диски горячей замены): \[0,6]
- Количество сетевых карт NIC ВМ (включая карты NIC для горячей замены): \[0,2]
- Устройство консоли ВМ поддерживает только одностороннее соединение.
- На платформе x86\_64 можно сконфигурировать максимум 11 устройств mmio. Но помимо дисков и карт NIC рекомендуется сконфигурировать еще максимум два других устройства. На платформе AArch64 можно сконфигурировать максимум 160 устройств mmio. Но помимо дисков и карт NIC рекомендуется сконфигурировать еще максимум двенадцать других устройств.

## Минимальная конфигурация

Минимальная конфигурация StratoVirt:

- Образ ядра Linux в формате PE или bzImage (только x86_64).
- Необходимо задать образ корневой файловой системы rootfs в качестве устройства virtio-blk и добавить его к параметрам ядра.
- Для контроля StratoVirt необходимо использовать api-channel.
- Если для входа в систему будет использоваться ttyS0, необходимо добавить в командную строку запуска последовательный порт и добавить ttyS0 к параметрам ядра.

## Конфигурирование с помощью параметров командной строки

**Обзор**

Настройкой параметров командной строки задается конфигурация виртуальной машины.

**Формат команды**

Формат команды, сконфигурированной с помощью команды cmdline:

**$ /path/to/stratovirt** *-\[параметр 1] \[значение параметра]] -\[параметр 2] \[значение параметра] ...*

**Процедура**

1. Чтобы убедиться в возможности создания сокета, необходимого для api-channel, выполните очистку среды следующей командой:
   
   ```
   $rm [parameter] [user-defined socket file path]
   ```

2. Выполните команду cmdline.
   
   ```
   $ /path/to/stratovirt -[Parameter 1] [Parameter Option] -[Parameter 2] [Parameter Option] ...
   ```

**Описание параметров**

В следующей таблице перечислены параметры команды cmdline.

**Табл. 1** Описание параметров команды

| Параметр          | Значение                                                     | Описание                                                     |
| :---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| -name             | *VMName*                                                     | Имя виртуальной машины (строка длиной от 1 до 255 символов). |
| -machine          | `[type=vm_type]` `[,dump-guest-core=on]` `[,mem-share=off]`  | Тип виртуальной машины.                                      |
| -kernel           | /path/to/vmlinux.bin                                         | Образ ядра.                                                  |
| -append           | console=ttyS0 root=/dev/vda reboot=k panic=1                 | Параметры командной строки ядра.                             |
| -initrd           | /path/to/initrd.img                                          | Файл initrd.                                                 |
| -smp              | \[cpus=] количество процессоров                              | Количество процессоров. Диапазон значений: \[1254].          |
| -m                | Byte/MiB/GiB                                                 | Размер памяти. Диапазон значений: \[256MiB,512GiB].          |
| -drive            | id=rootfs,file=/path/to/rootfs\[,readonly=false,direct=true,serial=serial\_num] | Конфигурация устройства virtio-blk.                          |
| -netdev           | id=iface\_id,netdev=tap0\[,mac=mac\_address]                 | Конфигурация устройства virtio-net.                          |
| -chardev          | id=console\_id,path=/path/to/socket                          | Конфигурация virtio-console. Перед выполнением команды убедитесь, что файл сокета не существует. |
| -device           | vsock,id=vsock\_id,guest-cid=3                               | Конфигурация vhost-vsock.                                    |
| -api-channel      | unix:/path/to/socket                                         | Конфигурация api-channel. Перед выполнением команды убедитесь, что файл сокета не существует. |
| -serial           | stdio                                                        | Конфигурация устройства с последовательным портом.           |
| -D                | /path/to/logfile                                             | Конфигурация файлов журнала.                                 |
| -pidfile          | /path/to/pidfile                                             | Конфигурация файла PID. Этот параметр должен использоваться вместе с параметром -daemonize. |
| -disable-seccomp  | \--                                                          | Отключение функции Seccomp, которая по умолчанию включена.   |
| -omit\_vm\_memory | \--                                                          | Данный параметр отменяет создание дампа памяти ВМ при переходе процесса в состояние сбоя (panic state). |
| -daemonize        | \--                                                          | Включает фоновый процесс демон (daemon).                     |
| -iothread         | id="iothread1"                                               | Поток iothread.                                              |
| -balloon          | deflate-on-oom=true                                          | Устройство balloon.                                          |
| -mem-path         | /dev/hugepages                                               | Огромные страницы.                                           |



**Пример**

1. Следующей командой удаляется файл сокета, чтобы убедиться в возможности создания api-channel.
   
   ```
   $ rm -f /tmp/stratovirt.socket
   ```

2. Далее выполняется команда StratoVirt.
   
   ```
   $ /path/to/stratovirt \
       -kernel /path/to/vmlinux.bin \
       -append console=ttyS0 root=/dev/vda rw reboot=k panic=1 \
       -drive file=/home/rootfs.ext4,id=rootfs,readonly=false \
       -api-channel unix:/tmp/stratovirt.socket \
       -serial stdio
   ```
   
   После выполнения команды виртуальная машина создается и запускается в соответствии с заданными параметрами конфигурации.

## Конфигурирование с помощью файла JSON

**Обзор**

В данном способе при запуске StratoVirt для создания виртуальной машины система считывает содержимое указанного файла JSON с конфигурацией виртуальной машины.

**Формат команды**

Для конфигурирования ВМ с помощью файла JSON используется следующий формат команды. В этой команде /path/to/json указывает путь к соответствующему файлу.

**$ /path/to/stratovirt -config** */path/to/json -\[параметр] \[значение параметра]*

**Процедура**

1. Создайте файл JSON и запишите в него конфигурацию виртуальной машины.

2. Выполните команду StratoVirt, чтобы создать виртуальную машину.
   
   ```
   $ /path/to/stratovirt -config /path/to/json - [Parameter] [Parameter Option]
   ```

**Описание параметров**

В следующей таблице приведены параметры конфигурационного файла JSON.

**Табл. 2** Параметры конфигурационного файла

| Параметр| Значение| Описание|
|----------|----------|----------|
| boot-source| "kernel\_image\_path": "/path/to/vmlinux.bin","boot\_args": "console=ttyS0 reboot=k panic=1 pci=off tsc=reliable ipv6.disable=1 root=/dev/vda quiet","initrd\_fs\_path": "/path/to/initrd.img"| Настройка образа и параметров ядра. Параметр `initrd_fs_path` необязателен.|
| machine-config| "name": "abc","vcpu\_count": 4,"mem\_size": 805306368,"omit\_vm\_memory": true| Количество виртуальных процессоров и объем памяти. Параметр `omit_vm_memory` необязателен.|
| drive| "drive\_id": "rootfs","path\_on\_host": "/path/to/rootfs.ext4","read\_only": false,"direct": true,"serial\_num": "xxxxx"| Конфигурация диска virtio-blk. Параметр `serial_num` необязателен.|
| net| "iface\_id": "net0","host\_dev\_name": "tap0","mac": "xx:xx:xx:xx:xx:xx"| Конфигурация NIC-карты virtio-net. Параметр `mac` необязателен.|
| console| "console\_id": "charconsole0","socket\_path": "/path/to/socket"| Конфигурация |
| vsock| "vsock\_id": "vsock0","guest\_cid": 3| Конфигурация устройства virtio-vsock.|
| serial| "stdio": true| Конфигурация устройства с последовательным портом.|
| iothread | "id": "iothread1" | ID потока iothread1, используемый для создания потока iothread1. |
| balloon | "deflate_on_oom": true | Конфигурация функции auto deflate. |

В следующей таблице приведены параметры выполняемых команд в файле JSON.

**Табл. 3** Параметры выполняемых команд в файле JSON

| Параметр| Значение| Описание|
|----------|----------|----------|
| -config| /path/to/json| Конфигурация пути к файлу.|
| -api-channel| unix:/path/to/socket| Конфигурация api-channel. Перед выполнением команды убедитесь, что файл сокета не существует.|
| -D| /path/to/logfile| Конфигурация файлов журнала.|
| -pidfile| /path/to/pidfile| Параметр PID-файла, который должен использоваться вместе с параметром -daemonize. Перед выполнением команды убедитесь, что PID-файл не существует.|
| -disable-seccomp| \--| Отключение функции Seccomp, которая по умолчанию включена.|
| -daemonize| \--| Включает фоновый процесс демон (daemon).|

**Пример**

1. В данном примере создается JSON-файл /home/config.json. Содержимое файла выглядит следующим образом:

```
{
  "boot-source": {
    "kernel_image_path": "/path/to/vmlinux.bin",
    "boot_args": "console=ttyS0 reboot=k panic=1 pci=off tsc=reliable ipv6.disable=1 root=/dev/vda quiet"
  },
  "machine-config": {
    "name": "abc",
    "vcpu_count": 2,
    "mem_size": 268435456,
    "omit_vm_memory": false
  },
  "drive": [
    {
      "drive_id": "rootfs",
      "path_on_host": "/path/to/rootfs.ext4",
      "direct": true,
      "read_only": false,
      "serial_num": "abcd"
    }
  ],
  "net": [
    {
      "iface_id": "net0",
      "host_dev_name": "tap0",
      "mac": "0e:90:df:9f:a8:88"
    }
  ],
  "console": {
    "console_id": "charconsole0",
    "socket_path": "/path/to/console.socket"
  },
  "serial": {
    "stdio": true
  },
  "vsock": {
    "vsock_id": "vsock-123321132",
    "guest_cid": 4
  }
}

```

2. Запустите StratoVirt, чтобы считать файл JSON и затем создать и запустить виртуальную машину.

```
$ /path/to/stratovirt \
    -config /home/config.json \
    -api-channel unix:/tmp/stratovirt.socket
```

Успешный результат выполнения команды означает, что виртуальная машина создана и запущена.

## Описание конфигурации

### Тип виртуальной машины

Параметр -machine используется для указания типа ВМ, которую нужно запустить.

Описание параметра

- type: указывает тип запускаемой виртуальной машины. В настоящее время поддерживается только MicroVm. Данный параметр является необязательным, а значение по умолчанию — MicroVM.
- dump-guest-core: определяет, следует ли сбрасывать (dump) память виртуальной машины при аварийном завершении процесса. Данный параметр является необязательным.
- mem-share: определяет, следует ли делить память с другими процессами. Данный параметр является необязательным.

### Конфигурирование диска

В конфигурацию диска ВМ входят следующие элементы.

- drive\_id: идентификатор диска.
- path\_on\_host: путь диска.
- serial\_num: (необязательно) серийный номер диска.
- read\_only: (необязательно) определяет, является ли файл доступным только для чтения.
- direct: (необязательно) определяет, следует ли включить режим O\_DIRECT.
- iothread: (необязательно) настройка атрибутов iothread.
- iops: (необязательно) настройка QoS диска для ограничения операций ввода-вывода диска.

Ниже описаны элементы конфигурации iops и iothread.

#### iops: QoS диска.

##### Обзор

QoS — это качество обслуживания. В сценариях облачных вычислений на одном хосте запускается несколько виртуальных машин. Если какая-либо ВМ имеет большую нагрузку на доступ к дискам, общая пропускная способность хоста ограничена, что приводит к задействованию пропускной способности доступа для других ВМ. В результате происходит влияние на операции ввода-вывода других виртуальных машин. Чтобы уменьшить влияние друг на друга, вы можете настроить атрибуты QoS для ВМ, чтобы ограничить скорость доступа к дискам.

##### Примечание.

- В настоящее время QoS поддерживает настройку IOPS диска.
- Диапазон значений iops — \[0, 1000000]. Значение 0 указывает на то, что скорость не ограничена. Фактический показатель IOPS не превышает заданного значения и не превышает верхний предел фактической производительности внутренних дисков.
- Можно ограничить только среднее значение IOPS, а мгновенный трафик не может быть ограничен.

##### Метод конфигурации

Процедура

**CLI**

```
-drive xxx,iops=200
```

Параметр:

- iops: скорость передачи ввода-вывода диска на виртуальной машине не превышает значения этого параметра.
- xxx: другие настройки диска.

Файл JSON

```
{
    ...
    "drive": [
        {
            "drive_id": "rootfs",
            "path_on_host": "/path/to/block",
            ...
            "iops": 200
        }
    ],
    ...
}
```

#### iothread:

Для получения более подробной информации о конфигурации iothread см. в разделе [Конфигурирование iothread](#iothread-configuration).

### Конфигурирование карты NIC

В конфигурацию карты NIC ВМ входят следующие элементы:

- iface\_id: уникальный идентификатор устройства.
- host\_dev\_name: имя устройства tap на хосте.
- mac: (необязательно) MAC-адрес виртуальной машины.
- iothread: (необязательно) настройка атрибутов iothread диска.

Для получения более подробной информации о конфигурации iothread NIC см. в разделе [Конфигурирование iothread](#iothread-configuration).

### Конфигурирование консольного устройства

virtio-console — это устройство универсального последовательного порта, которое используется для передачи данных между гостем и хостом. Элементы конфигурации консольного устройства:

- console\_id: уникальный идентификатор устройства.
- socket\_path: путь к файлу virtio console.

Перед запуском Stratovirt убедитесь, что файл консоли не существует.

### Конфигурирование устройства vsock

vsock также является устройством для связи между хостом и гостем. Оно похоже на консоль, но обладает более высокой производительностью. Элементы конфигурации:

- vsock\_id: уникальный идентификатор устройства.
- guest\_cid: уникальный идентификатор контекста.

### Конфигурирование огромной страницы (Hugepage)

#### Обзор

StratoVirt поддерживает настройку огромных страниц для виртуальных машин. По сравнению с традиционным режимом страницы памяти 4 КБ, огромная страничная память может эффективно уменьшить количество промахов TLB и прерываний из-за сбоев страниц, значительно повышая производительность сервисов, интенсивно использующих память.

#### Меры предосторожности

- Указанный каталог, в который монтируется огромная страница. Значение должно быть абсолютным путем.
- Данный параметр можно установить только во время запуска.
- Поддерживаются только статические огромные страницы.
- Перед использованием огромной страницы необходимо сконфигурировать ее на хосте.
- Чтобы использовать функцию огромной страницы, убедитесь, что размер памяти ВМ является целым числом, кратным размеру огромной страницы.

#### Взаимоисключающие функции

- Если настроена функция огромной страницы, функция balloon не действует.

#### Метод конфигурации

##### Конфигурирование огромной страницы на хосте

###### Подключение

Смонтируйте файловую систему огромной страницы в указанный каталог. `/path/to/hugepages` — это задаваемый пользователем пустой каталог.

```
$ mount -t hugetlbfs hugetlbfs /path/to/hugepages
```

###### Установка количества огромных страниц

* Установите количество статических огромных страниц. `num` указывает на заданное количество огромных страниц.

  ```
  $ sysctl vm.nr_hugepages=num
  ```

* Запрос статистики огромных страниц

  ```
  $ cat /proc/meminfo | grep Hugepages
  ```

  Для получения статистики огромных страниц других размеров просмотрите соответствующую информацию в каталоге `/sys/kernel/mm/hugepages/hugepages-*/`.

</br>
![img](C:/Users/g30008409/Documents/Studio 2019/Projects/项目 14/ru-RU/figures/zh-cn_image_to_know.png)

1. Настройте параметры памяти StratoVirt и огромных страниц на основе их использования. Если ресурсов огромной страницы недостаточно, ВМ не удается запустить.

#### Добавление конфигурации огромной страницы при запуске StratoVirt

- CLI

  ```
  -mem-path /page/to/hugepages
  ```

  В приведенной выше команде `/page/to/hugepages` указывает на каталог, в который смонтирована файловая система огромных страниц. Поддерживаются только абсолютные пути.

- Файл JSON

  ```json
  {
      "machine-config": {
          "mem_path": "/page/to/hugepages",
          ...    
      },
          ...
  }
  ```

  В приведенной выше команде `/page/to/hugepages` указывает на каталог, в который смонтирована файловая система огромных страниц. Поддерживаются только абсолютные пути.

</br>
![img](C:/Users/g30008409/Documents/Studio 2019/Projects/项目 14/ru-RU/figures/zh-cn_image_note.png)

1. **Типичная конфигурация**: элемент mem-path в командной строке StratoVirt — каталог монтирования файловой системы огромных страниц. Для типичной конфигурации рекомендуется использовать функцию огромной страницы StratoVirt.

### Конфигурирование iothread

#### Обзор

После того, как StratoVirt запускает ВМ с конфигурацией iothread, на хосте будет запущен отдельный поток, не зависящий от основного потока. Эти отдельные потоки могут быть использованы для обработки запросов ввода-вывода устройства, улучшая производительность ввода-вывода устройства и уменьшая влияние на обработку сообщений на плоскости управления.

#### Меры предосторожности

- Можно настроить максимум восемь потоков iothread.
- Атрибут iothread может быть настроен для дисков и сетевых карт.
- Поток iothread занимает ресурсы центрального процессора хоста. Когда нагрузка виртуальной машины на ввод-вывод высока, ресурсы процессора, занимаемые одним iothread, определяются в зависимости от скорости доступа к дискам. Например, обычный SATA-диск занимает менее 20% ресурсов процессора.

#### Создание потока iothread

Процедура

**CLI:**

```shell
-iothread id=iothread1 -iothread id=iothread2
```

**json:**

```json
"iothread": [
    {"id": "iothread1"},
    {"id": "iothread2"}
  ]
```

Параметр:

- id: идентификация потока iothread. Этот идентификатор может быть установлен в атрибуте iothread диска или сетевой карты. Если в параметрах запуска настроена информация о потоке iothread, то после запуска ВМ будет запущен поток с заданным идентификатором на хосте.

#### Конфигурирование атрибута iothread для диска или карты NIC

Процедура

**CLI**

```
# Disk
-drive xxx,iothread=iothread1
# NICs
-netdev xxx,iothread=iothread2
```

    Parameter:

1. iothread: установите для данного параметра идентификатор потока iothread, который обрабатывает ввод-вывод локального устройства.
2. xxx: указывает на другие конфигурации диска или карты NIC.

**Файл JSON**

```json
# Disk
{
    ...
    "drive": [
        {
            "drive_id": "rootfs",
            "path_on_host": "/path/to/block",
            ...
            "iothread": "iothread1",
        }
    ],
    ...
}
# NICs
{
   ...
   "net": [
       {
           "iface_id": "tap0",
           "host_dev_name": "tap0",
           "mac": "12:34:56:78:9A:BC",
           "iothread": "iothread1"
       }
   ]
}
```

### Конфигурирование устройства balloon

#### Обзор

Во время работы ВМ драйвер balloon в этой ВМ динамически занимает или освобождает память, чтобы динамически изменять доступную память ВМ, достигая эластичности памяти.

#### Меры предосторожности

- Перед включением функции balloon убедитесь, что размер страницы гостя такой же, как и у хоста.
- Функция balloon должна быть включена для гостящего ядра.
- При включении эластичного масштабирования памяти в виртуальной машине может возникнуть небольшое замирание кадров, а производительность памяти может ухудшиться.

#### Взаимоисключающие функции

- Огромная страничная память является взаимоисключающей.
- В архитектуре x86 количество прерываний ограничено. Поэтому общее количество устройств balloon и других устройств Virtio не может превышать 11. По умолчанию используются шесть устройств блоков, два сетевых устройства и одно устройство последовательного порта.

#### Спецификации

- Для каждой виртуальной машины может быть сконфигурировано только одно устройство balloon.

#### Метод конфигурации

- CLI

```
-balloon deflate-on-oom=true
```

- Файл JSON

  ```json
  {  
      "balloon": {
          "deflate_on_oom": true  
      },
      ...
  }
  ```

![img](C:/Users/g30008409/Documents/Studio 2019/Projects/项目 14/ru-RU/figures/zh-cn_image_0218587436.png)

1. Значение параметра deflate-on-oom — логический тип, который указывает, следует ли включить функцию auto deflate. При включении этой функции, если устройство balloon отвоевало часть памяти, оно автоматически освобождает эту память для гостя, когда гостю требуется эта память. Если эта функция отключена, система не будет автоматически возвращать ресурсы.
2. При выполнении команды qmp для восстановления памяти ВМ убедитесь, что на ВМ достаточно памяти для поддержки основной работы. В противном случае для некоторых операций может возникнуть тайм-аут, и ВМ не сможет подать заявку на свободную память.
3. Если функция огромной страницы включена в виртуальной машине, функция balloon не сможет отвоевать память, занимаемую огромной страницей.

![img](C:/Users/g30008409/Documents/Studio 2019/Projects/项目 14/ru-RU/figures/zh-cn_image_to_know.png)

- Если для параметра deflate-on-oom установлено значение false и памяти в гостевой ОС недостаточно, balloon не будет автоматически освобождать память и ее возвращать. В результате может возникнуть внутренняя нехватка памяти (OOM) гостевой ОС, процессы могут быть остановлены, и даже ВМ не может нормально работать.