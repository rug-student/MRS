<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Report;
use App\Models\Answer;
use App\Models\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Controller class that handles the api calls for reports
 */

class ReportsController extends Controller
{
    /**
     * Gets all reports in the database with various filters.
     */
    public function getAllReports(Request $request) {

        $query = Report::with("response");

        if ($request->status != null) {
            $query->where("status", $request->status);
        }

        if ($request->priority != null) {
            $query->where("priority", $request->priority);
        }

        $reports = $query->get();

        return response()->json($reports, 200);
    }

    /**
     * Gets a single report based on id.
     */
    public function getReport(Request $request) {

        $report = Report::where("id", $request->id)
        ->with("response")
        ->get();

        return response()->json($report, 200);
    }

    /**
     * Creates a new report.
     */
    public function createReport(Request $request) {

        $report = new Report;
        $report->description = $request->description;
        $report->status = 0;
        $report->submitter_email = $request->submitter_email;
        $report->priority = -1;

        // Handle responses.
        $report->save();
        foreach($request->responses as $response_body) {
            // Error handling
            if(!Question::where("id", $response_body["question_id"])->exists()) {
                return response()->json("ERROR: passed non-existing question", 404);
            }
            if(!Answer::where("id", $response_body["answer_id"])->exists()) {
                return response()->json("ERROR: passed non-existing answer", 404);
            }
            $answer = Answer::find($response_body["answer_id"]);
            if($answer->question_id != $response_body["question_id"]) {
                return response()
                ->json("ERROR: passed non-related question answer pair", 404);
            }

            $response = new Response();
            $response->question_id = $response_body["question_id"];
            $response->answer_id = $response_body["answer_id"];
            $response->report_id = $report->id;
            $response->save();

            $report->response()->save($response);
        }

        $report->save();
        return response()->json(["Succesfully saved report", $report], 200);
    } 
}