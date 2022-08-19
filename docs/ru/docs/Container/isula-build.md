# Создание образа контейнера

<!-- TOC -->
* [Установка](#installation)
  * [Подготовка](#preparations)
    * [Установка isula-build](#installing-isula-build)
* [Настройка службы isula-build и управление службой](#configuring-and-managing-the-isula-build-service)
  * [Настройка службы isula-build](#configuring-the-isula-build-service)
  * [Управление службой isula-build](#managing-the-isula-build-service)
    * [(Рекомендуется) Использование systemd для управления](#recommended-using-systemd-for-management)
    * [Прямой запуск isula-build](#directly-running-isula-builder)
* [Инструкции по использованию](#usage-guidelines)
  * [Необходимые условия](#prerequisites)
  * [Обзор](#overview)
  * [ctr-img:](#ctr-img-container-image-management)[ ](#ctr-img-container-image-management)[управление образами контейнера](#ctr-img-container-image-management)
    * [build:](#build-container-image-build)[ ](#build-container-image-build)[создание образа контейнера](#build-container-image-build)
    * [image:](#image-viewing-local-persistent-build-images)[ ](#image-viewing-local-persistent-build-images)[просмотр образа в локальном постоянном хранилище](#image-viewing-local-persistent-build-images)
    * [import:](#import-importing-a-basic-container-image)[ ](#import-importing-a-basic-container-image)[импорт базового образа контейнера](#import-importing-a-basic-container-image)
    * [load:](#load-importing-cascade-images)[ ](#load-importing-cascade-images)[импорт каскадных образов](#load-importing-cascade-images)
    * [rm:](#rm-deleting-a-local-persistent-image)[ ](#rm-deleting-a-local-persistent-image)[удаление образа из локального постоянного хранилища](#rm-deleting-a-local-persistent-image)
    * [save:](#save-exporting-cascade-images)[ ](#save-exporting-cascade-images)[экспорт каскадных образов](#save-exporting-cascade-images)
    * [tag:](#tag-tagging-local-persistent-images)[ ](#tag-tagging-local-persistent-images)[присвоение тега образу, хранящемуся в локальном постоянном хранилище](#tag-tagging-local-persistent-images)
    * [pull:](#pull-pulling-an-image-to-a-local-host)[ ](#pull-pulling-an-image-to-a-local-host)[извлечение образа на локальный хост](#pull-pulling-an-image-to-a-local-host)
    * [push:](#push-pushing-a-local-image-to-a-remote-repository)[ ](#push-pushing-a-local-image-to-a-remote-repository)[помещение локального образа в удаленный репозиторий](#push-pushing-a-local-image-to-a-remote-repository)
  * [info:](#info-viewing-the-operating-environment-and-system-information)[ ](#info-viewing-the-operating-environment-and-system-information)[просмотр информации об операционной среде и системе](#info-viewing-the-operating-environment-and-system-information)
  * [login:](#login-logging-in-to-the-remote-image-repository)[ ](#login-logging-in-to-the-remote-image-repository)[вход в удаленный репозиторий образов](#login-logging-in-to-the-remote-image-repository)
  * [logout:](#logout-logging-out-of-the-remote-image-repository)[ ](#logout-logging-out-of-the-remote-image-repository)[выход из удаленного репозитория образов](#logout-logging-out-of-the-remote-image-repository)
  * [version:](#version-querying-the-isula-build-version)[ ](#version-querying-the-isula-build-version)[запрос информации о версии isula-build](#version-querying-the-isula-build-version)
* [Прямая интеграция контейнерного движка](#directly-integrating-a-container-engine)
  * [Интеграция в iSulad](#integration-with-isulad)
  * [Интеграция в Docker](#integration-with-docker)
* [Приложение](#span-idappendixappendix)
  * [Параметры командной строки](#command-line-parameters)
  * [Матрица взаимодействия](#communication-matrix)
  * [Разрешение на работу с файлами](#file-and-permission)

<!-- /TOC -->
## Обзор

isula-build — это инструмент создания образов контейнеров, разработанный командой специалистов по контейнерам iSula. Инструмент позволяет быстро создавать образы контейнера с помощью Dockerfiles.

isula-build использует режим сервер-клиент. isula-build функционирует как клиент и предоставляет набор инструментов командной строки, используемых для создания и управления образами. isula-builder функционирует как сервер, обрабатывая запросы на управление клиентами, и функционирует как процесс демона, выполняемый в фоновом режиме.

![isula-build architecure](./figures/isula-build_arch.png)

Примечание.

- В настоящее время isula-build поддерживает только образы Docker.

## Установка

### Подготовка

Чтобы успешно установить инструмент isula-build, необходимо соблюсти следующие требования к программному и аппаратному обеспечению:

- Поддерживаемые архитектуры: x86\_64 и AArch64
- Поддерживаемая ОС: openEuler
- Наличие прав пользователя root.

#### Установка isula-build

Перед использованием isula-build для создания образа контейнера необходимо установить следующие пакеты программного обеспечения:

**(Рекомендуется) Способ 1. Использование YUM**

1. Сконфигурируйте локальный источник Yum openEuler.

2. Войдите на целевой сервер в качестве пользователя root и установите isula-build.
   
   ```
   sudo yum install -y isula-build
   ```

**Способ 2. Использование пакета RPM**

1. Получите установочный пакет isula-build-\*.rpm из источника openEuler yum, например isula-build-0.9.3-1.oe1.x86\_64.rpm.

2. Выгрузите полученный пакет программного обеспечения RPM в любой каталог целевого сервера, например /home/.

3. Войдите на целевой сервер в качестве пользователя root и установите isula-build, используя следующую команду:
   
   ```
   sudo rpm -ivh /home/isula-build-*.rpm
   ```

> **Примечание.** После успешного завершения установки необходимо вручную запустить службу isula-build. Подробную информацию о том, как запустить данную службу, см. в разделе «Управление службой isula-build».

## Настройка службы isula-build и управление службой

### Настройка службы isula-build

После установки пакета программного обеспечения isula-build служба systemd запускает службу isula-build в соответствии с настройками по умолчанию, содержащимися в пакете программного обеспечения isula-build на сервере isula-build. Если заданный по умолчанию конфигурационный файл на сервере isula-build не отвечает текущим требованиям, выполните следующие операции для его настройки. После изменения конфигурации по умолчанию перезапустите сервер isula-build, чтобы новые настройки вступили в силу. Подробнее см. раздел «Управление службой isula-build».

В настоящее время сервер isula-build содержит следующий конфигурационный файл:

- /etc/isula-build/configuration.toml: общий конфигурационный файл, который используется для настройки уровня журнала, каталога с атрибутом постоянства (persistency), каталога среды выполнения и среды выполнения OCI isula-builder. Описание параметров, содержащихся в конфигурационном файле:

| Конфигурационный параметр | Обязательный или необязательный | Описание                                                     | Значение                                                     |
| ------------------------- | ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| debug                     | Необязательный                  | Включает или отключает функцию журнала отладки.              | true: функция журнала отладки включена. false: функция журнала отладки выключена. |
| loglevel                  | Необязательный                  | Уровень журнала.                                             | debug<br/>info<br/>warn<br/>error                            |
| run\_root                 | Обязательный                    | Корневой каталог с данными среды выполнения.                 | Например, /var/run/isula-build/                              |
| data\_root                | Обязательный                    | Установка локального каталога с атрибутом постоянства (persistency). | Например, /var/lib/isula-build/                              |
| runtime                   | Необязательный                  | Тип среды выполнения. В настоящее время поддерживается только runc. | runc                                                         |
| group                     | Необязательный                  | Установка группы владельцев для локального файла сокета isula\_build.sock, чтобы непривилегированные пользователи в данной группе могли использовать инструмент isula-build. | isula                                                        |


- /etc/isula-build/storage.toml: конфигурационный файл для локального хранения атрибутов постоянства (persistency), включая конфигурацию используемого драйвера хранилища.

| Конфигурационный параметр | Обязательный или необязательный | Описание                                                     |
| ------------------------- | ------------------------------- | ------------------------------------------------------------ |
| driver                    | Необязательный                  | Тип драйвера хранилища. В данный момент поддерживается overlay2. |
Дополнительные настройки см. в [containers-storage.conf.5.md](https://github.com/containers/storage/blob/master/docs/containers-storage.conf.5.md).

- /etc/isula-build/registries.toml: конфигурационный файл для каждого репозитория образов.

| Конфигурационный параметр | Обязательный или необязательный | Описание                                                     |
| ------------------------- | ------------------------------- | ------------------------------------------------------------ |
| registries.search         | Необязательный                  | Поисковой домен хранилища образов. Найти можно только включенные в список репозитории образов. |
| registries.insecure       | Необязательный                  | Доступные небезопасные репозитории образов. Включенные в список репозитории образов не могут пройти аутентификацию и не рекомендуются к использованию. |
Дополнительные настройки см. в [containers-registries.conf.5.md](https://github.com/containers/image/blob/master/docs/containers-registries.conf.5.md).

- /etc/isula-build/policy.json: файл политики извлечения/помещения образов. Примечание. В настоящее время этот параметр не конфигурируется.

> ![](./public_sys-resources/icon-note.gif) **Примечание**:
> 
> - isula-build поддерживает вышеприведенный конфигурационный файл максимальным размером 1 МиБ.
> - Рабочий каталог с атрибутом постоянства нельзя сконфигурировать на диске, например, tmpfs.
> - В настоящее время в качестве драйвера graphdriver можно использовать только overlay2.
> - Перед настройкой параметра --group убедитесь, что соответствующая группа пользователей создана в локальной ОС, и в данную группу добавлены непривилегированные пользователи. После перезапуска isula-builder непривилегированные пользователи смогут использовать данный инструмент. Кроме того, для обеспечения согласованности разрешений массив, в котором хранится каталог /etc/isula-build с конфигурационным файлом isula-build, устанавливается в группу, указанную параметром --group.

### Управление службой isula-build

В настоящее время служба isula-build в openEuler управляется службой systemd. Пакет программного обеспечения isula-build содержит файл службы systemd. После установки пакета программного обеспечения isula-build инструмент systemd можно использовать для запуска или остановки службы isula-build. Также программное обеспечение isula-builder можно запустить вручную. Обратите внимание, что в один момент времени на узле можно запустить только один процесс isula-builder.

> ![](./public_sys-resources/icon-note.gif) **Примечание**: 
> В один момент времени на узле можно запустить только один процесс isula-builder.

#### (Рекомендуется) Использование systemd для управления

Запуск, остановка и перезапуск службы isula-build осуществляются следующими командами systemd:

- Запустите службу isula-build следующей командой:
  
  ```sh
  sudo systemctl start isula-build.service
  ```

- Остановите службу isula-build следующей командой:
  
  ```sh
  sudo systemctl stop isula-build.service
  ```

- Перезапустите службу isula-builder следующей командой:
  
  ```sh
  sudo systemctl restart isula-build.service
  ```

Файл службы systemd пакета установочного ПО isula-build хранится в каталоге `/usr/lib/systemd/system/isula-build.service`. Если необходимо изменить конфигурацию systemd для службы isula-build, измените файл и выполните следующую команду, чтобы изменение вступило в силу. Затем перезапустите службу isula-build командой управления службы systemd.

```sh
sudo systemctl daemon-reload
```

#### Прямой запуск isula-build

Служба также запускается командой isula-builder на сервере. Команда isula-builder может содержать флаги для запуска службы. Поддерживаются следующие флаги:

- -D, --debug: включение режима отладки.
- --log-level: уровень журнала. Значения debug, info, warn, error. Значение по умолчанию — **info**.
- --dataroot: локальный каталог с атрибутом постоянства. Его значение по умолчанию — var/lib/isula-build/.
- --runroot: каталог среды выполнения. Его значение по умолчанию — /var/run/isula-build/.
- --storage-driver: тип основного драйвера хранилища.
- --storage-opt: конфигурация основного драйвера хранилища.
- --group: установка группы владельцев для локального файла сокета isula\_build.sock, чтобы непривилегированные пользователи в группе могли использовать инструмент isula-build. Группа владельцев по умолчанию — «isula».

> ![](./public_sys-resources/icon-note.gif) **Примечание**: 
> Если параметры запуска командной строки содержат те же параметры настройки, что и в конфигурационном файле, параметры командной строки приоритетно используются для запуска.

Запустите службу isula-build. Например, чтобы указать локальный каталог с атрибутом постоянства /var/lib/isula-build и отключить функцию отладки, выполните следующую команду:

```sh
sudo isula-builder --dataroot "/var/lib/isula-build" --debug=false
```

## Инструкции по использованию

### Необходимые условия

Работа инструмента isula-build зависит от исполняемого файла runc, с помощью которого создается команда RUN в Dockerfile. Таким образом, необходимо в рабочей среде isula-build заранее установить runc. Метод установки зависит от сценария применения. Если не требуется весь набор инструментов docker-engine, можно установить только пакет RPM с docker-runc.

```sh
sudo yum install -y docker-runc
```

Если требуется весь набор инструментов docker-engine, установите пакет RPM docker-engine, который по умолчанию содержит исполняемый файл runc.

```sh
sudo yum install -y docker-engine
```

> ![](./public_sys-resources/icon-note.gif) **Примечание**: 
> Пользователи должны обеспечить защиту исполняемых файлов в среде выполнения OCI, которая предотвратит злонамеренную их замену.

### Обзор

Клиент isula-build предоставляет набор команд для создания образов контейнеров и управления ими. В настоящее время клиент isula-build предоставляет следующие команды:

- ctr-img: управление образами контейнера. Команда ctr-img содержит следующие подкоманды:
  - build: создание образа контейнера на основе указанного файла Dockerfile.
  - images: вывод списка образов локального контейнера.
  - import: импорт базового образа контейнера.
  - import: импорт каскадного образа.
  - rm: удаление образа локального контейнера.
  - save: экспорт каскадного образа на локальный диск.
  - tag: добавление тега к образу локального контейнера.
  - pull: извлечение образа на локальный хост.
  - push: помещение локального образа в удаленный репозиторий.
- info: отображение информации о рабочей среде и системной информации isula-build.
- login: вход в удаленный репозиторий хранения образов контейнера.
- logout: выход из удаленного репозитория хранения образов контейнера.
- version: отображение версий isula-build и isula-builder.

> ![](./public_sys-resources/icon-note.gif) **Примечание**: 
> Команды завершения isula-build и isula-builder используются для генерирования скрипта завершения команды bash. Данная команда неявным образом предоставляется в структуре интерфейса командной строки и не отображается в справочной информации.

Далее подробно описывается, как использовать эти команды.

### ctr-img: управление образами контейнера

Команда isula-build объединяет все команды управления образами контейнера в команду `ctr-img`. Команда выглядит следующим образом:

```
isula-build ctr-img [command]
```

#### build: создание образа контейнера

Подкоманда **build** команды **ctr-img** используется для создания образа контейнера. Команда выглядит следующим образом:

```
isula-build ctr-img build [flags]
```

Команда build содержит следующие флаги:

- --build-arg: список значений строкового типа, который содержит переменные, необходимые для процесса создания.
- --build-static: ключевое значение, которое используется для создания двоичного эквивалента. В настоящее время доступны следующие ключевые значения:
  - build-time: строковый тип, указывает, что для создания образа контейнера используется фиксированная отметка времени. Формат указания времени: ГГГГ-ММ-ДД ЧЧ-ММ-СС.
- \- f, --filename: строковый тип, путь к файлам Dockerfiles. Если этот параметр не указан, используется текущий путь.
- --iidfile: строковый тип, идентификатор для вывода образа в локальный файл.
- \- o, --output: строковый тип, задает режим и путь экспорта образа.
- --proxy: логический тип, наследует переменную среды прокси на хосте. Значение по умолчанию — **true**.
- --tag: строковый тип, тег успешно созданного образа.
- --cap-add: список значений строкового типа, содержит разрешения, требуемые командой RUN во время процесса создания.

\*\* Далее подробно описываются флаги. \*\*

**--build-arg**

Параметры в файле Dockerfile наследуются от командных строк. Метод использования:

```sh
$ echo "This is bar file" > bar.txt
$ cat Dockerfile_arg
FROM busybox
ARG foo
ADD ${foo}.txt .
RUN cat ${foo}.txt
$ sudo isula-build ctr-img build --build-arg foo=bar -f Dockerfile_arg
STEP  1: FROM busybox
Getting image source signatures
Copying blob sha256:8f52abd3da461b2c0c11fda7a1b53413f1a92320eb96525ddf92c0b5cde781ad
Copying config sha256:e4db68de4ff27c2adfea0c54bbb73a61a42f5b667c326de4d7d5b19ab71c6a3b
Writing manifest to image destinationStoring signatures
STEP  2: ARG foo
STEP  3: ADD ${foo}.txt .
STEP  4: RUN cat ${foo}.txt
This is bar file
Getting image source signatures
Copying blob sha256:6194458b07fcf01f1483d96cd6c34302ffff7f382bb151a6d023c4e80ba3050a
Copying blob sha256:6bb56e4a46f563b20542171b998cb4556af4745efc9516820eabee7a08b7b869
Copying config sha256:39b62a3342eed40b41a1bcd9cd455d77466550dfa0f0109af7a708c3e895f9a2
Writing manifest to image destination
Storing signatures
Build success with image id: 39b62a3342eed40b41a1bcd9cd455d77466550dfa0f0109af7a708c3e895f9a2
```

**--build-static**

Создание образа со свойствами статичности. То есть, если для создания образа контейнера используется инструмент isula-build, игнорируются различия между всеми отметками времени и другими параметрами процесса создания (например, идентификатором контейнера и именем хоста). В итоге создается образ контейнера, отвечающий требованиям статичности.

Предположим, что при использовании команды isula-build для создания образа контейнера подкоманде build выделяется фиксированная отметка времени, и соблюдаются следующие условия:

- Среда сборки до обновления соответствует среде сборки после обновления.
- Dockerfile до создания образа соответствует Dockerfile после создания образа.
- Промежуточные данные, сгенерированные до и после создания образа, не противоречат друг другу.
- Команды создания образа не изменились.
- Версии сторонних библиотек одинаковые.

Для создания образа контейнера isula-build поддерживает один файл Dockerfile. Если используется та же среда сборки, содержимое и идентификатор образа, сгенерированные в разных операциях создания, будут одинаковы.

**–build-static** поддерживает параметр пары ключ-значение в формате k=v. В настоящее время поддерживаются следующие параметры:

- build-time: строковый тип, указывает, что для создания статического образа используется фиксированная отметка времени. Формат указания времени: ГГГГ-ММ-ДД ЧЧ-ММ-СС. Отметка времени влияет на атрибут файла, используемый для создания и изменения времени на уровне утилиты diff.
  
  Пример.
  
  ```sh
  $ sudo isula-build ctr-img build -f Dockerfile --build-static='build-time=2020-05-23 10:55:33' .
  ```
  
  Образы контейнера и идентификаторы образов, множество раз созданные в одной среде, являются одинаковыми.

**--iidfile**

Выполните следующую команду, чтобы вывести идентификатор созданного образа в файл:

```
isula-build ctr-img build --iidfile filename
```

Например, чтобы экспортировать идентификатор образа контейнера в файл testfile, выполните следующую команду:

```sh
$ sudo isula-build ctr-img build -f Dockerfile_arg --iidfile testfile
```

Проверьте идентификатор образа контейнера в файле testfile.

```sh
$ cat testfile
76cbeed38a8e716e22b68988a76410eaf83327963c3b29ff648296d5cd15ce7b
```

**-o, --output**

В настоящее время команды **-o** и **-output** поддерживают следующие форматы:

- `isulad:image:tag`: напрямую передает успешно созданный образ в iSulad, например `-o isulad:busybox:latest`. Обратите внимание на следующие ограничения:
  
  - isula-build и iSulad должны находиться на одном узле.
  - Должен быть сконфигурирован тег.
  - В клиенте isula-build необходимо временно сохранить успешно созданный образ как `/var/tmp/isula-build-tmp-%v.tar`, а затем импортировать его в iSulad. Убедитесь, что в каталоге `/var/tmp/` достаточно места.

- `docker-daemon:image:tag`: напрямую передает успешно созданный образ в демон Docker, например `-o docker-daemon:busybox:latest`. Обратите внимание на следующие ограничения:

- isula-build и Docker должны находиться на одном узле.
  
  - Должен быть сконфигурирован тег.

- `docker://registry.example.com/repository:tag`: напрямую передает успешно созданный образ в удаленный репозиторий хранения образов, например `-o docker://localhost:5000/library/busybox:latest`.

- `docker-archive:<path>/<filename>:image:tag`: сохраняет успешно созданный образ на локальном хосте в формате образа Docker, например `-o docker-archive:/root/image.tar:busybox:latest`.

Помимо флагов подкоманда build поддерживает также аргумент строкового типа, несущий в себе контекст среды сборки Dockerfile. Значением этого параметра по умолчанию является текущий путь, по которому выполняется команда isula-build. Этот путь влияет на путь, получаемый командами ADD и COPY из файлов .dockerignore и Dockerfile.

**--proxy**

С помощью данной команды контейнер, который запущен командой RUN, наследует переменные среды, связанные с прокси: http\_proxy, https\_proxy, ftp\_proxy, no\_proxy, HTTP\_PROXY, HTTPS\_PROXY, FTP\_PROXY. Значение NO\_PROXY по умолчанию — **true**.

Во время настройки пользователем параметров ARG или ENV, связанных с прокси, в файле Dockerfile, переменные среды перезаписываются.

Примечание. Если клиент и демон работают на разных терминалах, наследуемыми переменными среды являются переменные среды терминала, на котором работает демон.

**--tag**

Тег образа, хранящегося на локальном диске после успешного создания.

**--cap-add**

Данная команда добавляет список разрешений, требуемых командой RUN во время процесса создания:

```
isula-build ctr-img build --cap-add ${CAP}
```

Пример.

```sh
$ sudo isula-build ctr-img build --cap-add CAP_SYS_ADMIN --cap-add CAP_SYS_PTRACE -f Dockerfile
```

> **Примечание.**
> 
> - Одновременно можно создать максимум 100 образов контейнера.
> - isula-build поддерживает файл Dockerfiles максимальным размером 1 МиБ.
> - isula-build поддерживает файл .dockerignore максимальным размером 1 МиБ.
> - Чтобы не допустить изменения файла Dockerfiles со стороны других пользователей, убедитесь, что разрешение на его чтение и запись имеет только текущий пользователь.
> - Во время операции создания команда RUN запускает контейнер, в котором выполняется сборка. В настоящее время isula-build поддерживает только сеть хоста.
> - isula-build поддерживает сжатие только в формате tar.gz.
> - isula-build фиксирует изменения сразу после завершения каждого этапа создания образа, а не исполняет каждый раз строку Dockerfile.
> - isula-build не поддерживает создание кэша.
> - isula-build запускает контейнер сборки только при выполнении команды RUN.
> - В настоящее время функция истории изменений образов Docker не поддерживается.
> - Имя этапа должно начинаться с цифры.
> - Имя этапа может включать максимум 64 символа.
> - isula-build не поддерживает функцию ограничения ресурсов, выделяемых на создание одного файла Dockerfile. Если требуется ограничить ресурсы, настройте эту функцию на isula-builder.
> - В настоящее время isula-build не поддерживает удаленный URL как источник данных команды ADD в файле Dockerfile.
> - Локальный файл tarball, экспортируемый с помощью типа «docker-archive», не сжимается, поэтому, если это необходимо, можно сжать файл ручной операцией.

#### image: просмотр образа в локальном постоянном хранилище 

С помощью данной команды можно просматривать образы в локальном постоянном хранилище.

```sh
$ sudo isula-build ctr-img images
----------------------------------------------  -----------  -----------------  --------------------------  ------------ 
REPOSITORY                                      TAG          IMAGE ID           CREATED                     SIZE
----------------------------------------------  -----------  -----------------  --------------------------  ------------ 
localhost:5000/library/alpine                   latest       a24bb4013296       2020-20-19 19:59:197        5.85 MB 
<none>                                          <none>       39b62a3342ee       2020-20-38 38:66:387        1.45 MB
----------------------------------------------  -----------  -----------------  --------------------------  ------------
```

**Примечание**. Размер образа, отображаемого командой `isula-build ctr-img images`, может отличаться от размера, отображаемого при выполнении команды `docker images`. При оценке размера образа isula-build непосредственно суммирует общий размер пакетов .tar в каждом слое, в то время как Docker суммирует общий размер файлов путем распаковки пакета .tar и пересмотра каталога diff. Поэтому статистика отличается.

#### import: импорт базового образа контейнера

Базовый образ контейнера помещается в пакет, например openEuler-docker.x86\_64.tar.xz, с версией. Командой `ctr-img import` осуществляется импорт образа в isula-build.

Команда выглядит следующим образом:

```
isula-build ctr-img import [flags]
```

Пример.

```sh
$ sudo isula-build ctr-img import ./openEuler-docker.x86_64.tar.xz openeuler:20.09
Import success with image id: 7317851cd2ab33263eb293f68efee9d724780251e4e92c0fb76bf5d3c5585e37
$ sudo isula-build ctr-img images
----------------------------------------------  --------------------  -----------------  ------------------------  ------------ 
REPOSITORY                                      TAG                   IMAGE ID           CREATED                   SIZE
----------------------------------------------  --------------------  -----------------  ------------------------  ------------ 
openeuler                                       20.09                 7317851cd2ab       2020-08-01 06:25:34       500 MB
----------------------------------------------  --------------------  -----------------  ------------------------  ------------
```

> ![](./public_sys-resources/icon-note.gif)**Примечание**: 
> isula-build поддерживает импорт базовых образов контейнера максимальным размером 1 ГиБ.

#### load: импорт каскадных образов

Каскадные образы представляют собой образы, которые сохраняются на локальном компьютере при выполнении команды docker save или isula-build ctr-img save. Пакет сжатого образа содержит послойный пакет образа с именем layer.tar. Командой **ctr-img load** осуществляется импорт образа в isula-build.

Команда выглядит следующим образом:

```
isula-build ctr-img load [flags]
```

В настоящее время поддерживаются следующие флаги:

- \- i, --input: путь к локальному пакету .tar.

Пример.

```sh
$ sudo isula-build ctr-img load -i ubuntu.tarGetting image source signatures
Copying blob sha256:cf612f747e0fbcc1674f88712b7bc1cd8b91cf0be8f9e9771235169f139d507c
Copying blob sha256:f934e33a54a60630267df295a5c232ceb15b2938ebb0476364192b1537449093
Copying blob sha256:943edb549a8300092a714190dfe633341c0ffb483784c4fdfe884b9019f6a0b4
Copying blob sha256:e7ebc6e16708285bee3917ae12bf8d172ee0d7684a7830751ab9a1c070e7a125
Copying blob sha256:bf6751561805be7d07d66f6acb2a33e99cf0cc0a20f5fd5d94a3c7f8ae55c2a1
Copying blob sha256:c1bd37d01c89de343d68867518b1155cb297d8e03942066ecb44ae8f46b608a3
Copying blob sha256:a84e57b779297b72428fc7308e63d13b4df99140f78565be92fc9dbe03fc6e69
Copying blob sha256:14dd68f4c7e23d6a2363c2320747ab88986dfd43ba0489d139eeac3ac75323b2
Copying blob sha256:a2092d776649ea2301f60265f378a02405539a2a68093b2612792cc65d00d161
Copying blob sha256:879119e879f682c04d0784c9ae7bc6f421e206b95d20b32ce1cb8a49bfdef202
Copying blob sha256:e615448af51b848ecec00caeaffd1e30e8bf5cffd464747d159f80e346b7a150
Copying blob sha256:f610bd1e9ac6aa9326d61713d552eeefef47d2bd49fc16140aa9bf3db38c30a4
Copying blob sha256:bfe0a1336d031bf5ff3ce381e354be7b2bf310574cc0cd1949ad94dda020cd27
Copying blob sha256:f0f15db85788c1260c6aa8ad225823f45c89700781c4c793361ac5fa58d204c7
Copying config sha256:c07ddb44daa97e9e8d2d68316b296cc9343ab5f3d2babc5e6e03b80cd580478e
Writing manifest to image destination
Storing signatures
Loaded image as c07ddb44daa97e9e8d2d68316b296cc9343ab5f3d2babc5e6e03b80cd580478e
```

> ![](./public_sys-resources/icon-note.gif) **Примечание**:
> 
> Команду **- isula-build load** можно использовать только для импорта сжатого файла образа, содержащего один каскадный образ.
> 
> - isula-build позволяет импортировать образ контейнера максимальным размером 50 ГБ.

#### rm: удаление образа из локального постоянного хранилища

С помощью данной команды можно удалять образы из локального постоянного хранилища. Команда выглядит следующим образом:

```
isula-build ctr-img rm IMAGE [IMAGE...] [FLAGS]
```

В настоящее время поддерживаются следующие флаги:

- -a, -all: удаление всех локально хранящихся образов.
- -p, -prune: удаление всех локально хранящихся образов, которые не имеют тегов.

Пример.

```sh
$ sudo isula-build ctr-img rm -p
Deleted: sha256:78731c1dde25361f539555edaf8f0b24132085b7cab6ecb90de63d72fa00c01d
Deleted: sha256:eeba1bfe9fca569a894d525ed291bdaef389d28a88c288914c1a9db7261ad12c
```

#### save: экспорт каскадных образов

Командой save каскадные образы экспортируются на локальный диск. Команда выглядит следующим образом:

```
isula-build ctr-img save [REPOSITORY:TAG]|imageID -o xx.tar
```

Пример экспорта образа в формате `image/tag`:

```sh
$ sudo isula-build ctr-img save busybox:latest -o busybox.tar
Getting image source signatures
Copying blob sha256:50644c29ef5a27c9a40c393a73ece2479de78325cae7d762ef3cdc19bf42dd0a
Copying blob sha256:824082a6864774d5527bda0d3c7ebd5ddc349daadf2aa8f5f305b7a2e439806f
Copying blob sha256:5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef
Copying config sha256:21c3e96ac411242a0e876af269c0cbe9d071626bdfb7cc79bfa2ddb9f7a82db6
Writing manifest to image destination
Storing signatures
Save success with image: busybox:latest
```

Пример экспорта образа в формате `ImageID`:

```sh
$ sudo isula-build ctr-img save 21c3e96ac411 -o busybox.tar
Getting image source signatures
Copying blob sha256:50644c29ef5a27c9a40c393a73ece2479de78325cae7d762ef3cdc19bf42dd0a
Copying blob sha256:824082a6864774d5527bda0d3c7ebd5ddc349daadf2aa8f5f305b7a2e439806f
Copying blob sha256:5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef
Copying config sha256:21c3e96ac411242a0e876af269c0cbe9d071626bdfb7cc79bfa2ddb9f7a82db6
Writing manifest to image destination
Storing signatures
Save success with image: 21c3e96ac411
```

Пример экспорта нескольких образов в том же формате файла tarball:

```sh
$ sudo isula-build ctr-img save busybox:latest nginx:latest -o all.tar
Getting image source signatures
Copying blob sha256:eb78099fbf7fdc70c65f286f4edc6659fcda510b3d1cfe1caa6452cc671427bf
Copying blob sha256:29f11c413898c5aad8ed89ad5446e89e439e8cfa217cbb404ef2dbd6e1e8d6a5
Copying blob sha256:af5bd3938f60ece203cd76358d8bde91968e56491daf3030f6415f103de26820
Copying config sha256:b8efb18f159bd948486f18bd8940b56fd2298b438229f5bd2bcf4cedcf037448
Writing manifest to image destination
Storing signaturesGetting image source signatures
Copying blob sha256:e2d6930974a28887b15367769d9666116027c411b7e6c4025f7c850df1e45038
Copying config sha256:a33de3c85292c9e65681c2e19b8298d12087749b71a504a23c576090891eedd6
Writing manifest to image destination
Storing signatures
Save success with image: [busybox:latest nginx:latest]
```

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:
> 
> - Команда **save** по умолчанию экспортирует образы в формате .tar. При необходимости можно сохранить образ и сжать его ручной операцией.
> - Выполняя экспорт, укажите целостность образа в формате IMAGE\_NAME:IMAGE\_TAG.

#### tag: присвоение тега образу, хранящемуся в локальном постоянном хранилище

Командой **tag** добавляется тег в локальный образ контейнера, который хранится в локальном постоянном хранилище. Команда выглядит следующим образом:

```
isula-build ctr-img tag <imageID>/<imageName> busybox:latest
```

Пример.

```sh
$ sudo isula-build ctr-img images
----------------------------------------------  -----------  -----------------  --------------------------  ------------ 
REPOSITORY                                      TAG          IMAGE ID           CREATED                     SIZE
----------------------------------------------  -----------  -----------------  --------------------------  ------------
alpine                                         latest       a24bb4013296       2020-05-29 21:19:46         5.85 MB
----------------------------------------------  -----------  -----------------  --------------------------  ------------
$ sudo isula-build ctr-img tag a24bb4013296 alpine:v1
$ sudo isula-build ctr-img images
----------------------------------------------  -----------  -----------------  --------------------------  ------------
REPOSITORY                                      TAG          IMAGE ID           CREATED                     SIZE
----------------------------------------------  -----------  -----------------  --------------------------  ------------
alpine                                           latest       a24bb4013296       2020-05-29 21:19:46         5.85 MB
alpine                                           v1           a24bb4013296       2020-05-29 21:19:46         5.85 MB
----------------------------------------------  -----------  -----------------  --------------------------  ------------
```

#### pull: извлечение образа на локальный хост

Командой **pull** образ извлекается из удаленного репозитория хранения образов на локальный хост. Формат команды:

```
isula-build ctr-img pull REPOSITORY[:TAG]
```

Пример.

```sh
$ sudo isula-build ctr-img pull example-registry/library/alpine:latest
Getting image source signatures
Copying blob sha256:8f52abd3da461b2c0c11fda7a1b53413f1a92320eb96525ddf92c0b5cde781ad
Copying config sha256:e4db68de4ff27c2adfea0c54bbb73a61a42f5b667c326de4d7d5b19ab71c6a3b
Writing manifest to image destination
Storing signatures
Pull success with image: example-registry/library/alpine:latest
```

#### push: помещение локального образа в удаленный репозиторий

Командой push локально хранящийся образ помещается в удаленный репозиторий. Формат команды:

```
isula-build ctr-img push REPOSITORY[:TAG]
```

Пример.

```sh
$ sudo isula-build ctr-img push example-registry/library/mybusybox:latest
Getting image source signatures
Copying blob sha256:d2421964bad195c959ba147ad21626ccddc73a4f2638664ad1c07bd9df48a675
Copying config sha256:f0b02e9d092d905d0d87a8455a1ae3e9bb47b4aa3dc125125ca5cd10d6441c9f
Writing manifest to image destination
Storing signatures
Push success with image: example-registry/library/mybusybox:latest
```

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:
> 
> - Прежде чем передать образ в удаленный репозиторий, необходимо войти в него.

### info: просмотр информации о рабочей среде и системе

Командой isula-build info выполняется просмотр информации о рабочей среде и системе, в которой работают инструменты isula-build. Команда выглядит следующим образом:

```
 isula-build info [flags]
```

Поддерживаются следующие флаги:

- -H, –human-readable: логический тип. Информация о памяти печатается в обычном формате памяти. Значение — 1000 раз.
- -V, --verbose: логический тип. Во время работы системы отображается показатель загрузки памяти.

Пример.

```sh
$ sudo isula-build info -H
   General:  
     MemTotal:     7.63 GB  
     MemFree:      757 MB  
     SwapTotal:    8.3 GB  
     SwapFree:     8.25 GB  
     OCI Runtime:  runc  
     DataRoot:     /var/lib/isula-build/  
     RunRoot:      /var/run/isula-build/  
     Builders:     0  
     Goroutines:   12
   Store:  
     Storage Driver:     overlay  
     Backing Filesystem: extfs
   Registry:  
     Search Registries:   
       oepkgs.net
     Insecure Registries:    
       localhost:5000    
       oepkgs.net
   Runtime:
	 MemSys:           68.4 MB
     HeapSys:          63.3 MB
     HeapAlloc:        7.41 MB
     MemHeapInUse:     8.98 MB
     MemHeapIdle:      54.4 MB
     MemHeapReleased:  52.1 MB
```

### login: вход в удаленный репозиторий хранения образов

Для входа в удаленный репозиторий хранения образов выполняется команда **login**. Команда выглядит следующим образом:

```
 isula-build login SERVER [FLAGS]
```

В настоящее время поддерживаются следующие флаги:

```
 Flags:  
   -p, --password-stdin    Read password from stdin  
   -u, --username string   Username to access registry
```

Введите пароль через stdin. В следующем примере пароль для ввода передается из файла creds.txt в stdin инструмента isula-build через системный вызов pipe.

```sh
 $ cat creds.txt | sudo isula-build login -u cooper -p mydockerhub.io
 Login Succeeded
```

Введите пароль в диалоговом режиме.

```sh
 $ sudo isula-build login mydockerhub.io -u cooper
 Password:
 Login Succeeded
```

### logout: выход из удаленного репозитория хранения образов

Для выхода из удаленного репозитория хранения образов выполняется команда **logout**. Команда выглядит следующим образом:

```
 isula-build logout [SERVER] [FLAGS]
```

В настоящее время поддерживаются следующие флаги:

```
 Flags:  
   -a, --all   Logout all registries
```

Пример.

```sh
 $ sudo isula-build logout -a  
   Removed authentications
```

### version: запрос информации о версии isula-build

Командой **version** запрашивается информация о текущей версии isula-build.

```sh
 $ sudo isula-build version
 Client:
   Version:       0.9.4
   Go Version:    go1.13.3
   Git Commit:    0038365c
   Built:         Tue Nov 24 16:32:05 2020
   OS/Arch:       linux/amd64
 
 Server:
   Version:       0.9.4
   Go Version:    go1.13.3
   Git Commit:    0038365c
   Built:         Tue Nov 24 16:32:05 2020
   OS/Arch:       linux/amd64
```

## Прямая интеграция контейнерного движка

Для импорта созданного образа контейнера в локальное хранилище контейнерного движка инструмент isula-build можно интегрировать в iSulad или Docker.

### Интеграция в iSulad

Успешно созданные образы можно сразу экспортировать в iSulad.

Пример.

```sh
$ sudo isula-build ctr-img build -f Dockerfile -o isulad:busybox:2.0
```

Чтобы экспортировать созданный образ контейнера в iSulad, укажите iSulad в параметре **-o**. Запрос информации об образе выполняется с помощью команды **isula image**.

```sh
$ sudo isula images
isula images
REPOSITORY                     TAG        IMAGE ID             CREATED              SIZE
busybox                        2.0        2d414a5cad6d         2020-08-01 06:41:36  5.577 MB
```

> ![](./public_sys-resources/icon-note.gif) **Примечание**:
> 
> - isula-build и iSulad должны находиться на одном узле.
> - Когда образ напрямую экспортируется в iSulad, клиенту isula-build необходимо временно сохранить успешно созданный образ как `/var/lib/isula-build/tmp/[buildid]/isula-build-tmp-%v.tar`, а затем импортировать его в iSulad. Убедитесь, что в каталоге /var/tmp/ достаточно места. Если процесс клиента isula-build аннулируется, или во время экспорта нажимается комбинация клавиш Ctrl+C, необходимо вручную очистить файл `/var/lib/isula-build/tmp/[buildid]/isula-build-tmp-%v.tar`.

### Интеграция в Docker

Успешно созданные образы можно сразу экспортировать в демон Docker.

Пример.

```sh
$ sudo isula-build ctr-img build -f Dockerfile -o docker-daemon:busybox:2.0
```

Чтобы экспортировать созданный образ контейнера в Docker, укажите docker-daemon в параметре 
**-o**. Запрос информации об образе осуществляется командой **docker images**.

```sh
$ sudo docker images
REPOSITORY                                          TAG                 IMAGE ID            CREATED             SIZE
busybox                                             2.0                 2d414a5cad6d        2 months ago        5.22MB
```

> ![](./public_sys-resources/icon-note.gif) **Примечание**:
> 
> - isula-build и Docker должны находиться на одном узле.

## Приложение

### Параметры командной строки

**Табл. 1** Параметры команды ctr-img build

| **Команда**   | **Параметр**   | **Описание**                                                 |
| ------------- | -------------- | ------------------------------------------------------------ |
| ctr-img build | --build-arg    | Список значений строкового типа, который содержит переменные, необходимые для процесса создания. |
|               | --build-static | Ключевое значение, которое используется для создания двоичного эквивалента. В настоящее время доступны следующие ключевые значения: \- build-time: строковый тип, указывает, что для создания образа контейнера используется фиксированная отметка времени. Формат указания времени: ГГГГ-ММ-ДД ЧЧ-ММ-СС. |
|               | -f, --filename | Строковый тип, путь к файлам Dockerfiles. Если этот параметр не указан, используется текущий путь. |
|               | --iidfile      | Строковый тип, идентификатор для вывода образа в локальный файл. |
|               | -o, --output   | Строковый тип, задает режим и путь экспорта образа.          |
|               | --proxy        | логический тип, наследует переменную среды прокси на хосте. Значение по умолчанию — **true**. |
|               | --tag          | Строковый тип, тег успешно созданного образа.                |
|               | --cap-add      | Список значений строкового типа, содержит разрешения, требуемые командой RUN во время процесса создания. |
**Табл. 2** Параметры команды ctr-img load

| **Команда**  | **Параметр** | **Описание**                                                 |
| ------------ | ------------ | ------------------------------------------------------------ |
| ctr-img load | -i, --input  | Строковый тип, путь к локально хранящемуся пакету .tar, который необходимо импортировать. |
**Табл. 3** Параметры команды ctr-img rm

| **Команда** | **Параметр** | **Описание**                                                 |
| ----------- | ------------ | ------------------------------------------------------------ |
| ctr-img rm  | -a, --all    | Логический тип, используется для удаления всех образов с локального постоянного хранилища. |
|             | -p, --prune  | Логический тип, используется для удаления всех образов, которые постоянно хранятся на локальном хосте и не имеют тегов. |
**Табл. 4** Параметры команды ctr-img save

| **Команда**  | **Параметр** | **Описание**                                                 |
| ------------ | ------------ | ------------------------------------------------------------ |
| ctr-img save | -o, --output | Строковый тип, локальный путь для сохранения экспортированных образов. |
**Табл. 5** Параметры команды login

| **Команда** | **Параметр**         | **Описание**                                                 |
| ----------- | -------------------- | ------------------------------------------------------------ |
| login       | -p, --password-stdin | Логический тип, определяет метод ввода пароля — считывание через stdin или ввод в диалоговом режиме. |
|             | -u, --username       | Строковый тип, имя пользователя для входа в репозиторий хранения образов. |
**Табл. 6** Параметры команды logout

| **Команда** | **Параметр** | **Описание**                                                 |
| ----------- | ------------ | ------------------------------------------------------------ |
| logout      | -a, --all    | Логический тип, устанавливает необходимость выхода из всех репозиториев хранения образов, на которые был выполнен вход. |
### Матрица взаимодействия

Процессы компонентов isula-build взаимодействуют друг с другом через файл сокета Unix. Порты для связи не используются.

### Разрешение на работу с файлами

- Все операции в isula-build должны выполняться пользователем с правами root. Чтобы выполнять операции от имени непривилегированного пользователя, необходимо настроить параметр 
  --group.

- В следующей таблице перечислены разрешения на доступ к файлам, участвующим в работе инструмента isula-build.

| **Путь к файлу**                                           | **Разрешение на файл/папку** | **Описание**                                                 |
| ---------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| /usr/bin/isula-build                                       | 551                          | Бинарный файл инструмента командной строки.                  |
| /usr/bin/isula-builder                                     | 550                          | Бинарный файл процесса isula-builder на сервере.             |
| /usr/lib/systemd/system/isula-build.service                | 640                          | конфигурационный файл systemd, который используется для управления службой isula-build. |
| /usr/isula-build                                           | 650                          | Корневой каталог конфигурационного файла isula-builder.      |
| /etc/isula-build/configuration.toml                        | 600                          | Общий конфигурационный файл isula-builder, который используется для настройки уровня журнала, каталога с атрибутом постоянства (persistency), каталога среды выполнения и среды выполнения OCI. |
| /etc/isula-build/policy.json                               | 600                          | Файл синтаксиса файла политики проверки подписей.            |
| /etc/isula-build/registries.toml                           | 600                          | Конфигурационный файл каждого репозитория образа, в том числе доступный список репозиториев образов и черный список репозиториев образов. |
| /etc/isula-build/storage.toml                              | 600                          | Конфигурационный файл для локального хранения атрибутов постоянства, включая конфигурацию используемого драйвера хранилища. |
| /etc/isula-build/isula-build.pub                           | 444                          | Файл открытого ключа асимметричного шифрования.              |
| /var/run/isula\_build.sock                                 | 660                          | Локальный сокет isula-builder.                               |
| /var/lib/isula-build                                       | 700                          | Локальный каталог для хранения атрибутов постоянства.        |
| /var/run/isula-build                                       | 700                          | Локальный каталог среды выполнения.                          |
| /var/lib/isula-build/tmp/\[buildid]/isula-build-tmp-\*.tar | 644                          | Локальный каталог для временного хранения образов во время их экспорта в iSulad. |