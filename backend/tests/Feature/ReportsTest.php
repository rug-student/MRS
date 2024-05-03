<?php

namespace Tests\Feature;

//use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsTest extends TestCase
{

    /**
     * A basic test example.
     */
    public function test_get_reports(): void
    {
        $response = $this->get('/api/reports');

        $response->assertStatus(200);
    }
}
