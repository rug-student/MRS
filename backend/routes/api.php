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
//->middleware('auth');
Route::get("/reports/{id}", [ReportsController::class, "getReport"]);
//->middleware('auth');
Route::post("/reports", [ReportsController::class, "createReport"]);

// Routes for questions endpoints.
Route::get("/questions", [QuestionsController::class, "getAllQuestions"]);
//->middleware('auth');
Route::get("/questions/{id}", [QuestionsController::class, "getQuestion"]);
//->middleware('auth');
Route::post("/questions", [QuestionsController::class, "createQuestion"]);
//->middleware('auth');
Route::patch("/questions/{id}", [QuestionsController::class, "updateQuestion"]);
//->middleware('auth');
Route::delete("/questions/{id}", [QuestionsController::class, "deleteQuestion"]);
//->middleware('auth');

// Routes for answers endpoints.
Route::put("/answers/{id}", [AnswersController::class, "updateAnswer"]);
//->middleware('auth');
Route::post("/answers", [AnswersController::class, "createAnswer"]);
//->middleware('auth');

//Route::post("login/", [Login])