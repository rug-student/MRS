<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
/**
 * Model representing a Response.
 * 
 * Many responses belong to 1 Report.
*/
class Response extends Model
{
    use HasFactory;

    public function report() {
        return $this->belongsTo(Report::class);
    }

    /**
     * Get the question of the response.
     */
    public function question(): HasOne {
        return $this->hasOne(Question::class);
    }

    /**
     * Get the answer of the response.
     */
    public function answer(): HasOne {
        return $this->hasOne(Answer::class);
    }

    public $timestamps = false;
}
