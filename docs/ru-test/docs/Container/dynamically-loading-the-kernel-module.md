# Динамическая загрузка модуля ядра

- [Динамическая загрузка модуля ядра](#dynamically-loading-the-kernel-module)

## Описание функционала

Работа служб в контейнере может зависеть от ряда модулей ядра. Установкой переменных среды настраивается динамическая загрузка модулей ядра, необходимых контейнерным службам, на хост перед запуском системного контейнера. Данную функцию необходимо использовать вместе с функцией isulad-hooks. Для получения подробной информации см. раздел [Динамическое управление ресурсами контейнера (syscontainer-tools)](./dynamically-managing-container-resources-(syscontainer-tools).md).

## Описание параметров

| **Команда**      | Параметр                                   | **Описание значений**                                        |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------ |
| isula create/run | -e KERNEL_MODULES=module_name1,module_name | ·    Переменная строкового типа. ·    С помощью данного параметра можно указать несколько модулей. Имена указываемых модулей разделяются запятыми (,). |

## Ограничения

- Если загруженные модули ядра не проверяются или конфликтуют с существующими модулями на хосте, то на хосте может произойти непредвиденная ошибка. Поэтому следует проявлять осторожность при загрузке модулей ядра.
- Во время динамической загрузки передаются модули ядра, которые требуется загрузить в контейнеры. Эта функция реализуется путем получения переменных среды, необходимых для запуска контейнеров с помощью isulad-tools. Поэтому для корректной работы функции необходимо правильно установить и развернуть isulad-tools.
- Загруженные модули ядра удаляются вручную.

## Пример

В приведенном примере при запуске системного контейнера указывается параметр  **-e KERNEL\_MODULES**. После запуска системного контейнера модуль ip\_vs успешно загружается в ядро.

```
[root@localhost ~]# lsmod | grep ip_vs
[root@localhost ~]# isula run -tid -e KERNEL_MODULES=ip_vs,ip_vs_wrr --hook-spec /etc/isulad-tools/hookspec.json --system-container --external-rootfs /root/myrootfs none init
ae18c4281d5755a1e153a7bff6b3b4881f36c8e528b9baba8a3278416a5d0980
[root@localhost ~]# lsmod | grep ip_vs
ip_vs_wrr              16384  0
ip_vs                 176128  2 ip_vs_wrr
nf_conntrack          172032  7 xt_conntrack,nf_nat,nf_nat_ipv6,ipt_MASQUERADE,nf_nat_ipv4,nf_conntrack_netlink,ip_vs
nf_defrag_ipv6         20480  2 nf_conntrack,ip_vs
libcrc32c              16384  3 nf_conntrack,nf_nat,ip_vs
```

> ![](./public_sys-resources/icon-note.gif) **ПРИМЕЧАНИЕ**:
> 
> - isulad-tools обязательно устанавливается на хосте.
> - Параметру **--hooks-spec** необходимо задать значение **isulad hooks**.