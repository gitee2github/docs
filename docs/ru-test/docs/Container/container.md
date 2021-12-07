# Руководство пользователя контейнера

## Обзор

Пакет программного обеспечения openEuler предоставляет iSula и базовую платформу для работы контейнеров.

iSula — это контейнерное решение компании Huawei. Название решения происходит от вида муравьев «исула». Этого муравья также называют «муравей-пуля» за его стремительный и очень болезненный укус, который сравнивают с попаданием пули. По мнению коренных бразильцев, живущих в джунглях Амазонки в Центральной и Южной Америке, исула является одним из самых выносливых и быстрых насекомых в мире. Компания Huawei назвала этим именем решение контейнерной технологии, характеристики которого соответствуют качествам этого насекомого.

Базовая контейнерная платформа iSula предоставляет движок Docker и облегченный контейнерный движок iSulad. Выбор движка должен базироваться на потребностях.

Кроме того, в зависимости от сценария применяются следующие форматы контейнера:

- Стандартные контейнеры, применяемые в большинстве распространенных сценариев.
- Безопасные контейнеры, применяемые в сценариях строгой изоляции клиентов-арендаторов.
- Системные контейнеры, применяемые в сценариях, в которых службы управляются с помощью systemd.

В этом документе описывается метод установки и использования контейнерных движков, а также способ их развертывания в различных форматах.

## Целевая аудитория

Данный документ предназначен для пользователей openEuler, которым необходимо установить контейнеры. Понимание этого документа будет эффективно, если пользователь:

- знаком с основными операциями Linux;
- имеет базовое представление о контейнерах.