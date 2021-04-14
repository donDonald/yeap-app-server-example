#!/bin/bash

ID=$1

curl -k -d "id=$ID" -X DELETE http://localhost:3000/api/orders/delete
