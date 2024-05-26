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
     * Checks if the retrieving of a single test by id works as expected.
     */
    public function test_get_report(): void {
        $response = $this->get('api/reports/1');
        $response->assertStatus(404);

        Report::create([
            'description'=>"This is a test report",
            'priority'=>1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
            'responses'=>[]
        ]);

        $response = $this->get('api/reports/1');
        $response->assertStatus(200);
    }

    /**
     * Checks if retrieving multiple tests works
     */
    public function test_get_reports(): void {
        $response = $this->get('/api/reports');
        $response->assertStatus(200);

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
     * Checks if creating a new report works as expected.
     */
    public function test_create_report(): void {
        $malformed_report_payload = [
            'malformed'=>"This is a malformed payload"
            // is missing a discription
        ];

        $report_payload = [
            'description'=>"This is a test report",
            'submitter_email'=>"test@testing.nl",
            'responses'=>[

            ]
        ];

        $example_report_body = [
            'description'=>"This is a test report",
            'priority'=>-1,
            'status'=>0,
            'submitter_email'=>"test@testing.nl",
        ];

        $request = $this->json('post', '/api/reports', $malformed_report_payload);
        $request->assertStatus(422);

        $request = $this->json('post', '/api/reports', $report_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('reports', $example_report_body);
        $this->assertDatabaseCount('reports', 1);
    }
}
