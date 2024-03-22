<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionsController extends Controller
{
    /**
     * Gets all questions in the database.
     */
    public function getAllQuestions(Request $request)
    {
        if($request->active == "true") {
            $questions = Question::where("is_active", "=", true);
            print("getting active questions");
        } else {
            $questions = Question::all();
            print("getting all questions");
        }

        response()->json($questions, 200);
    }

    /**
     * Creates a new question and stores it to the database.
     */
    public function createQuestion(Request $request)
    {
        $question = new Question();

        $question->description = $request->question_description;

        // when creating a new question it default to being active
        $question->is_active = true;

        $question->is_open = $request->is_open;

        if($request->is_open == "true") {
            $question->is_open = true;
        } else {
            $question->is_open = false;

            //handle multiple choice answers
            foreach($request->answers as $answer) {
                $question->potential_answer = $answer;
            }
        }

        $question->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
