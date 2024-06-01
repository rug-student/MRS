<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * FT-AUTH1
     * Test to check if user can login.
     */
    public function test_users_can_authenticate_using_the_login_endpoint(): void {
        $user = User::factory()->create();

        $response = $this->json('POST', "/api/login", [
            'email' => $user->email,
            'password' => 'password',
        ]);
        $response->assertStatus(200);
    }

    /**
     * FT-AUTH2
     * Test to check if user is unautherized when loggin in with invalid password.
     */
    public function test_users_can_not_authenticate_with_invalid_password(): void {
        $user = User::factory()->create();

        $response = $this->json('POST', "/api/login", [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnauthorized();
    }

    /**
     * FT-AUTH3
     * Test to check if autherized user can logout.
     */
    public function test_users_can_logout(): void {
        Sanctum::actingAs(User::factory()->create());
        $response = $this->json('POST', "/api/logout");

        $response->assertOk();
    }

    /**
     * FT-AUTH4
     * Test to check if autherized user can get user data.
     */
    public function test_users_can_get_user_data(): void {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $response = $this->json('GET', "/api/user");
        $response->assertOk();
        $response->assertSee($user->toArray());
    }
}
