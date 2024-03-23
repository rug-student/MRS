<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model representing a Question.
 * 
 * Belongs to a Response. 
*/
class Question extends Model
{
    use HasFactory;

    public function answer(): HasMany {
        return $this->hasMany(Answer::class);
    }

    protected $fillable = [
        "question_description",
        "is_open",
        "is_active"
    ];

    public $timestamps = false;
}
