<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
            "inventory_number",
            "alt_category_object_name",
            "location_desc",
            "description",
            "picture",
            "priority",
            "creation_time",
            "status",
            "submitter_email"
    ];
}
