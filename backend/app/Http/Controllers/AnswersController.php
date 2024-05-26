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

        $request->validate([
            "answer" => "required"
        ]);

        $answer = new Answer;
        $answer->answer = $request->answer;

        /* Uncomment to allow for post answer endpoint add question_id as foreign id in the answer entry to the database.
        if ($request->question_id != null) {
            if(!Question::where("id", $request->question_id)->exists()) {
                return response()->json("ERROR: passed non-existing question", 400);
            }
            $answer->question_id = $request->question_id;
        }
        */

        $answer->save();
        return response()->json(["succesfully created answer", $answer], 200);
    }
}
