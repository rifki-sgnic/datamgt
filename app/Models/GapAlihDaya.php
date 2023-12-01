<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GapAlihDaya extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_pekerjaan',
        'nama_pegawai',
        'user',
        'lokasi',
        'vendor',
        'cost',
    ];
}
