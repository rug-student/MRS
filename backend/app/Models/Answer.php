<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing an Answer.
 * 
 * Belongs to a Response when it is the selected answer,
 * and belongs to a Question when it is one of the multiple choice answers.
*/
class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        "answer"
    ];

    public $timestamps = false;
}
