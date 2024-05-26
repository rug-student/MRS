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
        if(!$question->isEmpty()) {
            return response()->json($question, 200);
        } else {
            return response()->json("Question not found", 404);
        }
    }

    /**
     * Creates a new question and stores it to the database.
     */
    public function createQuestion(Request $request) {
        $request_content = json_decode($request->getContent());
        
        $validated = $request->validate([
            'question_description' => 'required',
            'is_open' => 'required|boolean',
        ]);

        $question = new Question;
        $question->question_description = $request->question_description;
        $question->is_open = $request->is_open;
        $question->is_active = true; // defaults to be active
        $question->save();

        if (property_exists($request_content, "answers")){
            foreach($request_content->answers as $answer_str) {
                if($answer_str == "") {
                    $question->answer()->delete();
                    $question->delete();
                    return response()->json("ERROR: answer is null", 400);
                }
                $answer = new Answer();
                $answer->answer = $answer_str;
                $answer->question_id = $question->id;
                $answer->save();

                $question->answer()->save($answer);
            }
        }

        $question->save();
        return response()->json(["Question saved succesfully.", $question], 200);
    }

    public function updateQuestion(Request $request) {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $question = Question::find($request->id);
        $question->is_active = $request->is_active;
        $question->save();

        return response()->json(["Question updated succesfully.", $question], 200);
    }
}
