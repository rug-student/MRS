<?php

use App\Models\Maintainer;
use App\Models\Response;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Response::class)->nullable();
            $table->text("description");
            $table->integer("priority");
            $table->timestamps();
            $table->integer("status");
            $table->string("submitter_email")->nullable();
            $table->foreignIdFor(Maintainer::class)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reports');
    }
}
