<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;

class AnswersController extends Controller
{
    /**
     * Update an Answer. (Used for open questions)
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

}
