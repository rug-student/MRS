# MRS Backend


## Prerequisites
- php ^8.1 (sudo apt install php)
- composer   (https://getcomposer.org/download/)
- php-mysql (sudo apt install php-mysql)
- docker desktop

## How to run
first off, setup .env file (can copy from .env.example)
assuming you are in /backend, run 
    `composer update`
or
    `php composer.phar update`,
then: `php artisan key:generate`

### development mode:

#### First time:
1. `./vendor/bin/sail up mysql phpmyadmin`
2. `php artisan migrate`
3. `php artisan serve`

#### Normally:
1. `./vendor/bin/sail up mysql phpmyadmin`
2. `php artisan serve`

### full docker:
1. `./vendor/bin/sail up`

### tests: 
1. Dont know yet

## How to view database using phpMyAdmin:
1. go to `localhost:8001`
2. login with credentials in `.env` file (default username=`root`, empty password)
    