<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;
    
    public function report() {
        return $this->belongsTo(Report::class);
    }

    protected $fillable = [
        'original_name',
        'generated_name',
    ];
    protected $hidden= [
        "report_id"
    ];
}