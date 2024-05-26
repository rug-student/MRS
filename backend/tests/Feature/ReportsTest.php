<?php

namespace Tests\Feature;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Report;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsTest extends TestCase
{

    use RefreshDatabase;

    /**
     * FT-RE1
     * Test the get /reports/{id} endpoint with invalid id
     */
    public function test_get_report_invalid_id(): void {
        $response = $this->get('api/reports/1');
        $response->assertStatus(404);
    }

    /**
     * FT-RE2
     * Tests the retrieval of a created report.
     */
    public function test_get_report(): void {
        $report_body = [
            'description'=>"This is a test report",
            'priority'=>1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl"
        ];
        $report = Report::create($report_body);
        $this->assertDatabaseCount('reports', 1);

        $response = $this->get('api/reports/'.$report->id);
        $response->assertStatus(200);
        $response->assertSee($report->description);
        $response->assertSee($report->priority);
        $response->assertSee($report->status);
        $response->assertSee($report->submitter_email);
    }

    /**
     * FT-RE3
     * Test GET /api/reports request on empty database
     */
    public function test_get_reports_on_empty_database(): void {
        $response = $this->get('/api/reports');
        $response->assertStatus(200);
        $response->assertContent("[]");

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

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl"
        ];

        $report_body = [
            'description'=>"This is a test report",
            'priority'=>-1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
        ];

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('reports', $report_body);
        $this->assertDatabaseCount('reports', 1);
    }

    /**
     * FT-RE8
     * Test POST /reports endpoint with no responses or files
     */
    public function test_create_report_base(): void {

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl"
        ];

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('reports', $report_payload);
        $this->assertDatabaseCount('reports', 1);
    }


    /**
     * FT-RE9
     * Test POST /reports endpoint with report responses
     */
    public function test_create_report_with_responses(): void {

        $question = Question::create([
            'question_description'=>"This is a second question",
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
     * Test POST /reports endpoint with files
     */
    public function test_create_report_with_files(): void {
        $file_path1 = "file/path1";
        $file_path2 = "file/path2";

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl",
            'files' => [
                'a'=> [
                    "file_path"=> $file_path1
                ],
                'b'=> [
                    "file_path"=> $file_path2
                ]
            ]
        ];

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseCount('files', 2);

        $file_body = [
            "file_path"=> $file_path1,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('files', $file_body);

        $file_body = [
            "file_path"=> $file_path2,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('files', $file_body);
    }

    /**
     * FT-RE11
     * Test POST /reports endpoint with report responses and files
     */
    public function test_create_report_with_responses_and_files(): void {

        $question = Question::create([
            'question_description'=>"This is a second question",
            'is_open'=>false,
            'is_active'=>false,
        ]);
        $answer = Answer::create([
            'answer'=>"this is an answer",
            'question_id'=>$question->id
        ]);

        $file_path1 = "file/path1";
        $file_path2 = "file/path2";

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl",
            'responses' => [
                '1'=>[
                    "question_id"=> $question->id,
                    "answer_id"=> $answer->id
                ],
            ],
            'files' => [
                'a'=> [
                    "file_path"=> $file_path1
                ],
                'b'=> [
                    "file_path"=> $file_path2
                ],
            ]
        ];



        $request = $this->json('post', '/api/reports', $report_payload);
        // $this->assertEquals(1,2, json_decode($request->getContent()));
        $request->assertStatus(200);
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseCount('responses', 1);
        $this->assertDatabaseCount('files', 2);

        $response_body = [
            "question_id"=> $question->id,
            "answer_id"=> $answer->id,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('responses', $response_body);

        $file_body = [
            "file_path"=> $file_path1,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('files', $file_body);

        $file_body = [
            "file_path"=> $file_path2,
            "report_id"=>json_decode($request->getContent())[1]->id
        ];
        $this->assertDatabaseHas('files', $file_body);
    }
}
