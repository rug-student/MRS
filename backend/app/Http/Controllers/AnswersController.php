<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;

class AnswersController extends Controller
{
    /**
     * Update an Answer.
     */
    public function updateAnswer(Request $request) {
        $answer = Answer::find($request->id);

        if($answer) {
            $answer->answer = $request->answer;
            $answer->save();
            return response()->json(["succesfully saved answer", $answer], 200);
        } else {
            return response()->json("Answer not found.", 404);
        }

    }


    /**
     * Create a new Answer.
     */
    public function createAnswer(Request $request) {
        $answer = new Answer;

        $request->validate([
            "answer" => "required",
            "question_id" => "required"
        ]);

        $answer->answer = $request->answer;
        $answer->question_id = $request->question_id;
        $answer->save();
        return response()->json(["succesfully created answer", $answer], 200);
    }
}
