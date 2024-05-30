<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use App\Models\File;

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

    public function file(): HasMany{
        return $this->hasMany(File::class);
    }

    /**
     * Get the user of the report.
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
            "description",
            "priority",
            "status",
            "submitter_email",
            'user_id',
    ];
    // Created_at & updated_at get automatically handled by the ORM.
}
