<?php

use App\Http\Controllers\QuestionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportsController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes for reports endpoints.
Route::get("/reports", [ReportsController::class, "getAllReports"]);
Route::post("/reports", [ReportsController::class, "createReport"]);

// Routes for questions endpoints.
Route::get("/questions", [QuestionsController::class, "getAllQuestions"]);
Route::post("/questions", [QuestionsController::class, "createQuestion"]);