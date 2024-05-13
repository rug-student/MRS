
# backend setup
cd backend/
cp .env.example .env
composer update
php artisan key:generate
php artisan migrate
php artisan migrate --database=testing
cd ..

# frontend setup
cd frontend/
npm install react-scripts
cd ..