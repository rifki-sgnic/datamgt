<?php

namespace App\Models;

use App\Models\Branch;
use App\Models\EmployeePosition;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id',
        'position_id',
        'employee_id',
        'name',
        'email',
        'gender',
        'birth_date',
        'hiring_date',
    ];

    public function branches()
    {
        return $this->belongsTo(Branch::class, 'branch_id', 'id');
    }

    public function getBranch()
    {
        return $this->branches->branch_name;
    }

    public function employee_positions()
    {
        return $this->belongsTo(EmployeePosition::class, 'position_id', 'id');
    }

    public function getPosition()
    {
        return $this->positions->position_name;
    }

    public function ops_skbirtgs()
    {
        return $this->belongsToMany(OpsSkbirtgs::class, 'skbirtgs_has_penerima_kuasa', 'employee_id', 'ops_skbirtgs_id');
    }

    public function ops_sk_operasionals()
    {
        return $this->belongsToMany(OpsSkOperasional::class, 'sk_operasional_has_penerima_kuasa', 'employee_id', 'ops_sk_operasional_id');
    }
}
