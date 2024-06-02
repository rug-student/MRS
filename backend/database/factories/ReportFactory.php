<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "description" => fake()->text(),
            "priority" => fake()->numberBetween(0, 10),
            "status" => fake()->numberBetween(0, 10),
            "submitter_email" => fake()->email(),
            "notify_submitter" => fake()->boolean(),
            // 'user_id' => User::factory()->create()->id,
        ];
    }
}
