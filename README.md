# ticketing-jwt-rabbitmq-k8
### This is copy of `ticketing-jwt-nats-k8` only one difference in this instead of NATS, I have used RabbitMQ

#### Created iamges
```
docker build -f Dockerfile_prod -t rmq-auth-app:1.0 .
docker build -f Dockerfile_prod -t rmq-expiration-app:1.0 .
docker build -f Dockerfile_prod -t rmq-orders-app:1.0 .
docker build -f Dockerfile_prod -t rmq-payments-app:1.0 .
docker build -f Dockerfile_prod -t rmq-tickets-app:1.0 .
docker build -t rmq-client-app:1.0 .
```