# Dapr Hello-Kubernetes
Kubernetes 환경에서 dapr를 구성한다.
dapr의 quickstart에서 Hello-kubernetes에 nodegateway와 node로 Application 을 만들어서 변형해보았다. 


# Requireents
redis 설치가 필요함. 설치후에 redis의 설정을 바꾸어줘야 함. 
(https://docs.dapr.io/getting-started/configure-state-pubsub/)[https://docs.dapr.io/getting-started/configure-state-pubsub/]


# 구조
nodegateway: nodeapp1, nodeapp2로 서비스를 전달한다.
- /order/* : nodeapp1
- /neworder/* : nodeapp2

# API 설명
API를 간략하게 설명해보겠다. 자세한 내용은 소스를 보면 알 수 있을 것이다. 간단한 Source라서 따로 설명은 하지 않겠다. 

/order/status: nodeapp1의 Status 정보
/newroder/status: nodeapp2의 Status 정보
/gateway/status: nodegateway의 Status 정보


/neworder: nodeapp2를 호춣하고 nodeapp2에서 nodeapp1으로 dapr를 통해서 요청하게 되어 있다. 그러면 nodeapp1에서는 dapr를 이용하여 state에 order저장한다. 

/order: nodeapp1에서 dapr를 통해 state의 정보를 조회 한다.


# Deployment
docker 이미지 생성
각각의 디렉토리 (nodegateway, node1, node2)에서 실행을 하면 Local Docker image가 생성이된다.
```
$ npm run docker-build
```

```
$ cd deploy
$ kubectl apply -f .
```

```
$ kubectl get pods
$ kubectl get service
```

Redis 설치기
Helm을 이용하여 Kubernetes에 설치한다. 


 ```
 NAME: redis
LAST DEPLOYED: Mon Nov  8 13:12:24 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: redis
CHART VERSION: 15.5.4
APP VERSION: 6.2.6

** Please be patient while the chart is being deployed **

Redis&trade; can be accessed on the following DNS names from within your cluster:

    redis-master.default.svc.cluster.local for read/write operations (port 6379)
    redis-replicas.default.svc.cluster.local for read-only operations (port 6379)



To get your password run:

    export REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 --decode)

To connect to your Redis&trade; server:

1. Run a Redis&trade; pod that you can use as a client:

   kubectl run --namespace default redis-client --restart='Never'  --env REDIS_PASSWORD=$REDIS_PASSWORD  --image docker.io/bitnami/redis:6.2.6-debian-10-r21 --command -- sleep infinity

   Use the following command to attach to the pod:

   kubectl exec --tty -i redis-client \
   --namespace default -- bash

2. Connect using the Redis&trade; CLI:
   redis-cli -h redis-master -a $REDIS_PASSWORD
   redis-cli -h redis-replicas -a $REDIS_PASSWORD

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/redis-master 6379:6379 &
    redis-cli -h 127.0.0.1 -p 6379 -a $REDIS_PASSWORD
```

# 테스트하기
각 pod의 상태값을 알아본다.
```
$ curl http://localhost/order/status
$ curl http://localhost/neworder/status
$ curl http://localhost/gateway/status
```
order를 보내고, 그정보를 조회한다. 


# Zipkin
Zipkin을 이용한 모니터링이다. Kubernetes 포트를 포워딩하여 Local에서 브라우저로 확인할 수 있게 한다.
```
$ kubectl port-forward service/zipkin 9411:9411
```

(http://localhost:9411)[http://localhost:9411]을 브라우저에 열어 확인하다.
테스트에서 보낸 정보들을 확인 할 수 있다. 


# 등록된 Application, Service 정리하기
생성한 것들을 모두 정리한다. 

```
$ cd deploy
$ kubectl delete -f .
```


# Refreences
(Dapr Quick Start - Hello Kubernetes)[https://github.com/dapr/quickstarts/tree/v1.4.0/hello-kubernetes]

(Dapr Quick Start - distributerd caculator)[https://github.com/dapr/quickstarts/tree/v1.4.0/distributed-calculator]

(Dapr Quick Start - Observability)[https://github.com/dapr/quickstarts/tree/v1.4.0/observability]

(Redis Installation (State, Pub/Sub))[https://docs.dapr.io/getting-started/configure-state-pubsub/]