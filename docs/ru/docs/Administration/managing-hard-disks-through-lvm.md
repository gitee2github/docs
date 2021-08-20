# Управление жесткими дисками через диспетчер логических томов (LVM)

<!-- TOC -->

- [Управление жесткими дисками через диспетчер логических томов](#managing-hard-disks-through-lvm)
  - [Общее представление о диспетчере логических томов](#lvm-overview)
    - [Основные условия](#basic-terms)
  - [Установка диспетчера логических томов](#installing-the-lvm)
  - [Управление физическим томом](#managing-pvs)
    - [Создание физического тома](#creating-a-pv)
    - [Просмотр физического тома](#viewing-a-pv)
    - [Изменение атрибутов физического тома](#modifying-pv-attributes)
    - [Удаление физического тома](#deleting-a-pv)
  - [Управление группой томов](#managing-vgs)
    - [Создание группы томов](#creating-a-vg)
    - [Просмотр группы томов](#viewing-a-vg)
    - [Изменение атрибутов группы томов](#modifying-vg-attributes)
    - [Расширение группы томов](#extending-a-vg)
    - [Сжатие группы томов](#shrinking-a-vg)
    - [Удаление группы томов](#deleting-a-vg)
  - [Управление логическим томом](#managing-lvs)
    - [Создание логического тома](#creating-an-lv)
    - [Просмотр логического тома](#viewing-an-lv)
    - [Настройка размера логического тома](#adjusting-the-lv-size)
    - [Расширение логического тома](#extending-an-lv)
    - [Сжатие логического тома](#shrinking-an-lv)
    - [Удаление логического тома](#deleting-an-lv)
  - [Создание и монтирование файловой системы](#creating-and-mounting-a-file-system)
    - [Создание файловой системы](#creating-a-file-system)
    - [Монтирование файловой системы вручную](#manually-mounting-a-file-system)
    - [Автоматическое монтирование файловой системы](#automatically-mounting-a-file-system)

<!-- /TOC -->
## Общее представление о диспетчере логических томов

Диспетчер логических томов (Logical Volume Manager; LVM) — это механизм, используемый для управления разделами дисков в Linux. За счет добавления логического уровня между дисками и файловыми системами LVM маскирует разбиение разделов дисков для файловых систем, тем самым повышая гибкость управления разделами.

Процедура управления диском через LVM выглядит следующим образом:

1. Создайте физические тома для диска.
2. Объедините несколько физических томов в группу томов.
3. Создайте логические тома в группе томов.
4. Создайте файловые системы на логических томах.

Когда диски управляются с помощью LVM, файловые системы распределяются на нескольких дисках, и такое распределение можно легко изменить при необходимости. В этом случае, пространство файловой системы не ограничивается емкостью диска.

### Основные условия

- Физический носитель: физическое устройство хранения в системе, например жесткий диск (**/dev/hda** и **/dev/sda**). Это элемент хранения самого низкого уровня в системе хранения.

- Физический том (Physical volume; PV): раздел диска или устройство (например, массив RAID), выполняющее те же логические функции, что и раздел диска. PV выполняют функции базовых логических блоков хранения для LVM. Физический том имеет специальную метку, которая по умолчанию хранится во втором 512-байтовом секторе. Также метка может храниться в одном из первых четырех секторов. Метка содержит универсальный уникальный идентификатор (Universal Unique Identifier; UUID) физического тома, размер блочного устройства и место хранения метаданных LVM в устройстве.

- Группа томов (Volume Group; VG) состоит из физических томов и маскирует детальную информацию тех томов, которые включены в нее. Можно создать в VG один или несколько логических томов без учета детальной информации физических томов.

- Логический том (Logical Volume; LV). Группу томов нельзя использовать напрямую. Ее можно использовать только после разбиения на логические тома. Логические тома можно форматировать в различных файловых системах и использовать сразу после монтирования.

- Физический блок (Physical Extent; PE) — это небольшой элемент хранения в физическом томе. Размер РЕ совпадает с размером логического блока в группе томов.

- Логический блок (Logical Extent; LE) — это небольшой элемент хранения в логическом томе. В одной группе томов логические блоки всех LV имеют одинаковый размер.

## Установка диспетчера логических томов

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ:**  
По умолчанию LVM установлен в ОС openEuler. Выполните команду **rpm -qa \| grep lvm2**, чтобы убедиться, что диспетчер установлен. Если выходные данные команды содержат «lvm2», значит, диспетчер логических томов установлен. В таком случае пропустите этот раздел. Если данной информации нет в выходных данных, LVM не установлен. Установите его, следуя инструкциям, приведенным в данном разделе.

1. Настройте локальный источник Yum. Для получения подробной информации обратитесь к разделу [Конфигурирование сервера-репозитория](./configuring-the-repo-server.html).

2. Очистите кэш.
   
   ```
   $ dnf clean all
   ```

3. Создайте кэш.
   
   ```
   $ dnf makecache
   ```

4. Как пользователь с правами **root** установите LVM.
   
   ```
   # dnf install lvm2
   ```

5. Проверьте установленный пакет RPM.
   
   ```
   $ rpm -qa | grep lvm2
   ```

## Управление физическим томом

### Создание физического тома

Чтобы создать физический том, выполните команду **pvcreate** как пользователь **root**.

```
pvcreate [option] devname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-f**: команда принудительно создает физический том без подтверждения пользователя.
  - **-u**: задает UUID устройства.
  - **-y**: отвечает «да» на все вопросы.

- *devname*: задает имя устройства, соответствующего создаваемому физическому тому. Если необходимо создать несколько физических томов групповой операцией, введите несколько имен устройств, разделив их пробелами.

Пример 1. Создайте физические тома на основе **/dev/sdb** и **/dev/sdc**.

```
# pvcreate /dev/sdb /dev/sdc
```

Пример 2. Создайте физические тома на основе **/dev/sdb1** и **/dev/sdb2**.

```
# pvcreate /dev/sdb1 /dev/sdb2
```

### Просмотр физического тома

Как пользователь **root** выполните команду **pvdisplay**, чтобы просмотреть информацию о физическом томе, включая имя PV, группу томов, которой принадлежит данный PV, размер PV, размер РЕ, общее количество РЕ, количество доступных РЕ, количество выделенных РЕ и UUID.

```
pvdisplay [option] devname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-s**: команда выводит информацию в кратком виде.
  - **-m**: команда выводит информацию о сопоставлении физических блоков с логическими блоками.

- *devname*: задает имя устройства, соответствующего просматриваемому физическому тому. Если данный параметр не задан, выводится информация обо всех PV.

Пример. Выведите основную информацию о физическом томе **/dev/sdb**, выполнив следующую команду:

```
# pvdisplay /dev/sdb
```

### Изменение атрибутов физического тома

Чтобы изменить атрибуты физического тома, выполните команду **pvchange** как пользователь **root**.

```
pvchange [option] pvname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-u**: команда создает новый UUID.
  - **-x**: устанавливает разрешение на выделение физического блока.

- *pvname*: задает имя устройства, соответствующего изменяемому физическому тому. Если необходимо изменить несколько физических томов групповой операцией, введите несколько имен устройств, разделив их пробелами.

Пример. Чтобы запретить выделение физических блоков на физическом томе **/dev/sdb**, выполните следующую команду.

```
# pvchange -x n /dev/sdb
```

### Удаление физического тома

Чтобы удалить физический том, выполните команду **pvremove** как пользователь **root**.

```
pvremove [option] pvname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-f**: команда принудительно удаляет физический том без подтверждения пользователя.
  - **-y**: отвечает «да» на все вопросы.

- *pvname*: задает имя устройства, соответствующего удаляемому физическому тому. Если необходимо удалить группой несколько физических томов, введите несколько имен устройств, разделив их пробелами.

Пример. Удалите физический том **/dev/sdb**, выполнив следующую команду:

```
# pvremove /dev/sdb
```

## Управление группой томов

### Создание группы томов

Чтобы создать группу томов, выполните команду **vgcreate** как пользователь **root**.

```
vgcreate [option] vgname pvname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-l**: определяет максимальное количество логических томов, которые могут быть созданы в группе томов.
  - **-p**: определяет максимальное количество физических томов, которые могут быть созданы в группе томов.
  - **-s**: определяет размер РЕ физического тома в группе томов.

- *vgname*: имя создаваемой группы томов.

- *pvname*: имя физического тома, добавляемого в группу томов.

Пример. Создайте группу томов **vg1** и добавьте к ней физические тома **/dev/sdb** и **/dev/sdc**, выполнив следующую команду.

```
# vgcreate vg1 /dev/sdb /dev/sdc  
```

### Просмотр группы томов

Чтобы просмотреть информацию о группе томов, выполните команду **vgdisplay** как пользователь **root**.

```
vgdisplay [option] [vgname]
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-s**: команда выводит информацию в кратком виде.
  - **-A**: команда выводит атрибуты только активных групп томов.

- *vgname*: имя просматриваемой группы томов. Если данный параметр не задан, выводится информация обо всех группах томов.

Пример. Выведите основную информацию о группе томов **vg1**, выполнив следующую команду:

```
# vgdisplay vg1
```

### Изменение атрибутов группы томов

Чтобы изменить атрибуты группы томов, выполните команду **vgchange** как пользователь **root**.

```
vgchange [option] vgname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-a**: команда устанавливает активный статус группы томов.

- *vgname*: имя группы томов, атрибуты которой требуется изменить.

Пример. Измените статус **vg1** на активный, выполнив следующую команду.

```
# vgchange -ay vg1
```

### Расширение группы томов

Чтобы расширить группу томов, выполните команду **vgextend** как пользователь **root**. Таким образом, размер группы томов увеличивается путем добавления физических томов к данной группе.

```
vgextend [option] vgname pvname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **dev**: режим отладки.
  - -t: только тестирование.

- *vgname*: имя группы томов, размер которой требуется увеличить.

- *pvname*: имя физического тома, добавляемого в группу томов.

Пример. Добавьте физический том **/dev/sdb** в группу томов **vg1**, выполнив следующую команду:

```
# vgextend vg1 /dev/sdb
```

### Сжатие группы томов

Чтобы удалить физические тома из группы томов и тем самым уменьшить размер группы томов, выполните команду **vgreduce** в качестве пользователя **root**. В группе томов должно быть не менее одного физического тома.

```
vgreduce [option] vgname pvname ...
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-a**: если физические тома не будут указаны в команде, будут удалены все пустые тома.
  - \--**removemissing**: команда удаляет потерянные тома в группе томов для восстановления нормального состояния группы томов.

- *vgname*: имя сжимаемой группы томов.

- *pvname*: имя физического тома, удаляемого из группы томов.

Пример. Удалите физический том **/dev/sdb**2 из группы томов **vg1**, выполнив следующую команду:

```
# vgreduce vg1 /dev/sdb2
```

### Удаление группы томов

Чтобы удалить группу томов, выполните команду **vgremove** как пользователь **root**.

```
vgremove [option] vgname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-f**: команда принудительно удаляет группу томов без подтверждения пользователя.

- *vgname*: имя удаляемой группы томов.

Пример. Удалите группу томов **vg1**, выполнив следующую команду:

```
# vgremove vg1
```

## Управление логическим томом

### Создание логического тома

Чтобы создать логический том, выполните команду **lvcreate** как пользователь **root**.

```
lvcreate [option] vgname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-L**: определяет размер логического тома в kKmMgGtT.
  - **-l**: определяет размер логического тома (число логических блоков)
  - **-n**: имя создаваемого логического тома.
  - **-s**: команда создает мгновенный снимок.

- *vgname*: имя создаваемой группы томов.

Пример 1. Создайте логический том **10 ГБ** в группе томов **vg1**, выполнив следующую команду:

```
# lvcreate -L 10G vg1
```

Пример 2. Создайте логический том **200 МБ** с именем **lv1** в группе томов **vg1**, выполнив следующую команду:

```
# lvcreate -L 200M -n lv1 vg1
```

### Просмотр логического тома

Как пользователь **root** выполните команду **lvdisplay**, чтобы просмотреть информацию о логическом томе, включая размер логического тома, его статус чтения и записи, а также информацию о мгновенном снимке.

```
lvdisplay [option] [lvname]
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:

- **-v**: команда выводит информацию о сопоставлении логических блоков с физическими блоками.

- *lvname*: файл устройства, соответствующий логическому тому, атрибуты которого требуется отобразить. Если этот параметр не будет задан, будут отображены атрибуты всех логических томов.
  
  > ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ:**  
Файлы устройств, соответствующие логическим томам, хранятся в каталоге группы томов. Например, если логический том **lv1** создан в группе томов **vg1**, файлом устройства, который соответствует тому **lv1,** будет **/dev/vg1/lv1**.

Пример. Выведите основную информацию о логическом томе **lv1**, выполнив следующую команду:

```
# lvdisplay /dev/vg1/lv1
```

### Настройка размера логического тома

Чтобы увеличить или уменьшить размер логического тома, выполните команду **lvresize** как пользователь **root**. Это может привести к потере данных. Поэтому соблюдайте осторожность при выполнении этой команды.

```
lvresize [option] vgname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-L**: определяет размер логического тома в kKmMgGtT.
  - **-l**: определяет размер логического тома (число логических блоков)
  - **-f**: команда принудительно регулирует размер логического тома без подтверждения пользователя.

- *lvname*: имя настраиваемого логического тома.

Пример 1. Увеличьте размер логического тома **/dev/vg1/lv1** на 200 МБ, выполнив следующую команду.

```
# lvresize -L +200 /dev/vg1/lv1
```

Пример 2. Уменьшите размер логического тома **/dev/vg1/lv1** на 200 МБ, выполнив следующую команду.

```
# lvresize -L -200 /dev/vg1/lv1
```

### Расширение логического тома

Как пользователь **root** выполните команду **lvextend**, чтобы динамически увеличить размер логического тома в режиме онлайн без прерывания доступа приложений к данному логическому тому.

```
lvextend [option] lvname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-L**: определяет размер логического тома в kKmMgGtT.
  - **-l**: определяет размер логического тома (число логических блоков)
  - **-f**: команда принудительно регулирует размер логического тома без подтверждения пользователя.

- *lvname*: файл устройства логического тома, размер которого требуется увеличить.

Пример. Увеличьте размер логического тома **/dev/vg1/lv1** на 100 МБ, выполнив следующую команду.

```
# lvextend -L +100M /dev/vg1/lv1
```

### Сжатие логического тома

Чтобы уменьшить размер логического тома, выполните команду **lvreduce** как пользователь **root**. Это может привести к удалению существующих на логическом томе данных. Поэтому перед выполнением команды убедитесь, что эти данные можно удалить.

```
lvreduce [option] lvname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-L**: определяет размер логического тома в kKmMgGtT.
  - **-l**: определяет размер логического тома (число логических блоков)
  - **-f**: команда принудительно регулирует размер логического тома без подтверждения пользователя.

- *lvname*: файл устройства логического тома, размер которого требуется увеличить.

Пример. Уменьшите размер логического тома **/dev/vg1/lvl** на 100 МБ, выполнив следующую команду:

```
# lvreduce -L -100M /dev/vg1/lv1
```

### Удаление логического тома

Чтобы удалить логический том, выполните команду **lvremove** как пользователь **root**. Если логический том смонтирован с помощью команды **mount**, необходимо его размонтировать командой **umount** перед выполнением команды **lvremove**.

```
lvremove [option] vgname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-f**: команда принудительно удаляет логический том без подтверждения пользователя.

- *vgname*: имя удаляемого логического тома.

Пример. Удалите логический том ****/dev/vg1/lv1****, выполнив следующую команду:

```
# lvremove /dev/vg1/lv1
```

## Создание и монтирование файловой системы

Создав логический том, необходимо создать на нем файловую систему и смонтировать ее в соответствующий каталог.

### Создание файловой системы

Чтобы создать файловую систему, выполните команду **mkfs** как пользователь **root**.

```
mkfs [option] lvname
```

Параметры команды:

- *option*: варианты выбора параметров команды. Стандартные параметры:
  
  - **-t**: команда определяет тип создаваемой системы Linux, например **ext2**, **ext3** и **ext4**. Тип по умолчанию — **ext2**.

- *lvname*: имя файла устройства логического тома, соответствующего создаваемой файловой системе.

Пример. Создайте файловую систему **ext4** в логическом томе **/dev/vg1/lv1**, выполнив следующую команду:

```
# mkfs -t ext4 /dev/vg1/lv1
```

### Монтирование файловой системы вручную

Вручную смонтированная файловая система не создается на постоянной основе. После перезапуска ОС она удаляется.

Чтобы смонтировать файловую систему, выполните команду **mount** как пользователь **root**.

```
mount lvname mntpath
```

Параметры команды:

- *lvname*: имя файла устройства логического тома, соответствующего монтируемой файловой системе.
- *mntpath*: путь монтирования.

Пример. Смонтируйте логический том **/dev/vg1/lv1** в каталог **/mnt/data**, выполнив следующую команду:

```
# mount /dev/vg1/lv1 /mnt/data
```

### Автоматическое монтирование файловой системы

После перезапуска ОС автоматически смонтированная файловая система удаляется. Необходимо вручную повторно ее смонтировать. Выполнение следующих шагов как пользователь **root** после ручного монтирования файловой системы обеспечит автоматическое монтирование файловой системы в случае перезапуска ОС.

1. <a name="li65701520154311"></a>Запросите UUID логического тома, выполнив команду **blkid**. Логический том **/dev/vg1/lv1** приведен в качестве примера:
   
   ```
   # blkid /dev/vg1/lv1
   ```
   
   Проверьте выходные данные команды. Данные содержат следующую информацию, в которой строка цифр *uuidnumber* означает UUID, а *fstype* означает тип файловой системы.
   
   /dev/vg1/lv1: UUID="  _uuidnumber_  " TYPE="  _fstype_  "

2. Выполните команду **vi /etc/fstab**, чтобы отредактировать файл **fstab,** и добавьте в конец файла следующее содержимое:
   
   ```
   UUID=uuidnumber  mntpath                   fstype    defaults        0 0
   ```
   
   Параметры команды:
   
   - Столбец 1: UUID. Введите значение *uidnumber*, полученное на шаге 1.
   - Столбец 2: задает каталог монтирования файловой системы. Замените *mntpath* фактическим значением.
   - Столбец 3: формат файловой системы. Введите значение *fstype*, полученное на шаге 1.
   - Столбец 4: параметр монтирования. В этом примере используется значение **defaults**.
   - Столбец 5: параметр резервирования. Введите **1** (система автоматически делает резервную копию файловой системы) или **0** (система не делает резервную копию файловой системы). В этом примере используется значение **0**.
   - Столбец 6: параметр сканирования. Введите **1** (система автоматически сканирует файловую систему во время запуска) или **0** (система не сканирует файловую систему). В этом примере используется значение **0**.

3. Проверьте работу функции автоматического монтирования.
   
   1. Выполните команду **umount**, чтобы размонтировать файловую систему. Логический том **/dev/vg1/lv1** приведен в качестве примера:
      
      ```
      # umount /dev/vg1/lv1
      ```
   
   2. Перезагрузите все содержимое файла **/etc/fstab,** выполнив следующую команду:
      
      ```
      # mount -a
      ```
   
   3. Запросите данные монтирования файловой системы (**/mnt/data** приведены в качестве примера) с помощью следующей команды:
      
      ```
      # mount | grep /mnt/data
      ```
      
      Проверьте выходные данные команды. Функция автоматического монтирования выполняется, если в выходных данных команды содержится следующая информация:
      
      /dev/vg1/lv1 on /mnt/data