<?php

use App\Http\Controllers\AnswersController;
use App\Http\Controllers\QuestionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportsController;
use App\Models\Question;

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
Route::get("/reports/{id}", [ReportsController::class, "getReport"]);
Route::post("/reports", [ReportsController::class, "createReport"]);

// Routes for questions endpoints.
Route::get("/questions", [QuestionsController::class, "getAllQuestions"]);
Route::get("/questions/{id}", [QuestionsController::class, "getQuestion"]);
Route::post("/questions", [QuestionsController::class, "createQuestion"]);
Route::patch("/questions/{id}", [QuestionsController::class, "updateQuestion"]);
Route::delete("/questions/{id}", [QuestionsController::class, "deleteQuestion"]);

// Routes for answers endpoints.
Route::put("answers/{id}", [AnswersController::class, "updateAnswer"]);
Route::post("answers/", [AnswersController::class, "createAnswer"]);
