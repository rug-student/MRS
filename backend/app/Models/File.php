<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * Model representing a File upload.
 *
 * Many files belong to 1 Report.
*/
class File extends Model
{
    use HasFactory;

    public function report() {
        return $this->belongsTo(Report::class);
    }

    protected $fillable = [
        "file_path",
        "report_id"
    ];

    //created_at & updated_at are automatically updated by the ORM
}
