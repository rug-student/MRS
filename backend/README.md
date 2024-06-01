# MRS Backend


## Prerequisites
- php ^8.1 (sudo apt install php)
- composer   (https://getcomposer.org/download/)
- php-mysql (sudo apt install php-mysql)
- docker desktop

## How to run
### The setup
first off, setup .env file, composer and php key by:
```
cd backend/
cp .env.example .env
composer update
php artisan key:generate
```
To migrate both the production and testing databases the database needs to be up and running.
```
./vendor/bin/sail up mysql phpmyadmin
```
Migrating the database:
```
php artisan migrate
php artisan migrate --database=testing
```

### start php
```
php artisan serve
```


### Tests:
1. `./vendor/bin/sail up mysql phpmyadmin`
2. `./vendor/bin/phpunit`

### Full docker deployment:
1. `./vendor/bin/sail up`

## How to view database using phpMyAdmin:
1. go to `localhost:8001`
2. login with credentials in `.env` file (default username=`root`, empty password)

## Additional information

### Mailing
This application has the capability to automatically send emails to reporters who choose to receive so. To enable this a mailing host is required. To enable mailing please set the correct values in the `.env` file for `MAIL_HOST`, `MAIL_PORT`,`MAIL_USERNAME` and `MAIL_PASSWORD` corresponding to those of your host.