<?php

namespace Tests\Feature;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Report;
use App\Models\Response;
use App\Models\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use Tests\TestCase;
use Illuminate\HTtp\UploadedFile;

class ReportsTest extends TestCase
{

    use RefreshDatabase;

    /**
     * FT-RE1
     * Test the get /reports/{id} endpoint with invalid id
     */
    public function test_get_report_invalid_id(): void {
        Sanctum::actingAs(User::factory()->create());
        $response = $this->get('/api/reports/1');
        $response->assertStatus(404);
    }

    /**
     * FT-RE2
     * Tests the retrieval of a created report.
     */
    public function test_get_report(): void {
        Sanctum::actingAs(User::factory()->create());
        $report_body = [
            'description'=>"This is a test report",
            'priority'=>1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl"
        ];
        $report = Report::create($report_body);
        $this->assertDatabaseCount('reports', 1);

        $response = $this->get('/api/reports/'.$report->id);
        $response->assertStatus(200);
        $response->assertSee($report_body);
    }

    /**
     * FT-RE3
     * Test GET /api/reports request on empty database
     */
    public function test_get_reports_on_empty_database(): void {
        Sanctum::actingAs(User::factory()->create());
        $response = $this->get('/api/reports');
        $response->assertStatus(200);
        $response->assertSee('data');

        Report::create([
            'description'=>"This is a test report",
            'priority'=>1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
            'responses'=>[]
        ]);

        $response = $this->get('/api/reports');
        $response->assertStatus(200);
        $response->assertJsonStructure([]);
    }

    /**
     * FT-RE4
     * Test GET /api/reports request on populated database
     */
    public function test_get_reports_on_populated_database(): void {
        Sanctum::actingAs(User::factory()->create());

        $report = Report::create([
            'description'=>"This is a test report",
            'priority'=>0,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
            'responses'=>[]
        ]);

        $response = $this->get('/api/reports');
        $response->assertStatus(200);
        $response->assertSee($report->id);
        $response->assertSee($report->description);
        $response->assertSee($report->submitter_email);
    }

    /**
     * FT-RE5
     * Test POST /reports endpoint with no discription
     */
    public function test_create_report_invalid_payload(): void {

        $malformed_report_payload = [
            'malformed'=>"This is a malformed payload"
            // is missing a discription
        ];

        $request = $this->json('post', '/api/reports', $malformed_report_payload);
        $request->assertStatus(422);
        $this->assertDatabaseCount('reports', 0);
    }

    /**
     * FT-RE6
     * Test POST /reports endpoint with invalid email
     */
    public function test_create_report_invalid_email(): void {
        $malformed_report_payload = [
            'description'=>"This is a malformed payload",
            'submitter_email'=>"not an email address",
        ];

        $request = $this->json('post', '/api/reports', $malformed_report_payload);
        $request->assertStatus(422);
        $this->assertDatabaseCount('reports', 0);
    }

    /**
     * FT-RE7
     * Test POST /reports endpoint for status and priority defaults
     */
    public function test_create_report_default_status_and_priority(): void {

        $report_payload = Report::factory()->make([
            'priority'=>-1,
            'status'=>0,
        ])->toArray();

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('reports', $report_payload);
        $this->assertDatabaseCount('reports', 1);
    }

    /**
     * FT-RE8
     * Test POST /reports endpoint with no responses or files
     */
    public function test_create_report_base(): void {

        $report_payload = Report::factory()->make()->toArray();

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);

        $report_payload['priority'] = -1;
        $report_payload['status'] = 0;

        $this->assertDatabaseHas('reports', $report_payload);
        $this->assertDatabaseCount('reports', 1);
    }


    /**
     * FT-RE9
     * Test POST /reports endpoint with report responses
     */
    public function test_create_report_with_responses(): void {

        $question = Question::create([
            'question_description'=>"This is a question",
            'is_open'=>false,
            'is_active'=>false,
        ]);
        $answer = Answer::create([
            'answer'=>"this is an answer",
            'question_id'=>$question->id
        ]);

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl",
            'notify_submitter'=>false,
            'responses' => [
                '1'=>[
                    "question_id"=> $question->id,
                    "answer_id"=> $answer->id
                ],
            ]
        ];



        $request = $this->json('post', '/api/reports', $report_payload);
        // $this->assertEquals(1,2, json_decode($request->getContent()));
        $request->assertStatus(200);
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseCount('responses', 1);

        $response_body = [
            "question_id"=> $question->id,
            "answer_id"=> $answer->id,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('responses', $response_body);
    }

    /**
     * FT-RE10
     * Tests the retrieval of a single report with responses.
     */
    public function test_get_report_with_responses(): void {
        Sanctum::actingAs(User::factory()->create());

        $report = Report::factory()->create();
        // = [
        //     'description'=>"This is a test report",
        //     'priority'=>1,
        //     'status'=>0,
        //     'submitter_email'=>"test@testing.nl"
        // ];
        // $report = Report::create($report_body);

        // Questions and answer model entities.
        $question = Question::create([
            'question_description'=>"This is a question",
            'is_open'=>false,
            'is_active'=>false,
        ]);
        $answer = Answer::create([
            'answer'=>"this is an answer",
            'question_id'=>$question->id
        ]);

        // response body and model entity
        $response_body = [
            "question_id"=> $question->id,
            "answer_id"=> $answer->id,
            "report_id"=> $report->id
        ];
        $response = new Response();
        $response->question_id = $question->id;
        $response->answer_id = $answer->id;
        $response->report_id = $report->id;
        $report->response()->save($response);


        // Test database entry counts of the following tables
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseCount('questions', 1);
        $this->assertDatabaseCount('answers', 1);
        $this->assertDatabaseCount('responses', 1);

        $response = $this->get('api/reports/'.$report->id);
        $response->assertStatus(200);
        $response->assertSee($report->toArray);
        $response->assertSee($response_body);
    }

    /**
     * FT-RE11
     * Test if updating a report status and priority with invalid payload give expected error.
     */
    public function test_patch_report_invalid_request(): void {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'status' => 8,
            'priority' => 8
        ];

        $response = $this->json('PATCH', "/api/reports/1", $payload);
        $response->assertStatus(400);
    }

    /**
     * FT-RE12
     * Test if updating a report status and priority with valid payload give expected result.
     */
    public function test_patch_report_valid_request(): void {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $status = 777;
        $priority = 888;
        $payload = [
            'status' => $status,
            'priority' => $priority,
            'user_id' => $user->id,
        ];

        $report_body = [
            'description'=>"This is a test report",
            'priority'=>1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
            'notify_submitter' => true,
        ];
        $report = Report::create($report_body);
        $this->assertDatabaseCount('reports', 1);

        $response = $this->json('PATCH', "/api/reports/".$report->id, $payload);
        $response->assertStatus(200);
        $response->assertSee($report->description);
        $response->assertSee($report->submitter_email);
        $response->assertSee($report->user_id);
        $response->assertSee($priority);
        $response->assertSee($status);
    }

    /**
     * FT-RE13
     * Test GET /api/reports request on populated database with status filter.
     */
    public function test_get_reports_with_status_filter(): void {
        Sanctum::actingAs(User::factory()->create());

        $report_body1= [
            'description'=>"This is a unique description with status = 0",
            'priority'=>0,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
        ];
        $report_body2 = [
            'description'=>"This is a test report with status = 1",
            'priority'=>6,
            'status'=>1,
            'submitter_email'=>"test@testing.nl",
        ];
        $report_body3 = [
            'description'=>"This is a very random message",
            'priority'=>10,
            'status'=>2,
            'submitter_email'=>"test@testing.nl",
        ];
        $report1 = Report::create($report_body1);
        $report2 = Report::create($report_body2);
        $report3 = Report::create($report_body3);
        $this->assertDatabaseCount('reports', 3);

        $payload = [
            "status" => "0"
        ];


        $response = $this->json('get', '/api/reports', $payload);
        $response->assertStatus(200);
        // finding unique report with description
        $response->assertSee($report1->description);
        $response->assertDontSee($report2->description);
        $response->assertDontSee($report3->description);
    }

    /**
     * FT-RE14
     * Test GET /api/reports request on populated database with priority filter.
     */
    public function test_get_reports_with_priority_filter(): void {
        Sanctum::actingAs(User::factory()->create());

        $report_body1= [
            'description'=>"This is a unique description with status = 0",
            'priority'=>0,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
        ];
        $report_body2 = [
            'description'=>"This is a test report with status = 1",
            'priority'=>6,
            'status'=>1,
            'submitter_email'=>"test@testing.nl",
        ];
        $report_body3 = [
            'description'=>"This is a very random message",
            'priority'=>10,
            'status'=>2,
            'submitter_email'=>"test@testing.nl",
        ];
        $report1 = Report::create($report_body1);
        $report2 = Report::create($report_body2);
        $report3 = Report::create($report_body3);
        $this->assertDatabaseCount('reports', 3);

        $payload = [
            "priority" => "0"
        ];

        $response = $this->json('get', '/api/reports', $payload);
        $response->assertStatus(200);
        // finding unique report with description
        $response->assertSee($report1->description);
        $response->assertDontSee($report2->description);
        $response->assertDontSee($report3->description);
    }

    /**
     * FT-RE15
     * Test GET /api/reports request with insufficient authorization.
     */
    public function test_get_reports_with_insufficient_authorization(): void {
        $response = $this->json('GET', "/api/reports");
        $response->assertUnauthorized();
    }

    /**
     * FT-RE16
     * Test GET /api/reports/{id} request with insufficient authorization
     */
    public function test_get_report_with_insufficient_authorization(): void {
        $response = $this->json('GET', "/api/reports/1");
        $response->assertUnauthorized();
    }

    /**
     * FT-RE17
     * Test PATCH /api/reports/{id} request with insufficient authorization
     */
    public function test_patch_report_with_insufficient_authorization(): void {
        $response = $this->json('PATCH', "/api/reports/1");
        $response->assertUnauthorized();
    }

    /**
     * FT-RE18
     * Test if updating a report's maintainer (user_id) returns error if user_id not a user..
     */
    public function test_patch_report_invalid_user_id_request(): void {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $payload = [
            'status' => 1,
            'priority' => 1,
            'user_id' => $user->id+1,
        ];
        $report = Report::factory()->create();
        $this->assertDatabaseCount('reports', 1);

        $response = $this->json('PATCH', "/api/reports/".$report->id, $payload);
        $response->assertStatus(400);
        $response->assertSee("ERROR: passed non-existing user id");
    }
}
