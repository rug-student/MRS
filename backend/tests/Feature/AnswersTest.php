<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AnswersTest extends TestCase
{
    /**
     * Test for creating an answer
     */
    public function test_create_answer(): void
    {
        
        $malformed_answer_payload = [
            "bad_payload"=>"bad"
        ];

        $answer_payload = [
            "answer" => "Test answer",
            "question_id" => "1"
        ];

        $request = $this->json('post', '/api/answers', $answer_payload);
        $request->assertStatus(200);

        $request = $this->json('post', '/api/answers', $malformed_answer_payload);
        $request->assertStatus(422);
    }
}
