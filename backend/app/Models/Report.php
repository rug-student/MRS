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

    public function maintainer(): HasMany {
        return $this->hasMany(Maintainer::class);
    }

    protected $fillable = [
            "description",
            "priority",
            "status",
            "submitter_email"
    ];

    // Created_at & updated_at get automatically handled by the ORM.
}
