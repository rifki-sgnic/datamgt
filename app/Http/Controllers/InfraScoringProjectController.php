<?php

namespace App\Http\Controllers;

use App\Exports\InfraScoring\InfraScoringExport;
use App\Http\Resources\ScoringProjectsResource;
use App\Imports\InfraScoringProjectsImport;
use App\Models\Branch;
use App\Models\InfraScoring;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class InfraScoringProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $branches = Branch::get();
        return Inertia::render('GA/Infra/Scoring/Project/Page', ['branches' => $branches]);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function template()
    {
        $path = 'app\public\templates\template_infra_projects.xlsx';

        return response()->download(storage_path($path));
    }


    public function import(Request $request)
    {
        try {
            (new InfraScoringProjectsImport)->import($request->file('file'));

            return redirect(route('infra.scoring_projects'))->with(['status' => 'success', 'message' => 'Import Berhasil']);
        } catch (Throwable $e) {
            dd($e);
            return redirect(route('infra.scoring_projects'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }

    public function export()
    {
        $fileName = 'Data_Infra_Scoring_Project_' . date('d-m-y') . '.xlsx';
        return (new InfraScoringExport('Post Project'))->download($fileName);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function detail($scoring_vendor)
    {
        $branches = Branch::get();
        return Inertia::render('GA/Infra/Scoring/Project/Detail', ['scoring_vendor' => $scoring_vendor, 'branches' => $branches, 'status_pekerjaan' => InfraScoring::whereNot('type','Assessment')->pluck('status_pekerjaan')->unique()->toArray()]);
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
