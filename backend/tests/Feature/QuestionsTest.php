<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuestionsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_get_questions(): void
    {
        $response = $this->get('/api/questions');

        $response->assertStatus(200);
    }
}
