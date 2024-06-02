<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model representing an Answer.
 * 
 * Belongs to a Response when it is the selected answer,
 * and belongs to a Question when it is one of the multiple choice answers.
*/
class Answer extends Model
{
    use HasFactory;

    public function question() {
        return $this->belongsTo(Question::class);
    }

    public function response() {
        return $this->hasMany(Response::class);
    }

    protected $fillable = [
        "answer"
    ];

    public $timestamps = false;
}
