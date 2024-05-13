# MRS Backend


## Prerequisites
- php ^8.1 (sudo apt install php)
- composer   (https://getcomposer.org/download/)
- php-mysql (sudo apt install php-mysql)
- docker desktop

## How to run
first off, setup .env file, composer and php key by:
```
cd backend/
cp .env.example .env
composer update
php artisan key:generate
```

You will need to migrate both the production and testing databases:
1. `php artisan migrate`
2. `php artisan migrate --database=testing`

### Development mode:
1. `./vendor/bin/sail up mysql phpmyadmin`
2. `php artisan serve`

### Tests:
1. `./vendor/bin/sail up mysql phpmyadmin`
2. `./vendor/bin/phpunit`

### Full docker deployment:
1. `./vendor/bin/sail up`

## How to view database using phpMyAdmin:
1. go to `localhost:8001`
2. login with credentials in `.env` file (default username=`root`, empty password)
    