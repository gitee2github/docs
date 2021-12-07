1. После выполнения команды nvwa update система еще не обновлена.
   
   Причина: Ошибка возникает при сохранении информации о запуске или замене ядра.
   
   Решение: Просмотрите журналы, чтобы найти причину ошибки.

2. После включения функции ускорения команда nvwa не выполняется.
   
   Причина: NVWA предоставляет множество возможностей ускорения, включая quick kexec, pin memory и cpu park. Все эти возможности связаны с командной строкой и распределением памяти. При выборе памяти используйте команду cat /proc/iomemory, чтобы убедиться, что не происходит конфликта выбранной памяти с памятью других программ. При необходимости запустите команду dmesg, чтобы проверить, существуют ли журналы ошибок после включения функции.

3. После динамического обновления соответствующий процесс не восстанавливается.
   
   Причина: Проверьте, работает ли сервис nvwa. Если сервис nvwa запущен, сервис или процесс может быть не восстановлен.
   
   Решение: Запустите команду service nvwa status для просмотра журналов nvwa. Если сервис не удается запустить, проверьте, активирован ли сервис, а затем выполните команду systemd для просмотра журналов соответствующего сервиса. Другие последующие журналы хранятся в папке процесса или сервиса, имя которой совпадает с путем, указанным criu\_dir. В файле dump.log хранятся журналы, созданные при сохранении информации о работе, а в файле restore.log — журналы, созданные для восстановления процесса.

4. Сбой восстановления. В журнале появляется сообщение Can't fork for 948: File exists.
   
   Причина: Во время восстановления программы инструмент динамического обновления ядра обнаруживает, что PID программы занят.
   
   Решение: Текущее ядро не предоставляет механизма для удерживания PID. В настоящее время разрабатываются связанные с этим политики. Такое ограничение будет устранено в последующих версиях ядра. В данный момент вы можете только вручную перезапустить соответствующие процессы.

5. При использовании команды nvwa для сохранения и восстановления простой программы (hello world) система выводит сообщение о том, что операция не удалась или программа не запущена.
   
   Причина: Существует множество ограничений на использование CRIU.
   
   Решение: Просмотрите журнал NVWA. Если ошибка связана с CRIU, проверьте файл dump.log или restore.log в соответствующем каталоге. Более подробная информация об ограничениях использования, связанных с CRIU, см. [WiKi](https://criu.org/What_cannot_be_checkpointed).