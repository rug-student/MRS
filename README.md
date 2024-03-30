# MRS
Malfunction report system for Gomibo



## First time startup

Copy the `.env.example` file and rename it to `.env` for both in the main directory and the `./backend` directory.


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
