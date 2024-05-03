<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuestionsTest extends TestCase
{

    private string $test_mc_question_body;

    private string $test_open_question_body;

    protected function setup(): void {

        global $test_mc_question_body;

        global $test_open_question_body;

        $test_mc_question_body = [
                "question_description"=> "Is this a multiple choice test question?",
                "is_open"=> false,
                "answers"=> [
                "yes",
                "no"
                ]
            ];

        $test_open_question_body = 
            json_encode(
                array(
                    "question_description"=> "Is this an open test question?",
                    "is_open"=> true,
                    "answers"=> [
                        ""
                    ]
                )
            );

    }

    private function breakdown(): void {

    }

    public function test_create_question(): void {

        global $test_mc_question_body;

        global $test_open_question_body;

        $this->setup();
        $request = $this->json('post', '/api/questions', $test_mc_question_body);
        $response = $this->get('/api/questions/1');
        echo $response;
        $response->assertStatus(200);
        $this->breakdown();
    }

    /**
     * Basic test to check status of get questions request.
     */
    public function test_get_questions_status(): void
    {
        $response = $this->get('/api/questions');
        $response->assertStatus(200);

    }
}
