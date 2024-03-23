<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionsController extends Controller
{
    /**
     * Gets all questions in the database.
     */
    public function getAllQuestions(Request $request)
    {
        if($request->active == "true") {
            $questions = Question::with('answer')->where("is_active", true)->get();

        } else if($request->active == "false") {
            $questions = Question::with('answer')->where("is_active", false)->get();

        } else {
            $questions = Question::with('answer')->where("is_active", false)->get();
        }

        return response()->json($questions, 200);
    }

    /**
     * Creates a new question and stores it to the database.
     */
    public function createQuestion(Request $request)
    {
        $question = new Question;

        $question->question_description = $request->question_description;

        // when creating a new question it default to being active
        $question->is_active = true;

        $question->is_open = $request->is_open;

        if($request->is_open == true) {
            $question->is_open = true;
        } else {
            //handle multiple choice answers
            $question->is_open = false;
      
            //intermediate save to generate an id 
            //(really ugly but know of no better option)
            $question->save();
            foreach($request->answers as $answer_str) {
                $answer = new Answer();
                $answer->answer = $answer_str;
                $answer->question_id = $question->id;
                $answer->save();

                $question->answer()->save($answer);
            }
        }
        $question->save();
        return response()->json("Question saved succesfully", 200);
    }

}
