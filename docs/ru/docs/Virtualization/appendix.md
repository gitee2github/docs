# Приложение

- [Приложение](#appendix.md)
  - [Термины, сокращения и аббревиатуры](#terminology-acronyms-and-abbreviations)

## Термины, сокращения и аббревиатуры

Термины, сокращения и аббревиатуры, используемые в настоящем документе, приведены в [Табл. 1](#table201236162279) и [Табл. 2](#table1423422319271).

**Табл. 1** Термины

| **Термин**         | **Описание**                                                 |
| ------------------ | ------------------------------------------------------------ |
| AArch64            | AArch64 здесь означает состояние выполнения архитектуры ARMv8. AArch64 — это не просто расширение 32-разрядной архитектуры ARM, а совершенно новая архитектура ARMv8, которая использует абсолютно новый набор команд A64. |
| Домен              | Набор конфигурируемых ресурсов, включая память, виртуальный процессор, сетевые устройства и дисковые устройства. В домене запускается виртуальная машина. Домену выделяются виртуальные ресурсы. Домен можно независимо запускать, останавливать и перезапускать. |
| Libvirt            | Набор инструментов, используемых для управления платформами виртуализации, включая KVM, QEMU, Xen и другие платформы. |
| Гостевая ОС        | ОС, работающая на виртуальной машине.                        |
| ОС хоста           | ОС физической машины.                                        |
| Гипервизор         | Промежуточный программный уровень, который работает между основным физическим сервером и ОС. С помощью гипервизора несколько ОС и приложений совместно используют общие аппаратные ресурсы. |
| Виртуальная машина | Полная виртуальная компьютерная система, построенная с использованием технологии виртуализации и имитирующая функции полной компьютерной аппаратной системы с помощью программного обеспечения. |

**Табл. 2** Сокращения и аббревиатуры



| **Аббревиатура** | **Расшифровка**                        | Полное наименование                                    | **Описание**                                                 |
| ---------------- | -------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| NUMA             | Non-Uniform Memory Access Architecture | Архитектура с «неоднородным» доступом к памяти         | Это архитектура памяти, разработанная для многопроцессорных компьютеров. С ее помощью процессор получает доступ к собственной локальной памяти быстрее, чем к нелокальной памяти (памяти, расположенной на другом процессоре, или памяти, которую совместно используют несколько процессоров). |
| KVM              | Kernel-based Virtual Machine           | Виртуальная машина на основе ядра                      | Это виртуальная машина на основе ядра, которая выступает в роли модуля ядра Linux со свойствами гипервизора. |
| OVS              | Open vSwitch                           | Open vSwitch                                           | Это программный многоуровневый коммутатор с протоколом Apache 2.0 с открытым исходным кодом, предназначенный для работы в гипервизорах и на компьютерах с виртуальными машинами. |
| QEMU             | Quick Emulator                         | Quick Emulator                                         | QEMU представляет собой эмулятор общего назначения с открытым исходным кодом, который реализует виртуализацию аппаратного обеспечения. |
| SMP              | Symmetric Multi-Processor              | Симметричная многопроцессорная архитектура             | SMP — это архитектура аппаратного обеспечения многопроцессорного компьютера. В настоящее время данную архитектуру используют большинство процессоров. Каждый процессор в такой архитектуре использует общую подсистему памяти и структуру шины. |
| UEFI             | Unified Extensible Firmware Interface  | Унифицированный расширяемый микропрограммный интерфейс | Стандарт, который подробно описывает новые интерфейсы. Этот интерфейс используется для автоматической загрузки рабочей среды предварительного старта в операционную систему. |
| ВМ               | Virtual Machine                        | Виртуальная машина                                     | Полная виртуальная компьютерная система, построенная с использованием технологии виртуализации и имитирующая функции полной компьютерной аппаратной системы с помощью программного обеспечения. |
| VMM              | Virtual Machine Monitor                | Монитор виртуальной машины                             | Промежуточный программный уровень, который работает между основным физическим сервером и ОС. С помощью гипервизора несколько ОС и приложений совместно используют общие аппаратные ресурсы. |