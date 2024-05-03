<?php

namespace Tests\Feature;

use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuestionsTest extends TestCase
{

    use RefreshDatabase;  // Refresh the testing database after each test. (makes it slow)


    /**
     * Test that checks if creating a mc question works as expected.
     */
    public function test_create_mc_question(): void {

        $example_mc_question_body = [
                'id' => 1,
                'question_description'=>"Is this a multiple choice test question?",
                'is_open'=>false,
                'is_active'=>true,
            ];

        $mc_question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> false,
            "answers"=> [
            "yes",
            "no"
            ]
        ];

        $request = $this->json('post', '/api/questions', $mc_question_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('questions', $example_mc_question_body);
        $this->assertDatabaseCount('questions', 1);
    }

    /**
     * Basic test to check status and structure of get questions request.
     */
    public function test_get_questions(): void {
        $response = $this->get('/api/questions');
        $response->assertStatus(200);
        $response->assertJsonStructure([]);
    }

    /**
     * Test to check if retrieving a single question works as expected.
     */
    public function test_get_question(): void {
        $response = $this->get('/api/questions/2');
        $response->assertStatus(404);

        Question::create([
            'question_description'=>"Is this a multiple choice test question?",
            'is_open'=>false,
            'is_active'=>true,
        ]);

        $response = $this->get('/api/questions/2');
        $response->assertStatus(200);
    }

    /**
     * Test to check if deleting a question works as expected.
     */
    public function test_delete_question() : void {

        Question::create([
            'question_description'=>"Is this a multiple choice test question?",
            'is_open'=>false,
            'is_active'=>true,
        ]);
        $this->assertDatabaseCount('questions', 1);
        
        $response = $this->delete('api/questions/3');
        $response->assertStatus(200);
        $this->assertDatabaseCount('questions', 0);
    }

    /**
     * Test to check if updating a questions status works as expected.
     */
    public function test_patch_question(): void {

        $payload = [
            'is_active' => false
        ];

        Question::create([
            'question_description'=>"Is this an update test question?",
            'is_open'=>false,
            'is_active'=>true,
        ]);
        $this->assertDatabaseCount('questions', 1);

        $response = $this->patch('api/questions/4', $payload);
        $response->assertStatus(200);

        $this->assertDatabaseCount('questions', 1);
        $this->assertDatabaseHas('questions', $payload);
    }

    /**
     * Test that checks if creating a open question works as expected.
     */
    public function test_create_open_question(): void {

        $example_open_question_body = [
                'question_description'=>"Is this a multiple choice test question?",
                'is_open'=>true,
                'is_active'=>true,
            ];

        $open_question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> true,
            "answers"=> [
            ""
            ]
        ];

        $request = $this->json('post', '/api/questions', $open_question_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('questions', $example_open_question_body);
        $this->assertDatabaseCount('questions', 1);
    }
}