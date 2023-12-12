<?php

namespace App\Models;

use App\Models\BranchType;
use App\Models\Employee;
use App\Models\OpsPajakReklame;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Branch extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'branch_type_id',
        'branch_code',
        'branch_name',
        'address',
        'telp',
        'layanan_atm',
        'npwp',
        'nitku',
        'izin',
        'status',
        'masa_sewa',
        'open_date',
        'expired_date',
        'owner',
        'sewa_per_tahun',
        'total_biaya_sewa',
        'area',
        'file_ojk',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'branch_id');
    }

    public function branch_types()
    {
        return $this->belongsTo(BranchType::class, 'branch_type_id', 'id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'branch_id');
    }

    public function ops_pajak_reklames()
    {
        return $this->hasOne(OpsPajakReklame::class, 'branch_id');
    }

    public function ops_skbirtgs()
    {
        return $this->hasOne(OpsSkbirtgs::class, 'branch_id');
    }

    public function ops_apar()
    {
        return $this->hasOne(OpsApar::class, 'branch_id');
    }

    public function ops_skoperasional()
    {
        return $this->hasOne(OpsSkOperasional::class, 'branch_id');
    }

    public function gap_disnaker()
    {
        return $this->hasMany(GapDisnaker::class, 'branch_id');
    }

    public function gap_kdo()
    {
        return $this->hasMany(GapKdo::class, 'branch_id');
    }

    public function gap_assets()
    {
        return $this->hasMany(GapAsset::class, 'branch_id');
    }

    public function gap_scorings()
    {
        return $this->hasMany(GapScoring::class, 'branch_id');
    }
    public function infra_scorings()
    {
        return $this->hasMany(InfraScoring::class, 'branch_id');
    }
    public function sewa_gedung()
    {
        return $this->hasOne(InfraSewaGedung::class, 'branch_id');
    }

    public function gap_toners()
    {
        return $this->hasMany(GapToner::class, 'branch_id');
    }

    public function gap_stos()
    {
        return $this->hasOne(GapSto::class, 'branch_id');
    }
}

