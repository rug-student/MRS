<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
/**
 * Model representing a Report.
 * 
*/
class Report extends Model
{
    use HasFactory;

    public function response(): HasMany {
        return $this->hasMany(Response::class);
    }

    protected $fillable = [
            "description",
            "priority",
            "creation_time",
            "status",
            "submitter_email"
    ];
}
