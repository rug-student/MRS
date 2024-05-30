<?php

namespace Tests\Feature;

use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use Tests\TestCase;

class QuestionsTest extends TestCase
{

    use RefreshDatabase;  // Refresh the testing database after each test.

    /**
     * FT-QE1
     * Test that checks if creating a open question adds it to the database.
     */
    public function test_create_question_with_invalid_request(): void {
        Sanctum::actingAs(User::factory()->create());
        $question_payload = [
            "question_description"=> null,
            "is_open"=> true,
            "answers"=> []
        ];
        $response = $this->json('post', '/api/questions', $question_payload);
        $response->assertStatus(422);
        $this->assertDatabaseCount('questions', 0);

        $question_payload = [
            "question_description"=> "not null",
            "is_open"=> null,
            "answers"=> []
        ];
        $response = $this->json('post', '/api/questions', $question_payload);
        $response->assertStatus(422);
        $this->assertDatabaseCount('questions', 0);

        $question_payload = [
            "question_description"=> "not null",
            "is_open"=> "test",
            "answers"=> []
        ];
        $response = $this->json('post', '/api/questions', $question_payload);
        $response->assertStatus(422);
        $this->assertDatabaseCount('questions', 0);
    }

    /**
     * FT-QE2
     * Test that checks if creating a mc question enters that question in the database
     * in addition to answer entries for each mc option where the question_id is the foreign key.
     */
    public function test_create_mc_question(): void {
        Sanctum::actingAs(User::factory()->create());

        $question_body = [
            'question_description'=>"Is this a multiple choice test question?",
            'is_open'=>false,
            'is_active'=>true,
        ];
        $answer_option1 = "yes";
        $answer_option2 = "no";
        $question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> false,
            "answers"=> [
                $answer_option1,
                $answer_option2
            ]
        ];

        $response = $this->json('post', '/api/questions', $question_payload);
        // Question entry asserts
        $response->assertStatus(200);
        $this->assertDatabaseHas('questions', $question_body);
        $this->assertDatabaseCount('questions', 1);

        // Answer entry asserts with question_id as foreign key
        $answer1_body = [
            "answer"=>$answer_option1,
            "question_id"=>json_decode($response->content())[1]->id
        ];
        $answer2_body = [
            "answer"=>$answer_option2,
            "question_id"=>json_decode($response->content())[1]->id
        ];
        $this->assertDatabaseHas('answers', $answer1_body);
        $this->assertDatabaseHas('answers', $answer2_body);
        $this->assertDatabaseCount('answers', 2);
    }

    /**
     * FT-QE3
     * Test if creating a mc question with invalid answer option returns and error and does not store any question.
     */
    public function test_create_mc_question_with_null_answer(): void {
        Sanctum::actingAs(User::factory()->create());

        $question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> false,
            "answers"=> [
                "yes",
                "no",
                "test",
                null,
                "Test2"
            ]
        ];

        $response = $this->json('post', '/api/questions', $question_payload);
        // Question entry asserts
        $response->assertStatus(400);
        $this->assertDatabaseCount('questions', 0);
        $this->assertDatabaseCount('answers', 0);
    }

    /**
     * FT-QE4
     * Test that checks if creating a question with no mc answers adds it to the database.
     */
    public function test_create_open_question(): void {
        Sanctum::actingAs(User::factory()->create());

        $example_open_question_body = [
                'question_description'=>"Is this a multiple choice test question?",
                'is_open'=>true,
                'is_active'=>true,
            ];

        $open_question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> true,
            "answers"=> []
        ];

        $request = $this->json('post', '/api/questions', $open_question_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('questions', $example_open_question_body);
        $this->assertDatabaseCount('questions', 1);
        $this->assertDatabaseCount('answers', 0);
    }

    /**
     * FT-QE5
     * Basic test to check status and structure of get questions request.
     */
    public function test_get_questions_on_empty_database(): void {
        $response = $this->get('/api/questions');
        $response->assertStatus(200);
        $response->assertContent("[]");
    }

    /**
     * FT-QE6
     * Test get questions request response on populated database.
     */
    public function test_get_questions_on_populated_database(): void {
        $question_body1 = [
            'question_description'=>"This is a test question",
            'is_open'=>true,
            'is_active'=>true,
        ];
        $question_body2 = [
            'question_description'=>"This is a second question",
            'is_open'=>false,
            'is_active'=>false,
        ];
        $question1 = Question::create($question_body1);
        $question2 = Question::create($question_body2);

        $response = $this->get('/api/questions');
        $response->assertStatus(200);

        // Assert question properties
        $response->assertSee($question_body1);
        $response->assertSee($question_body2);
        $this->assertDatabaseCount('questions', 2);
    }

    /**
     * FT-QE7
     * Test get questions request active questions on populated database.
     */
    public function test_get_active_questions_on_populated_database(): void {
        $question_body1 = [
            'question_description'=>"This is a test question",
            'is_open'=>true,
            'is_active'=>true,
        ];
        $question_body2 = [
            'question_description'=>"This is a second question",
            'is_open'=>false,
            'is_active'=>false,
        ];
        $question1 = Question::create($question_body1);
        $question2 = Question::create($question_body2);
        $this->assertDatabaseCount('questions', 2);

        $payload = [
            "active"=>"true"
        ];

        $response = $this->json('GET', '/api/questions', $payload);
        $response->assertStatus(200);

        // Assert question ids
        $response->assertSee($question1->id);
        $response->assertDontSee($question2->id);
    }

    /**
     * FT-QE8
     * Test get questions request inactive questions on populated database.
     */
    public function test_get_inactive_questions_on_populated_database(): void {
        $question_body1 = [
            'question_description'=>"This is a test question",
            'is_open'=>true,
            'is_active'=>true,
        ];
        $question_body2 = [
            'question_description'=>"This is a second question",
            'is_open'=>false,
            'is_active'=>false,
        ];
        $question1 = Question::create($question_body1);
        $question2 = Question::create($question_body2);
        $this->assertDatabaseCount('questions', 2);

        $payload = [
            "active"=>"false"
        ];

        $response = $this->json('GET', '/api/questions', $payload);
        $response->assertStatus(200);

        // Assert question ids
        $response->assertSee($question2->id);
        $response->assertDontSee($question1->id);
    }

    /**
     * FT-QE9
     * Test if updating a questions with invalid request give error.
     */
    public function test_patch_question_invalid_request(): void {
        Sanctum::actingAs(User::factory()->create());

        $patch_payload = [
            "is_active"=>"false" // not boolean value
        ];

        $question_payload = [
            'question_description'=>"Is this an update test question?",
            'is_open'=>false,
            'is_active'=>true,
        ];
        $question = Question::create($question_payload);

        $this->assertDatabaseCount('questions', 1);
        $response = $this->json('PATCH', "api/questions/".$question->id, $patch_payload); // need to use propper json request here.
        $response->assertStatus(422);
        $this->assertDatabaseHas('questions', $question_payload); // check for unchanged question.
        $this->assertDatabaseCount('questions', 1);
    }

    /**
     * FT-QE10
     * Test to check if updating a questions status works as expected.
     */
    public function test_patch_question_valid_request(): void {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'is_active' => false
        ];

        $question = Question::create([
            'question_description'=>"Is this an update test question?",
            'is_open'=>false,
            'is_active'=>true,
        ]);
        $this->assertDatabaseCount('questions', 1);

        $response = $this->json('PATCH', "api/questions/".$question->id, $payload);
        $response->assertStatus(200);

        $this->assertDatabaseCount('questions', 1);
        $this->assertDatabaseHas('questions', $payload);
    }

    /**
     * FT-QE11
     * Test that checks if creating a question with insufficient authorization returns 401.
     */
    public function test_create_open_question_with_insufficient_authorization(): void {
        $open_question_payload = [
            "question_description"=> "Is this a multiple choice test question?",
            "is_open"=> true,
            "answers"=> []
        ];

        $response = $this->json('post', '/api/questions', $open_question_payload);
        $response->assertUnauthorized();
    }

    /**
     * FT-QE12
     * Test to check if updating a questions with insufficient authorization returns 401.
     */
    public function test_patch_question_with_insufficient_authorization(): void {

        $payload = [
            'is_active' => false
        ];

        $question = Question::create([
            'question_description'=>"Is this an update test question?",
            'is_open'=>false,
            'is_active'=>true,
        ]);
        $this->assertDatabaseCount('questions', 1);

        $response = $this->json('PATCH', "api/questions/".$question->id, $payload);
        $response->assertUnauthorized();
    }
}
