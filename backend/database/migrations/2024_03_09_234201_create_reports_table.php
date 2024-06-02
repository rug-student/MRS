<?php

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
            $table->object_category_id();
            $table->integer("inventory_number");
            $table->string("alt_category_object_name");
            $table->foreignId("location_id");
            $table->string("location_desc");
            $table->string("description");
            $table->binary("picture"); // not sure what column type this should be...
            $table->integer("priority");
            $table->dateTime("creation_time");
            $table->integer("status");
            $table->string("submitter_email");
            $table->foreignId("assigned_maintainer_id");
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
