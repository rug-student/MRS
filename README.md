# MRS
Malfunction report system for Gomibo's maintaiance team in Groningen.

## Prequisites
For the backend, you need:
- [php ^8.1](https://www.php.net/manual/en/install.php)
With php extensions and modules
- [composer](https://getcomposer.org/download/)
- [php-mysql] (sudo apt install php-mysql)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)

## Deployment
Make sure you meet all the [prequisites](#prequisites) to deploy the application.
### The setup
first off, you want to run the `setup.sh`.
```
bash setup.sh
```
### Database migration
To setup the database, follow the steps:
1. Start with the following command.
```
cd backend/
./vendor/bin/sail up mysql phpmyadmin -d
# starts docker container with mysql db and phpmyadmin db manager.
```
2. Wait until the database is ready to accept connections. See docker container logs to know when ready.
3. Migrating the database:
```
# execute in backend/
php artisan migrate
```

### Database seeding
In case you want to start with a test user.
```
# execute in backend/
php artisan db:seed
```

### start backend
```
# execute in backend/
./vendor/bin/sail up mysql phpmyadmin -d 
php artisan serve
```

### start frontend
```
# execute in frontend/
npm start
```


## Testing:
### Backend and API tests

Ensure that the database is running.
```
# execute in backend/
php artisan migrate --database=testing
php artisan test
```

1. `./vendor/bin/sail up mysql phpmyadmin`
2. `./vendor/bin/phpunit`
