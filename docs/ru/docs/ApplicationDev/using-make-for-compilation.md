# Компиляция с использованием утилиты make

В этой главе описываются основные сведения о компиляции с использованием утилиты make и приводятся примеры для демонстрации ее работы. Для получения дополнительной информации об утилите make выполните команду **make**.

\[\[toc]]

## Обзор

Утилита GNU make (обычно используется в сокращенном виде как make) является инструментом генерации исполняемых файлов на основе файлов с исходным кодом. Утилита make автоматически определяет, какие части составной программы изменились и требуют повторной компиляции. Для управления процессом сборки программы утилита make использует конфигурационный файл, называемый makefiles.

## Основные сведения

### Тип файла

В [Табл. 1](#table634145764320) приведено описание типов файлов, которые могут использоваться в файле makefiles.

**Табл. 1** Типы файлов

| Расширение (суффикс) | Описание                                                     |
| -------------------- | ------------------------------------------------------------ |
| .c                   | Файл с исходным кодом на языке C.                            |
| .C，.cc или .cxx     | Файл с исходным кодом на языке C++.                          |
| .m                   | Файл с исходным кодом на языке Objective-C.                  |
| .s                   | Файл с исходным кодом на языке Ассемблер.                    |
| .i                   | Файл с предварительно обработанным исходным кодом на языке C. |
| .ii                  | Файл с предварительно обработанным исходным кодом на языке C++. |
| .S                   | Файл с предварительно обработанным исходным кодом на языке Ассемблер. |
| .h                   | Файл заголовка, содержащийся в программе.                    |
| .o                   | Целевой файл после компиляции.                               |
| .so                  | Динамическая библиотека ссылок в виде специального целевого файла. |
| .a                   | Библиотека статических ссылок.                               |
| .out                 | Исполняемые файлы, не имеющие фиксированного суффикса. Система отличает исполняемые файлы от неисполняемых файлов по их атрибутам. Если имя исполняемого файла не указано, GCC генерирует файл с именем a.out. |
### Рабочий процесс утилиты make

Процесс развертывания утилиты make для создания исполняемого файла на основе файла с исходным кодом выглядит следующим образом:

1. Команда make считывает файлы Makefiles, включая файлы с именем GNUmakefile, makefile и Makefile, из текущего каталога, а также файлы с правилами, указанные с помощью опций **-f**, **--file**, **--makefile**.
2. Инициализируйте переменные.
3. Выведите неявные правила, проанализируйте зависимости и создайте цепочку зависимостей.
4. На основе цепочки зависимости определите, какие целевые объекты необходимо восстановить.
5. Выполните команду для генерирования окончательного файла.

### Параметры утилиты make

Формат команды make: **make**  \[_option_]... \[_target_]...

В данной команде:

*option*: выбираемый параметр.

*target*: целевой объект, указанный в файле Makefile.

В [Табл. 2](#table261872312343) приведено описание часто используемых параметров команды make.

**Табл. 2** Общие параметры команды make

| Параметр                                    | Описание                                                     |
| ------------------------------------------- | ------------------------------------------------------------ |
| -C dir，--directory=dir                     | Данный параметр устанавливает dir в качестве рабочей каталога после начала выполнения команды make.<br/>При указании нескольких опций **-C**, окончательный рабочий каталог make является относительным путем первого каталога. |
| -d                                          | Отображение всей отладочной информации во время выполнения команды make. Параметром **-d** можно отобразить всю информацию во время построения цепочки зависимостей и восстановления целевого объекта. |
| -e，--environment-overrides                 | Данный параметр перезаписывает определение переменной с тем же именем в файле Makefile, заменяя его определением переменной среды. |
| -f file，--file=file，--makefile=file       | Данный параметр устанавливает файл Makefile для команды make. |
| -p，--help                                  | Вывод справочной информации.                                 |
| -i，--ignore-errors                         | С данным параметром игнорируются ошибки, возникшие во время выполнения. |
| -k，--keep-going                            | С данным параметром команда make не прекращает выполнение в случае возникновения ошибки. Команда make выполняет максимально все возможные команды до возникновения известной ошибки. |
| -n，--just-print，--dry-run                 | Имитация выполнения команд (включая команды, начинающиеся с @) в реальной последовательности исполнения. Этот параметр используется только для отображения процесса выполнения, а не для фактического выполнения. |
| -o file，--old-file=file，--assume-old=file | Указанный данным параметром файл не требует повторной сборки, даже если срок его зависимости истек, и ни один целевой объект этого файла зависимости не проходит повторную сборку. |
| -p，--print-date-base                       | Перед выполнением команды выводятся на печать все данные Makefile, считываемые командой make, и информация о версии утилиты make. Если требуется только распечатать данные, выполните команду **make -qp**, чтобы проверить предустановленные правила и переменные перед выполнением команды **make**. Вариант команды: **make -p -f /dev/null**. |
| -r，--no-builtin-rules                      | С данным параметром игнорируются встроенные неявные правила и список суффиксов всех неявных правил. |
| -R，--no-builtin-variabes                   | Игнорируются встроенные скрытые переменные.                  |
| -s，--silent，--quiet                       | Отмена печати во время выполнения команды.                   |
| -S，--no-keep-going，--stop                 | Отмена параметра **-k**. В рекурсивном вызове утилиты make экземпляр sub-make наследует параметр командной строки верхнего уровня через переменную **MAKEFLAGS**. Параметр -S можно использовать в экземпляре sub-make, чтобы отменить параметр **-k**, переданный командой верхнего уровня, или отменить параметр **-k** в переменной системной среды **MAKEFLAGS**. |
| -t，--touch                                 | Обновление метки времени всех целевых файлов до текущего системного времени. Данный параметр предотвращает повторную сборку всех устаревших целевых файлов утилитой make. |
| -v，version                                 | Отображение версии утилиты make.                             |
## Makefiles

Утилита make — это инструмент, который генерирует исполняемые файлы и другие связанные файлы на основе файлов с исходным кодом, используя для этого файлы makefiles для компиляции, связывания, установки и очистки. В файлах makefiles описываются правила компиляции и связывания для всего проекта, в том числе указывается, какие файлы необходимо скомпилировать, какие файлы не требуют компиляции, какие файлы необходимо скомпилировать в первую очередь, а какие позднее, какие файлы требуют повторной сборки. Файлы makefiles автоматизируют процесс компиляции проекта. От пользователя не требуется каждый раз вручную вводить большое количество исходных файлов и параметров.

В этой главе описывается структура и основное содержимое файлов makefiles. Для получения дополнительной информации о файлах makefiles выполните команду **info make**.

### Структура файлов makefiles

Структура файла makefiles выглядит следующим образом:

_targets_:_prereguisites_

_command_

или

_targets_:_prerequisites_;_command_

_command_

Параметры:

- targets: целевые объекты, которые могут быть целевыми файлами, исполняемыми файлами или тегами.
- prerequisites: файлы зависимости, которые являются файлами или целевыми объектами, необходимыми для генерирования _targets_. Можно указать несколько или ни одного файла.
- command: команда (любая команда оболочки), которую выполняет утилита make. Можно указать несколько команд, и каждая команда занимает одну строку.
- Используйте двоеточия (:) для отделения целевых файлов от файлов с зависимостями. Нажимайте **Tab** в начале каждой командной строки.

В структуре файлов makefiles указывается выходной целевой объект, объект, от которого зависит данный выходной целевой объект, и команда, которую необходимо выполнить для генерирования целевого объекта.

### Содержимое файлов makefiles

Файл makefile имеет следующее содержимое:

- Явное правило
  
  Укажите зависимость, например файл, который требуется сгенерировать, файл зависимости и сгенерированную команду.

- Неявное правило
  
  Укажите правило, которое будет автоматически выводиться утилитой make. Команда make поддерживает функцию автоматического вывода.

- Определение переменной

- Индикатор файла
  
  Индикатор файла состоит из трех частей:
  
  - Включение других файлов makefiles, например xx.md
  - Избирательное исполнение, например #ifdef
  - Определение нескольких командных строк, например define...endef. (define ... endef)

- Комментарий
  
  Комментарий начинается со знака номера (#).

## Примеры

### Пример компиляции с помощью файла makefile

1. Выполните команду **cd**, чтобы перейти в каталог хранения кода. В примере используется каталог **~/code**.
   
   ```
   $ cd ~/code
   ```

2. Создайте файл заголовка **hello.h** и две функции **hello.c** и **main.c**.
   
   ```
   $ vi hello.h
   $ vi hello.c
   $ vi main.c
   ```
   
   Пример кода **hello.h**:
   
   ```
   #pragma once
   #include <stdio.h>
   void hello();
   ```
   
   Пример кода **hello.c**:
   
   ```
   #include "hello.h"
   void hello()
   {
           int i=1;
           while(i<5)
           {
                   printf("The %dth say hello.\n", i);
                   i++;
           }
   }
   
   ```
   
   Пример кода **main.c**:
   
   ```
   #include "hello.h"
   #include <stdio.h>
   int main()
   {
           hello();
           return 0;
   }
   ```

3. Создайте файл makefile.
   
   ```
   $ vi Makefile
   ```
   
   Далее приведен пример содержимого файла makefile:
   
   ```
   main:main.o hello.o
           gcc -o main main.o hello.o
   main.o:main.c
           gcc -c main.c
   hello.o:hello.c
           gcc -c hello.c
   clean:
           rm -f hello.o main.o main
   ```

4. Выполните команду **make**.
   
   ```
   $ make
   ```
   
   После выполнения команды выводятся на печать команды, исполняемые в файле makefile. Если печатать информацию не требуется, добавьте в команду **make** параметр **-s**.
   
   gcc -c main.c
   
   gcc -c hello.c
   
   gcc -o main main.o hello.o

5. Выполните целевой объект ./main.
   
   ```
   $ ./main
   ```
   
   После выполнения команды появляется следующая информация:
   
   The 1th say hello.
   
   The 2th say hello.
   
   The 3th say hello.
   
   The 4th say hello.