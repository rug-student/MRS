<?php

namespace App\Http\Controllers;

use App\Mail\StatusChanged;
use App\Models\Question;
use App\Models\Report;
use App\Models\Answer;
use App\Models\File;
use App\Models\User;
use App\Models\Response;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Controller class that handles the api calls for reports
 */

class ReportsController extends Controller
{

    /**
     * Tries to send a mail to notify reporter, if asked for.
     * @return boolean boolean value denoting if the email was sent without errors.
     */
    protected function sendMail($report, $oldStatus) {
        if($report->notify_submitter && $oldStatus != $report->status) {
            try {
                Log::channel('abuse')->info('sending email', [
                    'destination email' => $report->submitter_email,
                    'old status' => $oldStatus,
                    'new status' => $report->status
                ]);
                Mail::to($report->submitter_email)->send(new StatusChanged($report, $oldStatus));
                return true;
            } catch(Exception $e) {
                return false;
            };
            
        }
    }

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
        ->with(["response.question", "response.answer", "files"])
        ->first();

        if(!$report) {
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
            'notify_submitter' => 'required |boolean'
        ]);

        $report = new Report;
        $report->description = $request->description;
        $report->status = 0;
        $report->submitter_email = $request->submitter_email;
        $report->notify_submitter = $request->notify_submitter;
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
                    return response()->json("ERROR: passed non-related question answer pair", 400);
                }

                $response = new Response();
                $response->question_id = $response_body->question_id;
                $response->answer_id = $response_body->answer_id;
                $response->report_id = $report->id;
                $response->save();

                $report->response()->save($response);
            }
        }
    
        return response()->json(["Successfully saved report", $report], 200);
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
        $oldStatus = $report->status;
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

        if($this->sendMail($report, $oldStatus)) {
            $response = response()->json(["Report updated succesfully. Update mail succesfully send.", $report], 200);
        } else if($report->notify_submitter){
            $response = response()->json(["Report updated succesfully. However, update mail did not send.", $report], 200);
        } else {
            $response = response()->json(["Report updated succesfully.", $report], 200);
        }
        return $response;
    }

}
