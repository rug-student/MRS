<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;

class AnswersController extends Controller
{
    /**
     * Create a new Answer.
     */
    public function createAnswer(Request $request) {
        $answer = new Answer;

        $request->validate([
            "answer" => "required"
        ]);

        if ($request->question_id == null) {
            $answer->answer = $request->answer;
            $answer->save();
        } else {
            if(!Question::where("id", $request->question_id)->exists()) {
                return response()->json("ERROR: passed non-existing question", 400);
            }
            $answer->answer = $request->answer;
            $answer->question_id = $request->question_id;
            $answer->save();
        }
        return response()->json(["succesfully created answer", $answer], 200);
    }
}
