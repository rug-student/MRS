# MRS
Malfunction report system for Gomibo



## First time startup
open the terminal in this folder and start the docker containers

```
docker compose up
```
To initialize the database tables
```
docker exec mrs-backend-laravel-1 php artisan migrate
```

## Normal startup
```
docker compose up
```
