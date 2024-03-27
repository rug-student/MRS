<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Exception;
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
            $questions = Question::with('answer')->get();
        }

        return response()->json($questions, 200);
    }

    /**
     * Gets a single question based on id.
     */
    public function getQuestion(Request $request) {

        $question = Question::with("answer")
        ->where("id", $request->id)
        ->get();

        return response()->json($question, 200);
    }

    /**
     * Creates a new question and stores it to the database.
     */
    public function createQuestion(Request $request) {
        $question = new Question;

        $question->question_description = $request->question_description;

        // When creating a new question it defaults to being active.
        $question->is_active = true;

        $question->is_open = $request->is_open;

        $question->save();
        if($request->is_open == true) {
            // Handle open answer.
            $question->is_open = true;
            $answer = new Answer();
            $answer->answer = "";
            $answer->question_id = $question->id;
            $answer->save();

            $question->answer()->save($answer);
        } else {
            // Handle mc answers.
            $question->is_open = false;
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

    public function updateQuestion(Request $request) {
        $question = Question::find($request->id);
        $question->is_active = $request->is_active;
        $question->save();

        return response()->json(["Question updated succesfully.", $question], 200);
    }

    public function deleteQuestion(Request $request) {
        try {
            Question::destroy($request->id);
            return response()->json("Question deleted succesfully.", 200);
        } catch(Exception $e) {
            echo "error: ", $e->getMessage(), "\n";
            return response()->json("Error: "+ $e->getMessage(), 404);
        }
    }

}
