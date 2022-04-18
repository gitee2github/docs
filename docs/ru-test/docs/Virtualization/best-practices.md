# Передовые методы

\[\[toc]]

## Передовые методы контроля производительности

### Опрос в режиме ожидания

#### Обзор

Если вычислительных ресурсов достаточно, функция опроса в режиме ожидания применяется в целях доведения производительности виртуальных машин до уровня физических машин. Если функция опроса в режиме ожидания не включена, то когда виртуальный процессор (vCPU) завершает работу по причине таймаута ожидания, хост выделяет ресурсы физического процессора другим процессам. Если данная функция включена на хосте, vCPU виртуальной машины, перейдя в режим ожидания, выполняет опрос. Продолжительность опроса зависит от фактической конфигурации. Перейдя в активное состояние во время опроса, vCPU может продолжить работу без планирования с хоста. Это уменьшает потребление ресурсов на планирование и улучшает производительность системы виртуальной машины.

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:  
Механизм опроса в режиме ожидания гарантирует своевременный отклик потока vCPU виртуальной машины. Однако в отсутствии нагрузки виртуальной машины хост также выполняет опрос. В результате, хост обнаруживает большое потребление физических ресурсов процессора данного vCPU, но фактическая загрузка процессора ВМ не высокая.

#### Инструкции

Функция опроса в режиме ожидания включена по умолчанию. Можно динамически изменить время опроса в режиме ожидания vCPU, внеся изменения в файл **halt\_poll\_ns**. Значение по умолчанию — **500000** (нс).

Например, чтобы задать длительности опроса значение 400 000 нс, необходимо выполнить следующую команду:

```
# echo 400000 > /sys/module/kvm/parameters/halt_poll_ns
```

### Настройка атрибутов потока ввода-вывода

#### Обзор

По умолчанию главные потоки QEMU обрабатывают операции чтения и записи виртуальной машины на стороне сервера в KVM. Это вызывает следующие проблемы:

- Запросы ввода-вывода ВМ обрабатываются главным потоком QEMU. Таким образом, однопоточные процессоры становятся узким местом производительности операций ввода-вывода в виртуальной машине.
- Поэтому когда запросы ввода-вывода в ВМ обрабатываются главным потоком QEMU, применяется глобальная блокировка QEMU (qemu\_global\_mutex). Продолжительное время обработки операций ввода-вывода увеличивает длительность использования глобальной блокировки главным потоком QEMU. В результате, невозможно оптимально запланировать ресурсы vCPU виртуальной машины, что влияет на ее общую производительность и отражается на пользовательском опыте.

Пользователь может сконфигурировать атрибут потока ввода-вывода для диска virtio-blk или контроллера virtio-scsi. На серверной стороне QEMU поток ввода-вывода используется для обработки запросов на чтение и запись виртуального диска. Взаимно-однозначное соответствие, установленное между потоком ввода-вывода и диском virtio-blk или контроллером virtio-scsi, сведет к минимуму воздействие на главный поток QEMU, повысит общую производительность ввода-вывода виртуальной машины и улучшит пользовательский опыт.

#### Описание конфигурации

Чтобы использовать потоки ввода-вывода для обработки запросов на чтение и запись дисков виртуальной машины, необходимо изменить конфигурацию ВМ следующим образом:

- Настройте общее количество высокопроизводительных виртуальных дисков в виртуальной машине. Например, для изменения общего количества потоков ввода-вывода задайте параметру **\<iothreads>** значение **4**.
  
  ```
  <domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>   
       <name>VMName</name>
       <memory>4194304</memory>
       <currentMemory>4194304</currentMemory>
       <vcpu>4</vcpu>
       <iothreads>4</iothreads>
  ```

- Настройте атрибут потока ввода-вывода для диска virtio-blk.  **\<iothread>** отражает идентификаторы потоков ввода-вывода. Значения идентификаторов начинаются с 1, и каждый идентификатор должен быть уникальным. Максимальное значение идентификатора и есть значение параметра **\<iothreads>**. Например, для распределения потока ввода-вывода 2 на диск virtio-blk установите параметры следующим образом:
  
  ```
  <disk type='file' device='disk'>
        <driver name='qemu' type='raw' cache='none' io='native' iothread='2'/>
        <source file='/path/test.raw'/>
        <target dev='vdb' bus='virtio'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x05' function='0x0'/>
  </disk>
  ```

- Настройте атрибут потока ввода-вывода для контроллера virtio-scsi. Например, для распределения потока ввода-вывода 2 на контроллер virtio-scsi установите параметры следующим образом:
  
  ```
  <controller type='scsi' index='0' model='virtio-scsi'>
        <driver iothread='2'/>
        <alias name='scsi0'/>
        <address type='pci' domain='0x0000' bus='0x00' slot='0x04' function='0x0'/>
  </controller>
  ```

- Привяжите потоки ввода-вывода к физическому процессору.
  
  Привязка потоков ввода-вывода к указанным физическим процессорам не отражается на загрузке ресурсов потоков vCPU.  Параметр **\<iothread>** задает идентификаторы потоков ввода-вывода, параметр **\<cpuset>** задает идентификаторы привязанных физических процессоров.
  
  ```
  <cputune>
  <iothreadpin iothread='1' cpuset='1-3,5,7-12' />
  <iothreadpin iothread='2' cpuset='1-3,5,7-12' />
  </cputune>
  ```

### Raw Device Mapping

#### Обзор

При настройке устройств хранения виртуальной машины можно использовать конфигурационные файлы. Таким образом настраиваются виртуальные диски для ВМ, или к виртуальным машинам подключаются блочные устройства (например, физические LUNы ​и LV) для повышения производительности хранилища. Последний метод настройки называется прямым доступом виртуальной машины к конкретному LUN устройства хранения (Raw Device Mapping; RDM). С помощью механизма RDM виртуальный диск предоставляется виртуальной машине в качестве устройства с интерфейсом физического подключения и передачи данных между компьютерами и периферийными устройствами (SCSI) и поддерживает большинство команд SCSI.

В зависимости от реализации на серверной стороне, выделяются два типа RDM-диска: виртуальный диск RDM и физический диск RDM. По сравнению с виртуальным RDM, физический RDM более производителен и поддерживает больше команд SCSI. Однако чтобы использовать физический RDM, весь диск SCSI необходимо смонтировать в виртуальную машину. Если во время настройки выделяются разделы или логические тома, виртуальная машина не сможет идентифицировать данный диск.

#### Пример настройки

Для RDM необходимо изменить конфигурационные файлы виртуальной машины. Пример выполнения команды:

- Виртуальный диск RDM
  
  Далее приведен пример монтирования диска SCSI **/dev/sdc** на хосте для предоставления его виртуальной машине в качестве виртуального неформатированного устройства:
  
  ```
  <domain type='kvm'>
   <devices>
      ...
      <controller type='scsi' model='virtio-scsi' index='0'/>
      <disk type='block' device='disk'>
          <driver name='qemu' type='raw' cache='none' io='native'/>
          <source dev='/dev/sdc'/>
          <target dev='sdc' bus='scsi'/>
          <address type='drive' controller='0' bus='0' target='0' unit='0'/>
      </disk>
      ...
   </devices>
  </domain>
  ```

- Физический диск RDM
  
  Далее приведен пример монтирования диска SCSI **/dev/sdc** на хосте для предоставления его виртуальной машине в качестве физического неформатированного устройства:
  
  ```
  <domain type='kvm'>
   <devices>
      ...
      <controller type='scsi' model='virtio-scsi' index='0'/>
      <disk type='block' device='lun' rawio='yes'>
          <driver name='qemu' type='raw' cache='none' io='native'/>
          <source dev='/dev/sdc'/>
          <target dev='sdc' bus='scsi'/>
          <address type='drive' controller='0' bus='0' target='0' unit='0'/>
      </disk>
      ...
   </devices>
  </domain>
  ```

### Изоляция и привязка процесса kworker

#### Обзор

Процесс kworker представляет собой поток для каждого отдельного процессора, реализованный ядром Linux. Он используется для выполнения запросов на рабочую очередь в системе. Потоки kworker конкурируют за ресурсы физического ядра с потоками vCPU, что приводит к нестабильной производительности виртуализированных служб. Чтобы обеспечить стабильную работу виртуальной машины и уменьшить в ней помехи от потоков kworker, можно привязать потоки kworker на хосте к определенному CPU.

#### Инструкции

Внесите изменения в файл **/sys/devices/virtual/workqueue/cpumask,** чтобы привязать задачи в рабочей очереди к процессору, заданному параметром **cpumasks**. Маски в параметре **cpumask** указываются в шестнадцатеричном формате. Например, если необходимо привязать поток kworker к процессорам CPU0–CPU7, выполните следующую команду, чтобы изменить маску на **ff**:

```
# echo ff > /sys/devices/virtual/workqueue/cpumask
```

### Подкачка памяти методом HugePage

#### Обзор

Помимо традиционного метода подкачки виртуальной памяти размером 4 КБ openEuler также поддерживает подкачку 2 МБ и 1 ГБ. Подкачка памяти методом больших страниц (HugePage) эффективно уменьшает частоту промахов попадания в буфер ассоциативной трансляции (TLB) и значительно повышает производительность сервисов, для работы которых требуется большой объем памяти. Для реализации подкачки памяти методом HugePage openEuler применяет две технологии.

- Технология статической подкачки HugePages
  
  В данном варианте перед загрузкой ОС хоста выделяется статический пул HugePage. При создании виртуальной машины необходимо изменить конфигурационный файл XML, указав, что память виртуальной машины выделяется из статического пула HugePage. Статический пул HugePage гарантирует, что вся память виртуальной машины будет представлена на хосте в виде сегментов HugePage для обеспечения неразрывности с физическими ресурсами. Однако это усложняет развертывание. После изменения размера страницы статического пула HugePage необходимо перезапустить хост, чтобы изменение вступило в силу. Размер статического пула HugePage может составлять 2 МБ или 1 ГБ.

- THP
  
  В условиях включенного режима «прозрачные страницы HugePage» (THP) машина автоматически выбирает доступные последовательно идущие страницы размером 2 МБ и автоматически разделяет и объединяет страницы HugePages при выделении сегментов памяти. Если нет доступных последовательно идущих страниц размером 2 МБ, виртуальная машина выбирает доступные страницы размером 64 КБ (архитектура AArch64) или 4 КБ (архитектура x86\_64) для выделения памяти. Пользователям не виден процесс THP, поэтому они просто используют метод подкачки HugePages с размером страниц 2 МБ, повышая скорость доступа к памяти.

Если в виртуальных машинах используются статические пулы HugePages, можно отключить функцию THP для уменьшения потребления ресурсов и обеспечения стабильной производительности виртуальной машины.

#### Инструкции

- Настройте статический пул HugePages.
  
  Перед созданием виртуальной машины внесите в конфигурационный файл XML настройки статического пула HugePage для виртуальной машины.
  
  ```
    <memoryBacking>
      <hugepages>
        <page size='1' unit='GiB'/>
      </hugepages>
    </memoryBacking>
  ```
  
  В приведенном выше примере содержимого XML-файла для виртуальной машины сконфигурирован статический пул HugePage размером 1 ГБ.
  
  ```
    <memoryBacking>
      <hugepages>
        <page size='2' unit='MiB'/>
      </hugepages>
    </memoryBacking>
  ```
  
  В приведенном выше примере содержимого XML-файла для виртуальной машины сконфигурирован статический пул HugePage размером 2 МБ.

- Настройте прозрачные страницы HugePage.
  
  Динамически включите THP через sysfs.
  
  ```
  # echo always > /sys/kernel/mm/transparent_hugepage/enabled
  ```
  
  Динамически отключите THP.
  
  ```
  # echo never > /sys/kernel/mm/transparent_hugepage/enabled
  ```

### PV-qspinlock

#### Обзор

PV-qspinlock оптимизирует процесс спин-блокировки (spin lock) в виртуальном сценарии избыточного выделения процессорных ресурсов. С помощью данной функции гипервизор переключает виртуальный процессор в контексте блокировки в заблокированное состояние и активирует соответствующий vCPU после освобождения объекта блокировки. Таким образом, повышается эффективность использования ресурсов физического процессора в сценарии избыточного выделения ресурсов и сокращается продолжительность процесса компиляции.

#### Процедура

Измените конфигурационный файл **/boot/efi/EFI/openEuler/grub.cfg** виртуальной машины, добавьте **arm\_pvspin** к параметру запуска в командной строке и перезапустите виртуальную машину, чтобы изменение вступило в силу. После вступления в силу настроек PV-qspinlock выполните команду **dmesg** на виртуальной машине. На экране появится следующая информация:

```
[    0.000000] arm-pv: PV qspinlocks enabled
```

> ![](./public_sys-resources/icon-note.gif) **Примечание:**  
Функция PV-qspinlock поддерживается только тогда, когда и на хост-машине, и на виртуальной машине используются операционные системы версии openEuler 21.03 или более поздней версии, а параметру компиляции ядра ВМ CONFIG\_PARAVIRT\_SPINLOCKS присвоено значение y (значение по умолчанию для openEuler).

### Guest-Idle-Haltpoll

#### Обзор

В целях обеспечения равнодоступности ресурсов и снижения энергопотребления, виртуальная машина в условиях бездействия vCPU выполняет команду WFx/HLT для выхода на хост-компьютер и запускает переключение контекста. Хост принимает решение — планировать другие процессы или виртуальные процессоры на физическом процессоре или перейти в режим энергосбережения. Однако затраты ресурсов на переключение между виртуальной машиной и хостом, дополнительное переключение контекста и активизация IPI относительно высоки, и эта проблема особенно заметна в работе служб, в которых состояние бездействия часто меняется на активное. Принцип работы технологии Guest-Idle-Haltpoll заключается в том, что бездействие vCPU виртуальной машины не приводит к немедленному выполнению команды WFx/HLT, и происходит завершение сеанса виртуальной машины. Вместо этого на виртуальной машине в течение определенного периода времени проводится опрос. В этот период задачи остальных виртуальных процессоров, которые используют общий ресурс LLC в данном vCPU, активизируются без отправки команд прерываний IPI. Это уменьшает затраты ресурсов на отправку и получение команд прерываний IPI, а также ресурсы на завершение сеанса виртуальной машины, тем самым снижая задержку на активизацию задачи.

> ![](public_sys-resources/icon-note.gif) **Примечание:** 
> Выполнение команды idle-haltpoll виртуальным процессором на ВМ требует дополнительных ресурсов виртуального процессора на хост-машине. Поэтому рекомендуется, чтобы при включенной данной функции виртуальный процессор занимал только физические ядра на хост-машине.

#### Процедура

Функция Guest-Idle-Haltpoll отключена по умолчанию. Далее описывается процедура включения данной функции.

1. Включение функции Guest-Idle-Haltpoll.
   
   - Если на хост-машине используется процессорная архитектура x86, для включения этой функции можно настроить в файле XML виртуальной машины специальные подсказки. Таким образом, статус, сообщающий о том, что vCPU занимает ресурсы только физического ядра, будет передаваться виртуальной машине через конфигурацию XML виртуальной машины. Хост-машина в этом случае будет следить, чтобы vCPU занимал ресурсы только физического ядра.
     
     ```
     <domain type='kvm'>
      ...
      <features>
        <kvm>
          ...
          <hint-dedicated state='on'/>
        </kvm>
      </features>
       ...
     </domain>
     ```
     
     Альтернативный способ принудительного включения функции: установите параметру cpuidle\_haltpoll.force значение Y в наборе параметров запуска ядра в виртуальной машине. В этом способе не требуется настройка на хост-машине условия занятия виртуальным процессором ресурсов только физического ядра.
     
     ```
     cpuidle_haltpoll.force=Y
     ```
   
   - Если на хост-машине используется процессорная архитектура AArch64, эту функцию можно включить только путем настройки cpuidle\_haltpoll.force=Y haltpoll.enable=Y в наборе параметров запуска ядра в виртуальной машине.
     
     ```
     cpuidle_haltpoll.force=Y haltpoll.enable=Y
     ```

2. Убедитесь, что функция Guest-Idle-Haltpoll вступила в силу. Выполните на виртуальной машине следующую команду. Если возвращается haltpoll, функция вступила в силу.
   
   ```
   # cat /sys/devices/system/cpu/cpuidle/current_driver
   ```

3. (Опционально) Настройка параметра Guest-Idle-Haltpoll.
   
   Следующие конфигурационные файлы содержатся в каталоге /sys/module/haltpoll/parameters/ виртуальной машины. Параметры конфигурации настраиваются с учетом сервисов.
   
   - guest\_halt\_poll\_ns: глобальный параметр, который определяет максимальную продолжительность опроса освобождения ресурсов виртуального процессора. Значение по умолчанию — 200000 (единица измерения: нс).
   - guest\_halt\_poll\_shrink:  делитель, который используется для уменьшения текущей продолжительности guest\_halt\_poll\_ns виртуального процессора, если событие активизации происходит по прошествии глобального периода guest\_halt\_poll\_ns. Значение по умолчанию — 2.
   - guest\_halt\_poll\_grow:  множитель, который используется для увеличения текущей продолжительности guest\_halt\_poll\_ns виртуального процессора, если событие активизации происходит между текущим периодом guest\_halt\_poll\_ns виртуального процессора и глобальным периодом guest\_halt\_poll\_ns. Значение по умолчанию — 2.
   - guest\_halt\_poll\_grow\_start: при переходе системы в состояние бездействия период guest\_halt\_poll\_ns каждого vCPU становится равным 0. Этот параметр, используемый для установки первоначального значения текущего периода guest\_halt\_poll\_ns виртуального процессора, позволяет уменьшать и увеличивать продолжительность опроса vCPU. Значение по умолчанию — 50000 (единица измерения: нс).
   - guest\_halt\_poll\_allow\_shrink: переключатель, который используется для включения функции уменьшения периода guest\_halt\_poll\_ns виртуального процессора. Значение по умолчанию — Y (Y означает, что функция уменьшения периода включена; N — функция отключена).
   
   Чтобы изменить значения параметров, выполните следующую команду как пользователь **root**. В данной команде *value* — это значение параметра, которое необходимо установить, а *configFile* — соответствующий конфигурационный файл.
   
   ```
   # echo value > /sys/module/haltpoll/parameters/configFile
   ```
   
   Например, чтобы задать глобального периоду guest\_halt\_poll\_ns значение 200000 нс, необходимо выполнить следующую команду:
   
   ```
   # echo 200000 > /sys/module/haltpoll/parameters/guest_halt_poll_ns
   ```

## Передовые методы обеспечения безопасности

### Аутентификация libvirt

#### Обзор

Если пользователь прибегает к удаленному вызову службы libvirt без аутентификации, любая сторонняя программа, подключающаяся к сети хоста, может управлять виртуальными машинами через данный механизм. Такой подход представляет собой риск для безопасности. Для повышения безопасности системы openEuler предоставляет функцию аутентификации libvirt. То есть пользователи могут удаленно вызывать виртуальную машину через службу libvirt только после прохождения процедуры проверки подлинности идентификационных данных. Доступ к виртуальной машине могут получить только определенные пользователи, тем самым обеспечивается защита виртуальных машин в сети.

#### Включение функции аутентификации libvirt

По умолчанию функция удаленного вызова службы libvirt отключена на openEuler. Далее представлена процедура включения функции удаленного вызова и аутентификации службы libvirt.

1. Войдите в хост.

2. Измените конфигурационный файл службы libvirt **/etc/libvirt/libvirtd.conf**, включив функции удаленного вызова libvirt и аутентификации libvirt. Например, для включения удаленного вызова TCP на основе каркаса для добавления функций аутентификации и защиты данных в протоколы на основе соединений ( Simple Authentication and Security Layer; SASL) настройте параметры, ориентируясь на следующий пример:
   
   ```
   #Transport layer security protocol. The value 0 indicates that the protocol is disabled, and the value 1 indicates that the protocol is enabled. You can set the value as needed.
   listen_tls = 0
   #Enable the TCP remote invocation. To enable the libvirt remote invocation and libvirt authentication functions, set the value to 1.
   listen_tcp = 1
   #User-defined protocol configuration for TCP remote invocation. The following uses sasl as an example.
   auth_tcp = "sasl" 
   ```

3. Измените конфигурационный файл **/etc/sasl2/libvirt.conf**, внеся в него настройки механизма SASL и SASLDB.
   
   ```
   #Authentication mechanism of the SASL framework.
   mech_list: digest-md5
   #Database for storing usernames and passwords
   sasldb_path: /etc/libvirt/passwd.db
   ```

4. Добавьте пользователя для прохождения аутентификации SASL и установите пароль. Для примера использовано имя пользователя **userName**. Команда выглядит следующим образом:
   
   ```
   # saslpasswd2 -a libvirt userName
   Password:
   Again (for verification):
   ```

5. Измените конфигурационный файл **/etc/sysconfig/libvirtd**, включив функцию прослушивания libvirt.
   
   ```
   LIBVIRTD_ARGS="--listen"
   ```

6. Перезапустите службу libvirtd, чтобы изменение вступило в силу.
   
   ```
   # systemctl restart libvirtd
   ```

7. Убедитесь, что функция аутентификации для удаленного вызова службы libvirt работает. Введите имя пользователя и пароль, следуя подсказкам. Если служба libvirt подключена, значит, функция успешно включена.
   
   ```
   # virsh -c qemu+tcp://192.168.0.1/system
   Please enter your authentication name: openeuler
   Please enter your password:
   Welcome to virsh, the virtualization interactive terminal.
   
   Type:  'help' for help with commands
          'quit' to quit
   
   virsh #
   ```

#### Управление SASL

Далее описывается процедура управления пользователями SASL.

- Запросите существующего пользователя из базы данных.
  
  ```
  # sasldblistusers2 -f /etc/libvirt/passwd.db
  user@localhost.localdomain: userPassword
  ```

- Удалите пользователя из базы данных.
  
  ```
  # saslpasswd2 -a libvirt -d user
  ```

### qemu-ga

#### Обзор

Гостевой агент QEMU (qemu-ga) представляет собой демон, работающий в виртуальных машинах. Агент позволяет пользователям ОС хоста выполнять различные операции управления в гостевой операционной системе через внеполосные каналы, предоставляемые QEMU. Это операции с файлами (открытие, чтение, запись, закрытие, поиск и сброс на диск), внутреннее завершение работы, приостановка работы виртуальной машины (suspend-disk, suspend-ram, suspend-hybrid) и получение внутренней информации ВМ (включая информацию о памяти, процессоре, карте NIC и ОС).

В некоторых сценариях с высокими требованиями к безопасности агент qemu-ga предоставляет функцию черного списка, которая предотвращает утечку внутренней информации с виртуальных машин. Черный список можно использовать для избирательной защиты некоторых функций, предоставляемых агентом qemu-ga.

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:  
Пакет установки агента qemu-ga: **qemu-guest-agent-**_xx_**.rpm**. По умолчанию он не установлен на openEuler.  x.x.x означает номер версии.

#### Процедура

Чтобы добавить черный список агента qemu-ga, выполните следующие шаги:

1. Войдите в виртуальную машину и убедитесь, что служба qemu-guest-agent существует и работает.
   
   ```
   # systemctl status qemu-guest-agent |grep Active
      Active: active (running) since Wed 2018-03-28 08:17:33 CST; 9h ago
   ```

2. Запросите список команд **qemu-ga**, которые можно добавить в черный список:
   
   ```
   # qemu-ga --blacklist ?
   guest-sync-delimited
   guest-sync
   guest-ping
   guest-get-time
   guest-set-time
   guest-info
   ...
   ```

3. Сформируйте черный список. Добавьте команды, которые необходимо скрыть в списке 
   **--blacklist,** в файл **/usr/lib/systemd/system/qemu-guest-agent.service**. Для разделения команд используются пробелы. Например, чтобы добавить команды **guest-file-open** и **guest-file-close** в черный список, внесите изменения в файл настройки, ориентируясь на следующий пример:
   
   ```
   [Service]
   ExecStart=-/usr/bin/qemu-ga \
         --blacklist=guest-file-open guest-file-close
   ```

4. Перезапустите службу qemu-guest-agent.
   
   ```
   # systemctl daemon-reload
   # systemctl restart qemu-guest-agent
   ```


5. Убедитесь, что функция черного списка агента qemu-ga вступила в силу на данной виртуальной машине, то есть параметр **--blacklist** корректно сконфигурирован для процесса qemu-ga.
   
   ```
   # ps -ef|grep qemu-ga|grep -E "blacklist=|b="
   root       727     1  0 08:17 ?        00:00:00 /usr/bin/qemu-ga --method=virtio-serial --path=/dev/virtio-ports/org.qemu.guest_agent.0 --blacklist=guest-file-open guest-file-close guest-file-read guest-file-write guest-file-seek guest-file-flush -F/etc/qemu-ga/fsfreeze-hook
   ```


   > ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:  
Для получения дополнительной информации об агенте qemu-ga перейдите на страницу [https://wiki.qemu.org/Features/GuestAgent](https://wiki.qemu.org/Features/GuestAgent).

### Защита sVirt

#### Обзор

В среде виртуализации, которая использует только лишь политику избирательного контроля доступа (Discretionary Access Control; DAC), работающие на хостах вредоносные виртуальные машины могут атаковать гипервизор или другие виртуальные машины. Чтобы повысить безопасность в сценариях виртуализации, openEuler использует технологию защиты sVirt, основанную на SELinux. Технология применяется в сценариях виртуализации KVM. Виртуальная машина рассматривается в операционной системе хоста как общий процесс. В гипервизоре механизм sVirt помечает процессы QEMU, связанные с соответствующими виртуальными машинами, специальными метками SELinux. Помимо различных типов файлов и процессов виртуализации, для маркировки виртуальных машин используются категории. Каждая виртуальная машина может получить доступ только к файлам одной категории. Эта мера не допускает доступ к файлам и устройствам на неразрешенных хостах или других виртуальных машинах, тем самым предотвращает аварийное завершение работы виртуальной машины и повышает безопасность хоста и ВМ.

#### Включение защиты sVirt

1. Включите SELinux на хосте.

   1. Войдите в хост.

   2. Включите функцию SELinux на хосте.
      
      1. Измените в файле **grub.cfg** параметр запуска системы **selinux**, задав значение **1**.
      
         ```
         selinux=1
         ```
      
      2. В файле **/etc/selinux/config** задайте параметру **SELINUX** значение **enforcing**.
      
         ```
         SELINUX=enforcing
         ```
      
   3. Перезапустите хост.

      ```
      # reboot
      ```

      

2. Создайте виртуальную машину, в которой включена функция sVirt.
   
   1. Добавьте следующую информацию в конфигурационный файл виртуальной машины:
      
      ```
      <seclabel type='dynamic' model='selinux' relabel='yes'/>
      ```
      
      Или удостоверьтесь, что в данном файле настроена следующая конфигурация:
      
      ```
      <seclabel type='none' model='selinux'/>
      ```
   
   2. Создайте виртуальную машину:
      
      ```
      # virsh define openEulerVM.xml
      ```

3. Убедитесь, что функция sVirt включена.
   
   Выполните следующую команду, чтобы убедиться, что защита sVirt для процесса QEMU текущей виртуальной машины включена. Наличие информации **svirt\_t:s0:c** свидетельствует о том, что защита sVirt включена.
   
   ```
   # ps -eZ|grep qemu |grep "svirt_t:s0:c"
   system_u:system_r:svirt_t:s0:c200,c947 11359 ? 00:03:59 qemu-kvm
   system_u:system_r:svirt_t:s0:c427,c670 13790 ? 19:02:07 qemu-kvm
   ```

### Доверенная загрузка виртуальной машины

#### Обзор

Доверенная загрузка (Trusted Boot) включает в себя измеренную загрузку и удаленную аттестацию. Функцию измеренной загрузки, в основном, предоставляет компонент виртуализации. Функцию удаленной аттестации активируют пользователи, которые устанавливают соответствующее программное обеспечение (клиент RA) на виртуальных машинах и настраивают RA-сервер.

В измеренной загрузке используются два базовых элемента: корень доверия (Root of Trust; RoT) и цепочка доверия (Chain of Trust). Основная идея заключается в установке RoT в компьютерной системе. RoT обеспечивает надежность в плане физической безопасности, технической безопасности и безопасности управления, т.е. реализует концепцию базового корня доверия для измерений (Core Root of Trust for Measurement; CRTM). Устанавливаемая цепочка доверия включает RoT, BIOS/BootLoader, операционную систему, приложения. Измеренная загрузка и доверенная загрузка выполняются на уровне выше предыдущего. Наконец, доверие применяется ко всей системе. Вышеописанный процесс выглядит как цепочка мер, поэтому называется цепочкой доверия.

CRTM представляет собой корень измеренной загрузки и первый компонент в запуске системы. Другие коды не используются для проверки целостности CRTM. Поэтому, являясь отправной точкой цепочки доверия, CRTM должен быть абсолютно надежным источником доверия. В целях защиты от атак на BIOS и предотвращения удаленного внедрения вредоносного кода или модификации кода запуска на верхнем уровне операционной системы CRTM должен быть технически спроектирован как сегмент кода, предназначенный только для чтения, или как строго ограниченный код. На физическом хосте в качестве CRTM используется микрокод процессора. В среде виртуализации роль CRTM выполняет второстепенное ПО vBIOS.

Во время запуска предыдущий компонент измеряет следующий компонент (вычисляет хеш-значение), а затем переносит измеренное значение в доверенную область памяти, например в регистр PCR TPM. BootLoader переносит в регистр PCR измеренное значение CRTM, а ОС переносит в регистр PCR измеренное значение BootLoader.

#### Настройка устройства vTPM для включения функции измеренной загрузки

**Установка программного обеспечения swtpm и libtpms**

swtpm представляет собой эмулятор TPM (TPM 1.2 и TPM 2.0), который можно интегрировать в среду виртуализации. К настоящему времени эмулятор интегрирован в QEMU и служит в качестве прототипа системы в RunC. Функции эмуляции TPM1.2 и TPM2.0 swtpm предоставляет с помощью libtpms. На текущий момент openEuler 21.03 предоставляет источники libtpms и swtpm. Их установка выполняется командой yum.

```
# yum install libtpms swtpm swtpm-devel swtpm-tools

```

**Настройка устройства vTPM для виртуальной машины**

1. Добавьте следующую информацию в конфигурационный файл виртуальной машины с архитектурой AArch64:
   
   ```
   <domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
       ...
       <devices>
           ...
           <tpm model='tpm-tis-device'>
               <backend type='emulator' version='2.0'/>
           </tpm>
           ...
       </devices>
       ...
   </domain>
   ```
   
   Добавьте следующую информацию в конфигурационный файл виртуальной машины с архитектурой x86:
   
   ```
   <domain type='kvm' xmlns:qemu='http://libvirt.org/schemas/domain/qemu/1.0'>
       ...
       <devices>
           ...
           <tpm model='tpm-tis'>
               <backend type='emulator' version='2.0'/>
           </tpm>
           ...
       </devices>
       ...
   </domain>
   ```

2. Создайте виртуальную машину.
   
   ```
   # virsh define MeasuredBoot.xml
   ```

3. Запустите виртуальную машину.
   
   Перед запуском виртуальной машины выполните команду chmod, чтобы предоставить каталогу /var/lib/swtpm-localca/ следующее разрешение. Иначе служба libvirt не сможет запустить swtpm.
   
   ```
   # chmod -R 777 /var/lib/swtpm-localca/
   #
   # virsh start MeasuredbootVM
   ```

**Подтверждение успешной активации функции измеренной загрузки**

vBIOS определяет и принимает решение, активировать или нет функцию измеренной загрузки. В настоящее время vBIOS в операционной системе openEuler 21.03 имеет функцию измеренной загрузки. Если хост-машина использует компонент edk2 другой версии, убедитесь, что данный компонент поддерживает функцию измеренной загрузки.

Войдите в виртуальную машину как пользователь root и убедитесь, что на виртуальной машине установлены драйвер TPM, стек протоколов tpm2-tss и инструменты tpm2-tools. По умолчанию драйвер tpm (tpm\_tis.ko), стек протоколов tpm2-tss и tpm2-tools установлены в ОС openEuler 21.03. Если используется другая операционная система, проверка драйверов и соответствующих инструментов выполняется следующей командой:

```
# lsmod |grep tpm
# tpm_tis          16384   0
#
# yum list installed | grep -E 'tpm2-tss|tpm2-tools'
#
# yum install tpm2-tss tpm2-tools
```

Чтобы вывести все значения PCR, выполните команду tpm2\_pcrread (tpm2\_pcrlist в tpm2\_tools более ранних версий).

```
# tpm2_pcrread
sha1 :
  0  : fffdcae7cef57d93c5f64d1f9b7f1879275cff55
  1  : 5387ba1d17bba5fdadb77621376250c2396c5413
  2  : b2a83b0ebf2f8374299a5b2bdfc31ea955ad7236
  3  : b2a83b0ebf2f8374299a5b2bdfc31ea955ad7236
  4  : e5d40ace8bb38eb170c61682eb36a3020226d2c0
  5  : 367f6ea79688062a6df5f4737ac17b69cd37fd61
  6  : b2a83b0ebf2f8374299a5b2bdfc31ea955ad7236
  7  : 518bd167271fbb64589c61e43d8c0165861431d8
  8  : af65222affd33ff779780c51fa8077485aca46d9
  9  : 5905ec9fb508b0f30b2abf8787093f16ca608a5a
  10 : 0000000000000000000000000000000000000000
  11 : 0000000000000000000000000000000000000000
  12 : 0000000000000000000000000000000000000000
  13 : 0000000000000000000000000000000000000000
  14 : 0000000000000000000000000000000000000000
  15 : 0000000000000000000000000000000000000000
  16 : 0000000000000000000000000000000000000000
  17 : ffffffffffffffffffffffffffffffffffffffff
  18 : ffffffffffffffffffffffffffffffffffffffff
  19 : ffffffffffffffffffffffffffffffffffffffff
  20 : ffffffffffffffffffffffffffffffffffffffff
  21 : ffffffffffffffffffffffffffffffffffffffff
  22 : ffffffffffffffffffffffffffffffffffffffff
  23 : 0000000000000000000000000000000000000000
sha256 :
  0  : d020873038268904688cfe5b8ccf8b8d84c1a2892fc866847355f86f8066ea2d
  1  : 13cebccdb194dd916f2c0c41ec6832dfb15b41a9eb5229d33a25acb5ebc3f016
  2  : 3d458cfe55cc03ea1f443f1562beec8df51c75e14a9fcf9a7234a13f198e7969
  3  : 3d458cfe55cc03ea1f443f1562beec8df51c75e14a9fcf9a7234a13f198e7969
  4  : 07f9074ccd4513ef1cafd7660f9afede422b679fd8ad99d25c0659eba07cc045
  5  : ba34c80668f84407cd7f498e310cc4ac12ec6ec43ea8c93cebb2a688cf226aff
  6  : 3d458cfe55cc03ea1f443f1562beec8df51c75e14a9fcf9a7234a13f198e7969
  7  : 65caf8dd1e0ea7a6347b635d2b379c93b9a1351edc2afc3ecda700e534eb3068
  8  : f440af381b644231e7322babfd393808e8ebb3a692af57c0b3a5d162a6e2c118
  9  : 54c08c8ba4706273f53f90085592f7b2e4eaafb8d433295b66b78d9754145cfc
  10 : 0000000000000000000000000000000000000000000000000000000000000000
  11 : 0000000000000000000000000000000000000000000000000000000000000000
  12 : 0000000000000000000000000000000000000000000000000000000000000000
  13 : 0000000000000000000000000000000000000000000000000000000000000000
  14 : 0000000000000000000000000000000000000000000000000000000000000000
  15 : 0000000000000000000000000000000000000000000000000000000000000000
  16 : 0000000000000000000000000000000000000000000000000000000000000000
  17 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  18 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  19 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  20 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  21 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  22 : ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
  23 : 0000000000000000000000000000000000000000000000000000000000000000
```