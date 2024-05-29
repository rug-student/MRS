<?php

use App\Http\Controllers\AnswersController;
use App\Http\Controllers\QuestionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Routes for reports endpoints.
Route::get("/reports", [ReportsController::class, "getAllReports"]);
Route::post("/reports", [ReportsController::class, "createReport"]);
Route::get("/reports/{id}", [ReportsController::class, "getReport"]);
Route::patch("/reports/{id}", [ReportsController::class, "updateReport"]);

// Routes for questions endpoints.
Route::get("/questions", [QuestionsController::class, "getAllQuestions"]);
Route::post("/questions", [QuestionsController::class, "createQuestion"]);
Route::patch("/questions/{id}", [QuestionsController::class, "updateQuestion"]);

// Routes for answers endpoints.
Route::post("/answers", [AnswersController::class, "createAnswer"]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
