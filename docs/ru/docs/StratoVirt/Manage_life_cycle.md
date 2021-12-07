# Управление жизненным циклом виртуальной машины

\[\[toc]]

## Обзор

В этом разделе описывается, как с помощью StratoVirt управлять жизненным циклом виртуальной машины, то есть запускать в работу, приостанавливать, возобновлять и завершать работу виртуальной машины.

## Создание и запуск виртуальной машины

Как описано в разделе «Конфигурирование виртуальной машины», пользователи могут выполнить настройки ВМ с помощью параметров командной строки или файла JSON, и затем, выполнив команду stratovirt на хосте, создать и запустить виртуальную машину.

- Выполните следующую команду, чтобы создать и запустить виртуальную машину:

```
$/path/to/stratovirt - [Parameter 1] [Parameter Option] - [Parameter 2] [Parameter Option]...
```

- Выполните настройки виртуальной машины с помощью файла JSON. Команда для создания и запуска ВМ выглядит следующим образом:

```
$ /path/to/stratovirt \
    -config /path/to/json \
    -api-channel unix:/path/to/socket
```

В этой команде /path/to/json указывает путь к конфигурационному файлу JSON. /path/to/socket — это файл сокета, задаваемый пользователем (например, /tmp/stratovirt.socket). После выполнения команды автоматически создается файл сокета. Чтобы корректно запустить виртуальную машину, перед выполнением команды убедитесь, что файл сокета не существует.

> ![](./figures/en-05.png)
> 
> После запуска ВМ будут доступны две карты NIC: eth0 и eth1. Эти две сетевые карты предназначены для горячего подключения: сначала подключается eth0, затем eth1. В настоящее время в горячем режиме можно подключить только две NIC-карты virtio-net.

## Подключение виртуальной машины

Для управления виртуальными машинами в StratoVirt используется технология QMP. Чтобы приостановить, возобновить работу и завершить работу виртуальной машины, сначала необходимо подключить ее к StratoVirt через QMP.

Откройте на хосте новую командную строку (CLI B) и выполните следующую команду для установления соединения api-channel:

```
$ ncat -U /path/to/socket
```

После установления соединения появляется приветственное сообщение StratoVirt (см. следующий рисунок).

```
{"QMP":{"version":{"qemu":{"micro":1,"minor":0,"major":4},"package":""},"capabilities":[]}}
```

Теперь можно управлять виртуальной машиной вводом команд QMP в командной строке CLI B.

> ![](./figures/en-05.png)
> 
> В QMP предусмотрены функции остановки, возобновления, завершения работы виртуальной машины, а также запроса ее статуса.
> 
> Все QMP-команды для управления виртуальными машинами вводятся в командной строке CLI B. Значком `<-` обозначается ввод команды, а значком `->` — возвращаемый результат.

## Приостановка работы виртуальной машины

В QMP доступна команда приостановки работы любой виртуальной машины, то есть приостановки работы всех виртуальных процессоров (vCPU) такой ВМ. Формат команды

**{"execute":"stop"}**

**Пример.**

В данном примере работа виртуальной машины приостанавливается командой stop. Выходные данные команды выглядят следующим образом:

```
<- {"execute":"stop"}
-> {"event":"STOP","data":{},"timestamp":{"seconds":1583908726,"microseconds":162739}}
-> {"return":{}}
```

## Возобновление работы виртуальной машины

Для возобновления работы виртуальной машины, то есть для возобновления всех vCPU данной ВМ, используется QMP-команда cont. Формат команды

**{"execute":"cont"}**

**Пример.**

В данном примере работа виртуальной машины возобновляется командой cont. Выходные данные команды выглядят следующим образом:

```
<- {"execute":"cont"}
-> {"event":"RESUME","data":{},"timestamp":{"seconds":1583908853,"microseconds":411394}}
-> {"return":{}}
```

## Завершение работы виртуальной машины

Для завершения работы виртуальной машины, т.е. закрытия процесса StratoVirt, применяется QMP-команда quit. Формат команды

**{"execute":"quit"}**

**Пример.**

```
<- {"execute":"quit"}
-> {"return":{}}
-> {"event":"SHUTDOWN","data":{"guest":false,"reason":"host-qmp-quit"},"timestamp":{"ds":1590563776,"microseconds":519808}}
```