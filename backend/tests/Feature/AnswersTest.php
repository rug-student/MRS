<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AnswersTest extends TestCase
{
    use RefreshDatabase;

    /**
     * FT-AE1
     * Test for creating an answer with valid payload
     */
    public function test_create_answer_with_valid_playload(): void
    {
        $answer_payload = [
            "answer" => "Test answer1"
        ];

        $request = $this->json('post', '/api/answers', $answer_payload);
        $request->assertStatus(200);
        $this->assertDatabaseHas('answers', $answer_payload);
        $this->assertDatabaseCount('answers', 1);
    }

    /**
     * FT-AE2
     * Test for creating an answer with invalid payload
     */
    public function test_create_answer_with_invalid_payload(): void
    {
        // the post answer request reqires a 'answer' key to be not null.
        $malformed_answer_payload = [
            "bad_payload"=>"bad"
            // is missing answers field
        ];

        $request = $this->json('post', '/api/answers', $malformed_answer_payload);
        $request->assertStatus(422);
        $this->assertDatabaseCount('answers', 0);
    }
}
