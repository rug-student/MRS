<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Report;
use App\Models\Answer;
use App\Models\File;
use App\Models\User;
use App\Models\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Controller class that handles the api calls for reports
 */

class ReportsController extends Controller
{
    /**
     * Gets all reports in the database with various filters.
     */
    public function getAllReports(Request $request) {

        $query = DB::table('reports');

        if ($request->status != null) {
            $query->where("status", $request->status);
        }

        if ($request->priority != null) {
            $query->where("priority", $request->priority);
        }

        if($request->order == "asc") {
            $order = "asc";
        } else {
            $order = "desc";
        }

        if($request->sort == "status") {
            $sort = "status";
        } elseif($request->sort == "priority") {
            $sort = "priority";
        } else {
            $sort = "created_at";
        }

        $query->orderBy($sort, $order);
        $reports = $query->paginate(10);

        return response()->json($reports, 200);
    }

    /**
     * Gets a single report based on id.
     */
    public function getReport(Request $request) {

        $report = Report::where("id", $request->id)
        ->with(["response.question", "response.answer", "file"])
        ->get();

        if($report->isEmpty()) {
            return response()->json("ERROR: Resource not found.", 404);
        }

        return response()->json($report, 200);
    }

    /**
     * Creates a new report.
     */
    public function createReport(Request $request) {
        $request_content = json_decode($request->getContent());

        $validated = $request->validate([
            'description' => 'required',
            'submitter_email'=> 'email',
        ]);

        $report = new Report;
        $report->description = $request->description;
        $report->status = 0;
        $report->submitter_email = $request->submitter_email;
        $report->priority = -1;
        $report->save();

        // Handle responses.
        if (property_exists($request_content, "responses")){
            foreach($request_content->responses as $response_body) {
                // Error handling
                if(!Question::where("id", $response_body->question_id)->exists()) {
                    return response()->json("ERROR: passed non-existing question", 400);
                }
                if(!Answer::where("id", $response_body->answer_id)->exists()) {
                    return response()->json("ERROR: passed non-existing answer", 400);
                }
                $answer = Answer::find($response_body->answer_id);
                if($answer->question_id != null && $answer->question_id != $response_body->question_id) {
                    return response()
                    ->json("ERROR: passed non-related question answer pair", 400);
                }

                $response = new Response();
                $response->question_id = $response_body->question_id;
                $response->answer_id = $response_body->answer_id;
                $response->report_id = $report->id;
                $response->save();

                $report->response()->save($response);
            }
        }

        // Handle files.
        if (property_exists($request_content, "files")) {
            foreach($request_content->files as $file_body) {
                if($file_body->file_path == "") {
                    return response()->json("ERROR: file_path is missing", 400);
                }

                $file = new File();
                $file->file_path = $file_body->file_path;
                $file->report_id = $report->id;
                $file->save();

                $report->file()->save($file);
            }
        }

        $report->save();
        return response()->json(["Succesfully saved report", $report], 200);
    }

    /**
     * Updates a reports status and/or priority.
     */
    public function updateReport(Request $request) {
        $validated = $request->validate([
            'status' => 'required',
            'priority'=> 'required',
        ]);

        if(!Report::where("id", $request->id)->exists()) {
            return response()->json("ERROR: report of given report id does not exist", 400);
        }
        $report = Report::find($request->id);
        $report->status = $request->status;
        $report->priority = $request->priority;
        $report->save();

        if ($request->user_id != null){
            // Error handling
            if(!User::where("id", $request->user_id)->exists()) {
                return response()->json("ERROR: passed non-existing user id", 400);
            }
            $user = User::find($request->user_id);
            $user->reports()->save($report);
            $user->save();
        }


        return response()->json(["Report updated succesfully.", $report], 200);
    }

}
