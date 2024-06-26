<?php

use App\Models\Answer;
use App\Models\Question;
use App\Models\Report;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('responses', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Report::class)->constrained();
            $table->foreignIdFor(Question::class)->constrained();
            $table->foreignIdFor(Answer::class)->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
