FROM php:8.2-fpm

RUN apt update && apt install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev
RUN apt clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer




# copies backend files to current working dir
WORKDIR /var/www
COPY . .

RUN composer update
RUN php artisan key:generate
# RUN php artisan migrate

EXPOSE 80 
# Setup laravel to run on startup
CMD ["php", "artisan", "serve" ]
