# MRS
Malfunction report system for Gomibo's maintaiance team in Groningen.

## Prequisites
For the backend, you need:
- [php 8.1](https://www.php.net/manual/en/install.php)
  - php8.1-curl
  - php8.1-xml
  - php8.1-mysql
  - php8.1-mbstring
  - [php-gd](https://www.php.net/manual/en/book.image.php)
- [composer](https://getcomposer.org/download/)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)

For the frontend, you need:
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

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

For coverage value analysis install:
- [php-pcov](https://github.com/krakjoe/pcov/blob/develop/INSTALL.md)

### Backend and API tests

Ensure that the database is running.
```
# execute in backend/
php artisan migrate --database=testing
php artisan test
```
For coverage analysis execute:
```
php artisan test --coverage
```