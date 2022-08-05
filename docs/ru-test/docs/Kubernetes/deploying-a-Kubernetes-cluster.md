# Развертывание кластера Kubernetes

В данном разделе приведено описание способа развертывания кластера Kubernetes.

## Среда

На основе предыдущей установки и развертывания виртуальной машины получен нижеприведенный список ВМ.

| HostName   | MAC               | IPv4               |
| ---------- | ----------------- | ------------------ |
| k8smaster0 | 52:54:00:00:00:80 | 192.168.122.154/<span>24</span> |
| k8smaster1 | 52:54:00:00:00:81 | 192.168.122.155/<span>24</span> |
| k8smaster2 | 52:54:00:00:00:82 | 192.168.122.156/<span>24</span> |
| k8snode1   | 52:54:00:00:00:83 | 192.168.122.157/<span>24</span> |
| k8snode2   | 52:54:00:00:00:84 | 192.168.122.158/<span>24</span> |
| k8snode3   | 52:54:00:00:00:85 | 192.168.122.159/<span>24</span> |


