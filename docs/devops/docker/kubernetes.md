# Kubernetes 学习笔记

> Kubernetes（简称 K8s）是 Google 开源的容器编排平台，用于自动化部署、扩缩和管理容器化应用。

---

## 1. 核心概念

### 1.1 架构总览

```
Master 节点（控制平面）                Worker 节点（数据平面）
┌─────────────────────────┐          ┌──────────────────────────┐
│  API Server             │          │  kubelet                 │
│  etcd（状态存储）        │◄────────►│  kube-proxy              │
│  Scheduler（调度器）     │          │  Container Runtime       │
│  Controller Manager     │          │  Pod                     │
└─────────────────────────┘          └──────────────────────────┘
```

**Master 节点组件：**

| 组件               | 说明                                                    |
| ------------------ | ------------------------------------------------------- |
| API Server         | 集群入口，所有操作都通过它进行                          |
| etcd               | 分布式键值存储，保存集群所有状态数据                    |
| Scheduler          | 负责将 Pod 调度到合适的 Worker 节点                     |
| Controller Manager | 管理控制器（Deployment Controller、Node Controller 等） |

**Worker 节点组件：**

| 组件              | 说明                                    |
| ----------------- | --------------------------------------- |
| kubelet           | 管理 Pod 的生命周期，与 API Server 通信 |
| kube-proxy        | 维护网络规则，实现 Service 的负载均衡   |
| Container Runtime | 容器运行时（containerd、CRI-O 等）      |

**附加组件（Addons）：**

| 组件               | 说明                                                  |
| ------------------ | ----------------------------------------------------- |
| CoreDNS            | 集群内 DNS 服务                                       |
| Ingress Controller | Ingress 规则的实际执行者（Nginx Ingress、Traefik 等） |
| Dashboard          | Web 管理界面                                          |
| Metrics Server     | 资源指标采集，支撑 `kubectl top` 和 HPA               |

### 1.2 核心对象

| 对象              | 说明                                                 |
| ----------------- | ---------------------------------------------------- |
| **Pod**           | K8s 最小调度单元，包含一个或多个容器，共享网络和存储 |
| **Deployment**    | 管理 Pod 的副本集，支持滚动更新和回滚                |
| **Service**       | 为一组 Pod 提供稳定的访问入口（负载均衡）            |
| **Namespace**     | 资源隔离的逻辑分区                                   |
| **ConfigMap**     | 非敏感配置管理                                       |
| **Secret**        | 敏感信息管理（密码、证书等）                         |
| **Volume**        | Pod 级别的存储卷                                     |
| **PV / PVC**      | 持久化存储卷与声明                                   |
| **Ingress**       | HTTP/HTTPS 路由规则，暴露服务到集群外部              |
| **DaemonSet**     | 确保每个节点运行一个 Pod 副本                        |
| **StatefulSet**   | 管理有状态应用，提供稳定的网络标识和持久存储         |
| **Job / CronJob** | 一次性任务和定时任务                                 |
| **HPA**           | 水平 Pod 自动扩缩容                                  |
| **NetworkPolicy** | 网络访问控制策略                                     |

### 1.3 资源层级关系

```
Cluster
├── Namespace
│   ├── Deployment ──→ ReplicaSet ──→ Pod ──→ Container
│   ├── StatefulSet ──→ Pod
│   ├── DaemonSet ──→ Pod
│   ├── Job / CronJob ──→ Pod
│   ├── Service ──→ Endpoints ──→ Pod
│   ├── ConfigMap / Secret
│   ├── PV / PVC
│   ├── Ingress ──→ Service
│   └── NetworkPolicy
```

---

## 2. Pod 详解

### 2.1 Pod 生命周期

Pod 从创建到销毁经历以下阶段：

```
Pending → Running → Succeeded / Failed
                ↘ CrashLoopBackOff（容器反复崩溃）
```

| 阶段      | 说明                                                 |
| --------- | ---------------------------------------------------- |
| Pending   | Pod 已被接受，但容器镜像尚未全部拉取                 |
| Running   | Pod 已绑定到节点，所有容器都已创建，至少一个正在运行 |
| Succeeded | Pod 中所有容器成功终止，不会重启                     |
| Failed    | Pod 中所有容器已终止，且至少一个容器以失败退出       |
| Unknown   | 无法获取 Pod 状态，通常是与节点通信失败              |

**Pod 生命周期中的重要行为：**

```
Init Containers → 主容器启动 → Post-Start Hook → 就绪探针通过 → 服务就绪
                                                           ↘ 存活探针持续检测
                                                           ↘ Pre-Stop Hook → 容器终止
```

### 2.2 Init Container

Init Container 在主容器启动前按顺序执行，全部成功后主容器才会启动。

```yaml
spec:
  initContainers:
    - name: init-db
      image: busybox
      command:
        [
          'sh',
          '-c',
          'until nslookup mysql.default.svc.cluster.local; do echo waiting for db; sleep 2; done',
        ]
  containers:
    - name: web-app
      image: myapp:1.0.0
```

### 2.3 健康检查（探针）

K8s 通过三种探针来监控容器的健康状态：

| 探针类型           | 说明               | 失败后果                   |
| ------------------ | ------------------ | -------------------------- |
| **livenessProbe**  | 检测容器是否存活   | 重启容器                   |
| **readinessProbe** | 检测容器是否就绪   | 从 Service Endpoints 移除  |
| **startupProbe**   | 检测容器是否已启动 | 在成功之前，其他探针被禁用 |

**探测方式：**

| 方式      | 说明                                           |
| --------- | ---------------------------------------------- |
| httpGet   | 向指定端口和路径发送 HTTP 请求，2xx/3xx 为成功 |
| tcpSocket | 尝试建立 TCP 连接，连接成功即为健康            |
| exec      | 在容器内执行命令，退出码 0 为成功              |
| grpc      | 使用 gRPC 健康检查协议                         |

**完整探针配置示例：**

```yaml
spec:
  containers:
    - name: web-app
      image: myapp:1.0.0
      livenessProbe:
        httpGet:
          path: /healthz
          port: 80
        initialDelaySeconds: 15
        periodSeconds: 10
        timeoutSeconds: 5
        failureThreshold: 3
        successThreshold: 1
      readinessProbe:
        httpGet:
          path: /ready
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 5
        timeoutSeconds: 3
        failureThreshold: 3
      startupProbe:
        httpGet:
          path: /healthz
          port: 80
        initialDelaySeconds: 0
        periodSeconds: 5
        failureThreshold: 30
```

**探针参数说明：**

| 参数                | 说明                     | 默认值 |
| ------------------- | ------------------------ | ------ |
| initialDelaySeconds | 容器启动后首次探测的延迟 | 0      |
| periodSeconds       | 探测间隔                 | 10     |
| timeoutSeconds      | 单次探测超时时间         | 1      |
| failureThreshold    | 连续失败多少次视为不健康 | 3      |
| successThreshold    | 连续成功多少次视为健康   | 1      |

### 2.4 生命周期钩子

```yaml
spec:
  containers:
    - name: web-app
      image: myapp:1.0.0
      lifecycle:
        postStart:
          exec:
            command: ['/bin/sh', '-c', 'echo Started > /tmp/message']
        preStop:
          exec:
            command: ['/bin/sh', '-c', 'sleep 15']
```

| 钩子      | 触发时机           | 用途                 |
| --------- | ------------------ | -------------------- |
| postStart | 容器创建后立即执行 | 初始化操作、注册服务 |
| preStop   | 容器终止前执行     | 优雅关闭、注销服务   |

> 注意：preStop 钩子与 `terminationGracePeriodSeconds` 配合使用，确保优雅关闭。

### 2.5 Pod 重启策略

| 策略      | 说明                       |
| --------- | -------------------------- |
| Always    | 容器退出后总是重启（默认） |
| OnFailure | 容器以非零退出码退出时重启 |
| Never     | 容器退出后不重启           |

```yaml
spec:
  restartPolicy: Always
  terminationGracePeriodSeconds: 30
```

### 2.6 Pod 资源限制

```yaml
spec:
  containers:
    - name: web-app
      resources:
        requests:
          memory: '128Mi'
          cpu: '100m'
        limits:
          memory: '256Mi'
          cpu: '500m'
```

| 字段     | 说明                                                             |
| -------- | ---------------------------------------------------------------- |
| requests | 调度依据，保证容器至少获得的资源                                 |
| limits   | 上限，超过 memory limits 会被 OOM Kill，超过 cpu limits 会被限流 |

**CPU 单位：** 1 = 1 核，100m = 0.1 核
**Memory 单位：** Mi（MiB）、Gi（GiB）

---

## 3. kubectl 命令行工具

kubectl 是与 K8s API Server 交互的命令行工具，是日常操作的核心。

### 3.1 基础操作

```bash
kubectl get nodes                          # 查看集群节点
kubectl get pods -A                        # 查看所有命名空间的 Pod
kubectl get svc                            # 查看服务列表
kubectl describe pod <pod-name>            # 查看 Pod 详情
kubectl logs <pod-name>                    # 查看 Pod 日志
kubectl exec -it <pod-name> -- /bin/bash   # 进入容器
```

### 3.2 资源管理

```bash
kubectl apply -f deployment.yaml           # 声明式创建/更新资源
kubectl delete -f deployment.yaml          # 删除资源
kubectl edit deployment <name>             # 编辑资源配置
kubectl scale deployment <name> --replicas=3  # 扩缩容
```

### 3.3 排查调试

```bash
kubectl get events --sort-by=.metadata.creationTimestamp   # 查看事件
kubectl top pods                            # 查看 Pod 资源使用
kubectl port-forward svc/<name> 8080:80    # 端口转发到本地
kubectl rollout status deployment/<name>    # 查看滚动更新状态
kubectl rollout undo deployment/<name>      # 回滚到上一版本
kubectl rollout history deployment/<name>   # 查看滚动更新历史
```

### 3.4 常用命令速查

| 场景      | 命令                                                            |
| --------- | --------------------------------------------------------------- |
| 查看资源  | `kubectl get <resource> [-o wide/yaml/json]`                    |
| 查看详情  | `kubectl describe <resource> <name>`                            |
| 创建资源  | `kubectl apply -f <file>` / `kubectl create -f <file>`          |
| 删除资源  | `kubectl delete -f <file>` / `kubectl delete <resource> <name>` |
| 查看日志  | `kubectl logs <pod-name> [-f] [-c <container>]`                 |
| 执行命令  | `kubectl exec -it <pod-name> -- <command>`                      |
| 查看事件  | `kubectl get events --sort-by=.metadata.creationTimestamp`      |
| 标签操作  | `kubectl label pod <name> key=value`                            |
| 命名空间  | `kubectl config set-context --current --namespace=<ns>`         |
| 导出 YAML | `kubectl get <resource> <name> -o yaml`                         |
| 查看版本  | `kubectl version -o yaml`                                       |
| 集群信息  | `kubectl cluster-info`                                          |

---

## 4. 资源清单（YAML）

K8s 使用 YAML 声明式管理资源。

### 4.1 YAML 基本结构

```yaml
apiVersion: <API 版本> # 如 v1, apps/v1, networking.k8s.io/v1
kind: <资源类型> # 如 Pod, Deployment, Service
metadata: # 元数据
  name: <名称>
  namespace: <命名空间>
  labels: # 标签（用于选择器匹配）
    app: my-app
  annotations: # 注解（用于存储非标识性信息）
    description: 'my app'
spec: # 期望状态
  ...
status: # 实际状态（只读，由系统维护）
  ...
```

### 4.2 Deployment 示例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web-app
          image: myapp:1.0.0
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /healthz
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

**更新策略：**

| 策略          | 说明                             |
| ------------- | -------------------------------- |
| RollingUpdate | 滚动更新（默认），逐步替换旧 Pod |
| Recreate      | 先删除所有旧 Pod，再创建新 Pod   |

| 参数           | 说明                                                   |
| -------------- | ------------------------------------------------------ |
| maxSurge       | 滚动更新时可以超出期望副本数的最大数量（数字或百分比） |
| maxUnavailable | 滚动更新时允许不可用的最大数量（数字或百分比）         |

### 4.3 Service 示例

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-svc
spec:
  selector:
    app: web-app
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 80
```

**Service 类型对比：**

| 类型         | 说明                            | 访问范围                       |
| ------------ | ------------------------------- | ------------------------------ |
| ClusterIP    | 集群内部 IP（默认）             | 集群内部                       |
| NodePort     | 在节点上开放端口（30000-32767） | 集群外部通过 `<NodeIP>:<Port>` |
| LoadBalancer | 云厂商负载均衡器                | 外部流量直接接入               |
| ExternalName | 映射到外部 DNS 名称             | 集群内部访问外部服务           |

### 4.4 Ingress 示例

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-app-svc
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 8080
```

**pathType 说明：**

| 类型                   | 说明                                           |
| ---------------------- | ---------------------------------------------- |
| Prefix                 | 按前缀匹配（如 `/api` 匹配 `/api`、`/api/v1`） |
| Exact                  | 精确匹配路径                                   |
| ImplementationSpecific | 由 Ingress Controller 决定匹配方式             |

### 4.5 ConfigMap 与 Secret

**ConfigMap：**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: 'mysql.default.svc.cluster.local'
  DATABASE_PORT: '3306'
  LOG_LEVEL: 'info'
  app.properties: |
    server.port=8080
    spring.profiles.active=prod
```

**Secret：**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DATABASE_PASSWORD: cGFzc3dvcmQxMjM=
stringData:
  API_KEY: 'my-api-key'
```

**Secret 类型：**

| 类型                           | 用途             |
| ------------------------------ | ---------------- |
| Opaque                         | 通用密钥（默认） |
| kubernetes.io/tls              | TLS 证书         |
| kubernetes.io/dockerconfigjson | 镜像仓库认证     |
| kubernetes.io/basic-auth       | 基础认证         |

**在 Pod 中引用：**

```yaml
spec:
  containers:
    - name: web-app
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secret
      env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DATABASE_HOST
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: DATABASE_PASSWORD
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
  volumes:
    - name: config-volume
      configMap:
        name: app-config
    - name: secret-volume
      secret:
        secretName: app-secret
```

---

## 5. 工作负载控制器

### 5.1 Deployment

Deployment 是最常用的控制器，管理无状态应用。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
```

**常用操作：**

```bash
kubectl apply -f deployment.yaml --record    # 部署并记录变更原因
kubectl set image deployment/nginx nginx=nginx:1.26   # 更新镜像
kubectl rollout status deployment/nginx       # 查看更新状态
kubectl rollout history deployment/nginx      # 查看更新历史
kubectl rollout undo deployment/nginx         # 回滚到上一版本
kubectl rollout undo deployment/nginx --to-revision=2  # 回滚到指定版本
kubectl scale deployment/nginx --replicas=5   # 扩缩容
```

### 5.2 StatefulSet

StatefulSet 用于管理有状态应用（如数据库、消息队列），提供：

- 稳定的网络标识：`<pod-name>-<ordinal>.<service-name>`
- 稳定的持久存储：每个 Pod 绑定独立的 PVC
- 有序的部署和终止：按序号顺序操作

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: password
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes: ['ReadWriteOnce']
        storageClassName: standard
        resources:
          requests:
            storage: 10Gi
```

**Headless Service（配合 StatefulSet 使用）：**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
    - port: 3306
```

> `clusterIP: None` 创建 Headless Service，DNS 直接解析到 Pod IP，而非 Service IP。

**Deployment vs StatefulSet：**

| 特性     | Deployment    | StatefulSet                  |
| -------- | ------------- | ---------------------------- |
| Pod 名称 | 随机后缀      | 有序编号（mysql-0, mysql-1） |
| 网络标识 | 不稳定        | 稳定（需 Headless Service）  |
| 存储     | 共享或无      | 每个 Pod 独立 PVC            |
| 扩缩容   | 无序          | 有序（逆序缩容）             |
| 滚动更新 | 无序          | 有序（逆序更新）             |
| 适用场景 | Web 服务、API | 数据库、ZooKeeper、Kafka     |

### 5.3 DaemonSet

DaemonSet 确保每个（或特定）节点运行一个 Pod 副本，常用于：

- 日志采集（Fluentd、Filebeat）
- 监控代理（Prometheus Node Exporter）
- 网络插件（Calico、Flannel）
- 存储守护进程

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
          ports:
            - containerPort: 9100
              hostPort: 9100
          volumeMounts:
            - name: proc
              mountPath: /host/proc
              readOnly: true
            - name: sys
              mountPath: /host/sys
              readOnly: true
      volumes:
        - name: proc
          hostPath:
            path: /proc
        - name: sys
          hostPath:
            path: /sys
```

### 5.4 Job 与 CronJob

**Job（一次性任务）：**

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 3
  activeDeadlineSeconds: 300
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migration
          image: myapp:migrate
          command: ['python', 'migrate.py']
```

**CronJob（定时任务）：**

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: '0 2 * * *'
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: myapp:backup
              command: ['./backup.sh']
```

| 字段                       | 说明                                                     |
| -------------------------- | -------------------------------------------------------- |
| schedule                   | Cron 表达式（`分 时 日 月 周`）                          |
| concurrencyPolicy          | Allow（允许并发）/ Forbid（禁止）/ Replace（替换旧任务） |
| successfulJobsHistoryLimit | 保留成功 Job 的数量                                      |
| failedJobsHistoryLimit     | 保留失败 Job 的数量                                      |

### 5.5 HPA（水平自动扩缩容）

HPA 根据 CPU/内存使用率或自定义指标自动调整 Pod 副本数。

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

**扩缩算法：**

```
期望副本数 = ceil(当前副本数 × (当前指标值 / 目标指标值))
```

**前提条件：** 集群中必须安装 Metrics Server。

```bash
kubectl top pods
kubectl top nodes
```

---

## 6. 网络模型

### 6.1 K8s 网络基本原则

- 所有 Pod 可以与任何其他 Pod 通信（无需 NAT）
- 所有 Node 可以与所有 Pod 通信（无需 NAT）
- Pod 看到自己的 IP 与其他 Pod 看到它的 IP 一致

### 6.2 网络通信流程

```
Pod 内容器通信：共享 Network Namespace（localhost）
Pod 间通信：   通过 Pod IP 直接通信（CNI 插件实现）
Service 通信： 通过 ClusterIP / NodePort / LoadBalancer
集群外通信：   Ingress / NodePort / LoadBalancer
```

### 6.3 CNI 网络插件

| 插件    | 特点                                      |
| ------- | ----------------------------------------- |
| Calico  | 支持 BGP 路由，支持 NetworkPolicy，性能好 |
| Flannel | 简单易用，Overlay 网络（VXLAN），适合入门 |
| Cilium  | 基于 eBPF，高性能，支持 L3-L7 策略        |
| Weave   | 自动发现，加密通信                        |

### 6.4 DNS 解析规则

集群内 DNS 由 CoreDNS 提供，解析规则如下：

| 访问目标                | DNS 名称                                                  |
| ----------------------- | --------------------------------------------------------- |
| 同命名空间 Service      | `<service-name>`                                          |
| 跨命名空间 Service      | `<service-name>.<namespace>.svc.cluster.local`            |
| Headless Service 的 Pod | `<pod-name>.<service-name>.<namespace>.svc.cluster.local` |
| 外部服务                | 正常域名解析                                              |

### 6.5 NetworkPolicy

NetworkPolicy 用于控制 Pod 之间的网络访问，类似于防火墙规则。

> 默认情况下，Pod 之间网络是完全开放的，NetworkPolicy 用于限制访问。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-server
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              env: production
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 3306
    - to: []
      ports:
        - protocol: TCP
          port: 53
```

**常见 NetworkPolicy 模式：**

| 模式                  | 说明                                          |
| --------------------- | --------------------------------------------- |
| 默认拒绝所有入站      | `policyTypes: [Ingress]`，不定义 ingress 规则 |
| 默认拒绝所有出站      | `policyTypes: [Egress]`，不定义 egress 规则   |
| 允许特定标签 Pod 访问 | `podSelector` 匹配                            |
| 允许特定命名空间访问  | `namespaceSelector` 匹配                      |

> 注意：NetworkPolicy 需要支持它的 CNI 插件（如 Calico、Cilium），Flannel 不支持。

---

## 7. 存储体系

### 7.1 存储架构总览

```
Volume（Pod 级别，随 Pod 生命周期）
├── emptyDir     临时存储，Pod 删除即丢失
├── hostPath     挂载宿主机路径
├── configMap    挂载配置
├── secret       挂载密钥
└── PVC          挂载持久化存储

PV / PVC（集群级别，独立于 Pod 生命周期）
├── PV  持久化存储卷（管理员创建或 StorageClass 动态分配）
└── PVC 持久化存储声明（用户申请）

StorageClass（存储类，定义动态分配策略）
```

### 7.2 Volume 类型

**emptyDir：**

```yaml
volumes:
  - name: cache-volume
    emptyDir:
      medium: Memory
      sizeLimit: 256Mi
```

| 场景         | 说明                      |
| ------------ | ------------------------- |
| 缓存         | 临时数据缓存              |
| Sidecar 模式 | 主容器与 Sidecar 共享数据 |

**hostPath：**

```yaml
volumes:
  - name: host-volume
    hostPath:
      path: /data
      type: DirectoryOrCreate
```

| type 值           | 说明                 |
| ----------------- | -------------------- |
| DirectoryOrCreate | 路径不存在则创建目录 |
| Directory         | 路径必须已存在       |
| FileOrCreate      | 文件不存在则创建     |
| File              | 文件必须已存在       |

> hostPath 仅用于开发测试，生产环境不推荐使用。

### 7.3 PV 与 PVC

**PV（PersistentVolume）：**

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs
  nfs:
    server: 192.168.1.100
    path: /data/share
```

**PVC（PersistentVolumeClaim）：**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: nfs
  resources:
    requests:
      storage: 10Gi
```

**在 Pod 中使用 PVC：**

```yaml
spec:
  containers:
    - name: app
      volumeMounts:
        - name: data
          mountPath: /app/data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: app-pvc
```

**accessModes 访问模式：**

| 模式             | 缩写 | 说明                     |
| ---------------- | ---- | ------------------------ |
| ReadWriteOnce    | RWO  | 单节点读写               |
| ReadOnlyMany     | ROX  | 多节点只读               |
| ReadWriteMany    | RWX  | 多节点读写               |
| ReadWriteOncePod | RWOP | 单 Pod 读写（K8s 1.27+） |

**reclaimPolicy 回收策略：**

| 策略    | 说明                             |
| ------- | -------------------------------- |
| Retain  | 保留 PV 和数据，需手动清理       |
| Delete  | 删除 PV 和底层存储               |
| Recycle | 已弃用，执行 `rm -rf` 后重新可用 |

### 7.4 StorageClass（动态存储分配）

StorageClass 免去了管理员手动创建 PV 的工作，PVC 可自动匹配并动态创建 PV。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  fsType: ext4
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

**常见 Provisioner：**

| 云平台/存储 | Provisioner                  |
| ----------- | ---------------------------- |
| AWS EBS     | kubernetes.io/aws-ebs        |
| GCE PD      | kubernetes.io/gce-pd         |
| Azure Disk  | kubernetes.io/azure-disk     |
| NFS         | nfs.csi.k8s.io / nfs-client  |
| Local       | kubernetes.io/no-provisioner |

**PVC 使用 StorageClass：**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  storageClassName: fast-ssd
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

---

## 8. 调度机制

### 8.1 调度流程

```
Pod 创建 → API Server → Scheduler → 过滤（Filter）→ 打分（Score）→ 绑定（Bind）→ kubelet 启动容器
```

1. **过滤**：排除不满足条件的节点（资源不足、不满足亲和性等）
2. **打分**：对剩余节点按策略打分（资源均衡、亲和性权重等）
3. **绑定**：选择最高分节点，将 Pod 绑定到该节点

### 8.2 nodeSelector（简单调度）

通过标签将 Pod 调度到特定节点：

```bash
kubectl label nodes node-1 disktype=ssd
```

```yaml
spec:
  nodeSelector:
    disktype: ssd
```

### 8.3 Node Affinity（节点亲和性）

比 nodeSelector 更灵活，支持表达式和软/硬策略。

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: disktype
                operator: In
                values:
                  - ssd
                  - nvme
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 80
          preference:
            matchExpressions:
              - key: zone
                operator: In
                values:
                  - us-east-1a
```

| 策略         | 说明                                  |
| ------------ | ------------------------------------- |
| required...  | 硬性要求，必须满足，否则 Pod 无法调度 |
| preferred... | 软性偏好，尽量满足，不满足也可调度    |

| operator     | 说明                  |
| ------------ | --------------------- |
| In           | 标签值在给定列表中    |
| NotIn        | 标签值不在给定列表中  |
| Exists       | 标签存在              |
| DoesNotExist | 标签不存在            |
| Gt / Lt      | 标签值大于/小于给定值 |

### 8.4 Pod Affinity / Anti-Affinity（Pod 亲和/反亲和）

将 Pod 调度到与特定 Pod 相同/不同的节点：

```yaml
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              app: cache
          topologyKey: kubernetes.io/hostname
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchLabels:
                app: web-app
            topologyKey: kubernetes.io/hostname
```

**典型场景：**

- Pod Affinity：将 Web 服务和缓存部署在同一节点，减少延迟
- Pod Anti-Affinity：将同一 Deployment 的副本分散到不同节点，提高可用性

### 8.5 Taint 与 Toleration（污点与容忍）

Taint 标记节点"排斥"Pod，Toleration 让 Pod"容忍"污点。

**给节点添加污点：**

```bash
kubectl taint nodes node-1 dedicated=gpu:NoSchedule
kubectl taint nodes node-2 dedicated=gpu:NoExecute
```

**删除污点：**

```bash
kubectl taint nodes node-1 dedicated=gpu:NoSchedule-
```

**Pod 中配置容忍：**

```yaml
spec:
  tolerations:
    - key: 'dedicated'
      operator: 'Equal'
      value: 'gpu'
      effect: 'NoSchedule'
    - key: 'dedicated'
      operator: 'Exists'
      effect: 'NoExecute'
      tolerationSeconds: 3600
```

**effect 效果：**

| effect           | 说明                                 |
| ---------------- | ------------------------------------ |
| NoSchedule       | 不调度新 Pod                         |
| PreferNoSchedule | 尽量不调度（软性）                   |
| NoExecute        | 不调度新 Pod，且驱逐已有不容忍的 Pod |

**常见场景：**

- 专用节点（GPU 节点只运行 GPU 任务）
- Master 节点默认有 `node-role.kubernetes.io/control-plane:NoSchedule` 污点
- 节点故障时自动添加 `node.kubernetes.io/not-ready:NoExecute` 污点

---

## 9. RBAC 与安全

### 9.1 RBAC 核心概念

RBAC（Role-Based Access Control）基于角色的访问控制。

```
Subject（谁）──→ RoleBinding ──→ Role（能做什么）
                                  ↑
               ClusterRoleBinding ── ClusterRole
```

| 对象               | 作用范围   | 说明                               |
| ------------------ | ---------- | ---------------------------------- |
| Role               | 命名空间内 | 定义命名空间内的权限               |
| ClusterRole        | 集群范围   | 定义集群级权限                     |
| RoleBinding        | 命名空间内 | 将 Subject 绑定到 Role/ClusterRole |
| ClusterRoleBinding | 集群范围   | 将 Subject 绑定到 ClusterRole      |

### 9.2 Role 与 RoleBinding 示例

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
  - apiGroups: ['']
    resources: ['pods', 'pods/log']
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['']
    resources: ['pods/exec']
    verbs: ['create']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
  - kind: User
    name: dev-user
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### 9.3 ClusterRole 示例

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
  - apiGroups: ['']
    resources: ['secrets']
    verbs: ['get', 'list', 'watch']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
  - kind: ServiceAccount
    name: vault-agent
    namespace: security
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

### 9.4 SecurityContext

Pod/容器级别的安全配置：

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
    - name: web-app
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
          add:
            - NET_BIND_SERVICE
```

| 字段                     | 说明                   |
| ------------------------ | ---------------------- |
| runAsNonRoot             | 必须以非 root 用户运行 |
| runAsUser                | 指定运行用户 UID       |
| readOnlyRootFilesystem   | 根文件系统只读         |
| capabilities             | Linux 能力控制         |
| allowPrivilegeEscalation | 禁止提权               |

### 9.5 ResourceQuota 与 LimitRange

**ResourceQuota（命名空间级资源配额）：**

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    requests.cpu: '10'
    requests.memory: 20Gi
    limits.cpu: '20'
    limits.memory: 40Gi
    pods: '50'
    services: '10'
    persistentvolumeclaims: '20'
```

**LimitRange（默认资源限制）：**

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: production
spec:
  limits:
    - type: Container
      default:
        cpu: '500m'
        memory: '256Mi'
      defaultRequest:
        cpu: '100m'
        memory: '128Mi'
      max:
        cpu: '2'
        memory: '2Gi'
      min:
        cpu: '50m'
        memory: '64Mi'
```

---

## 10. 从 Docker Compose 迁移到 K8s

### 10.1 Kompose 工具

```bash
curl -L https://github.com/kubernetes/kompose/releases/download/v1.28.0/kompose-linux-amd64 -o kompose
chmod +x kompose && sudo mv kompose /usr/local/bin/

kompose convert -f docker-compose.yml
kompose up -f docker-compose.yml
```

### 10.2 手动迁移对照

| Docker Compose | Kubernetes                                    |
| -------------- | --------------------------------------------- |
| `service`      | Deployment + Service                          |
| `depends_on`   | 无直接对应，需用 initContainer 或健康检查     |
| `volumes`      | PV / PVC                                      |
| `environment`  | ConfigMap / Secret                            |
| `networks`     | Namespace / NetworkPolicy                     |
| `ports`        | Service（NodePort / LoadBalancer）            |
| `restart`      | `restartPolicy`（Always / OnFailure / Never） |
| `build`        | Dockerfile → 镜像构建 → Deployment            |
| `healthcheck`  | livenessProbe / readinessProbe                |

---

## 11. Helm 包管理

Helm 是 K8s 的包管理器，类似于 apt/yum，用于管理应用的部署模板（Chart）。

### 11.1 核心概念

- **Chart**：应用模板包，包含 K8s 资源 YAML 模板
- **Release**：Chart 的一次安装实例
- **Repository**：Chart 仓库

### 11.2 常用命令

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami   # 添加仓库
helm repo update                                            # 更新仓库索引
helm search repo nginx                                      # 搜索 Chart
helm install my-nginx bitnami/nginx                         # 安装应用
helm list                                                   # 查看已安装的 Release
helm upgrade my-nginx bitnami/nginx                         # 升级应用
helm rollback my-nginx 1                                    # 回滚到版本 1
helm uninstall my-nginx                                     # 卸载应用
helm status my-nginx                                        # 查看 Release 状态
helm history my-nginx                                       # 查看 Release 历史
```

### 11.3 自定义 values.yaml

```bash
helm install my-nginx bitnami/nginx -f values.yaml
helm install my-nginx bitnami/nginx --set service.type=NodePort
```

### 11.4 Chart 目录结构

```
my-chart/
├── Chart.yaml          # Chart 元信息（名称、版本、依赖）
├── values.yaml         # 默认配置值
├── charts/             # 依赖的子 Chart
├── templates/          # K8s 资源模板
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # 可复用的模板片段
│   └── NOTES.txt       # 安装后显示的提示信息
└── .helmignore         # 打包时忽略的文件
```

---

## 12. 本地集群搭建

| 工具     | 说明                            |
| -------- | ------------------------------- |
| minikube | 单节点 K8s 集群，适合学习       |
| kind     | 用 Docker 容器模拟多节点集群    |
| k3s      | 轻量级 K8s 发行版，适合边缘计算 |
| kubeadm  | 官方集群初始化工具，适合生产    |

### 12.1 minikube 快速上手

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

minikube start
minikube status
minikube dashboard
minikube stop
minikube delete

minikube addons enable ingress
minikube addons enable metrics-server
```

### 12.2 kind 快速上手

```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/

kind create cluster --name my-cluster
kind get clusters
kind delete cluster --name my-cluster
```

**多节点集群配置（kind-config.yaml）：**

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

```bash
kind create cluster --config kind-config.yaml
```

---

## 13. 故障排查指南

### 13.1 Pod 排查流程

```
Pod 状态异常
├── Pending → 检查资源是否充足、PVC 是否绑定、调度约束
├── CrashLoopBackOff → 查看日志、检查探针配置、资源限制
├── ImagePullBackOff → 检查镜像名/标签、镜像仓库认证
├── OOMKilled → 增加 memory limits
└── Completed → 正常退出（Job 类型）
```

### 13.2 常用排查命令

```bash
kubectl describe pod <name>                  # 查看事件和状态
kubectl logs <name> [-f] [-p]                # 查看日志（-p 查看上次容器日志）
kubectl get events --field-selector involvedObject.name=<name>
kubectl get pod <name> -o yaml               # 查看完整 YAML
kubectl top pod <name>                       # 查看资源使用
kubectl get pod <name> -o jsonpath='{.status.containerStatuses[0].state}'
```

### 13.3 常见错误与解决

| 错误                   | 原因           | 解决方案                                |
| ---------------------- | -------------- | --------------------------------------- |
| ImagePullBackOff       | 镜像拉取失败   | 检查镜像名/标签，配置 imagePullSecrets  |
| CrashLoopBackOff       | 容器启动后崩溃 | 查看 `kubectl logs`，检查启动命令和探针 |
| OOMKilled              | 内存超限       | 增大 resources.limits.memory            |
| Pending                | 无法调度       | 检查节点资源、PVC 绑定、亲和性/污点     |
| Lost connection        | 节点失联       | 检查 kubelet 状态、网络连通性           |
| ContainerCreating 卡住 | 挂载/配置问题  | 检查 PVC、ConfigMap、Secret 是否存在    |

### 13.4 节点排查

```bash
kubectl describe node <name>                 # 查看节点详情和资源分配
kubectl top node                             # 查看节点资源使用
kubectl get nodes -o wide                    # 查看节点状态和版本
journalctl -u kubelet -f                     # 查看 kubelet 日志
```

### 13.5 网络排查

```bash
kubectl get endpoints <service-name>         # 检查 Service 是否关联 Pod
kubectl run debug --image=busybox --rm -it -- wget -qO- <service-name>:<port>
kubectl run debug --image=busybox --rm -it -- nslookup <service-name>
kubectl get networkpolicy -A                 # 检查是否有 NetworkPolicy 阻断
```

---

## 14. 学习路线

```
1. 搭建本地集群（minikube / kind）
──→ 2. 掌握核心对象（Pod/Deployment/Service）
──→ 3. 学习 YAML 声明式管理
──→ 4. 理解 Pod 生命周期与健康检查
──→ 5. 理解网络与存储
──→ 6. 掌握调度机制（亲和性/污点/容忍）
──→ 7. RBAC 与安全
──→ 8. Helm 包管理
──→ 9. 生产级实践（监控/日志/CI/CD）
```

---

## 📚 推荐学习资源

| 资源                                                                           | 说明                       |
| ------------------------------------------------------------------------------ | -------------------------- |
| [K8s 官方文档](https://kubernetes.io/docs/)                                    | 最权威的参考手册           |
| [Kubernetes 权威指南](https://book.douban.com/subject/35424872/)               | 中文经典书籍               |
| [K8s 官方交互式教程](https://kubernetes.io/docs/tutorials/kubernetes-basics/)  | 在线动手实践               |
| [Helm 官方文档](https://helm.sh/docs/)                                         | Helm 包管理参考            |
| [K8s The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) | 手动搭建集群，深入理解原理 |
