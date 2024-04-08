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
    public function question() {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the answer of the response.
     */
    public function answer() {
        return $this->belongsTo(Answer::class);
    }

    protected $hidden = [
        'question_id',
        'answer_id',
        'report_id'
        ];

    public $timestamps = false;
}
