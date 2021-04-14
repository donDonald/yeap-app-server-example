#!/bin/bash

ID=$1
NAME=$2
PHONE=$3

curl -k -d "id=$ID&name=$NAME&phone=$PHONE" -X POST http://localhost:3000/api/orders/add
