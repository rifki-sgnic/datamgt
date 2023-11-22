<?php

namespace App\Http\Controllers;

use App\Exports\Scoring\AssessmentsExport;
use App\Http\Resources\ScoringAssessmentsResource;
use App\Imports\GapScoringAssessmentsImport;
use App\Models\Branch;
use App\Models\GapScoring;
use App\Models\GapScoringAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Throwable;

class GapScoringAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $branchesProps = Branch::get();
        return Inertia::render('GA/Procurement/Scoring/Assessment/Page', ['branches' => $branchesProps]);
    }

    protected array $sortFields = ['branches.branch_code', 'entity'];

    public function api(GapScoring $gap_scoring_assessment, Request $request)
    {
        $sortFieldInput = $request->input('sort_field', 'branches.branch_code');
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : 'branches.branch_code';
        $sortOrder = $request->input('sort_order', 'asc');
        $searchInput = $request->search;
        $query = $gap_scoring_assessment->select('gap_scorings.*')->where('type', 'Assessment')->orderBy($sortField, $sortOrder)
            ->join('branches', 'gap_scorings.branch_id', 'branches.id');

        $perpage = $request->perpage ?? 10;

        if (!is_null($request->branch_code)) {
            $query = $query->where('branch_code', $request->branch_code);
        }

        if (!is_null($searchInput)) {
            $searchQuery = "%$searchInput%";
            $query = $query->where(function ($query) use ($searchQuery) {
                $query->where('pic', 'like', $searchQuery)
                    ->orWhere('vendor', 'like', $searchQuery)
                    ->orWhereHas('branches', function ($q) use ($searchQuery) {
                        $q->where('branch_name', 'like', $searchQuery);
                    });
            });
        }
        $data = $query->paginate($perpage);
        return ScoringAssessmentsResource::collection($data);
    }

    public function import(Request $request)
    {
        try {
            (new GapScoringAssessmentsImport)->import($request->file('file')->store('temp'));

            return redirect(route('gap.scoring_assessments'))->with(['status' => 'success', 'message' => 'Import Berhasil']);
        } catch (Throwable $e) {
            dd($e);
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());

        try {
            DB::beginTransaction();
            GapScoring::create(
                [
                    'branch_id' => $request->branch_id,
                    'entity' => "BSS",
                    'description' => $request->description,
                    'pic' => $request->pic,
                    'dokumen_perintah_kerja' => $request->dokumen_perintah_kerja,
                    'vendor' => $request->vendor,
                    'tgl_scoring' => $request->tgl_scoring,
                    'scoring_vendor' => $request->scoring_vendor,
                    'schedule_scoring' => $request->schedule_scoring,
                    'type' => 'Assessment',
                    'keterangan' => $request->keterangan,
                ]
            );
            DB::commit();
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'success', 'message' => 'Data berhasil disimpan']);
        } catch (Throwable $e) {

            DB::rollBack();
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        // dd($request->all());

        try {
            DB::beginTransaction();
            $branch = Branch::find($request->branch_id);
            $gap_scoring = GapScoring::find($id);
            $gap_scoring->update(
                [
                    'branch_id' => $branch->id,
                    'entity' => "BSS",
                    'description' => $request->description,
                    'pic' => $request->pic,
                    'dokumen_perintah_kerja' => $request->dokumen_perintah_kerja,
                    'vendor' => $request->vendor,
                    'tgl_scoring' => $request->tgl_scoring,
                    'scoring_vendor' => $request->scoring_vendor,
                    'schedule_scoring' => $request->schedule_scoring,
                    'type' => 'Assessment',
                    'keterangan' => $request->keterangan,
                ]
            );
            DB::commit();
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'success', 'message' => 'Data berhasil diupdate']);
        } catch (Throwable $e) {

            DB::rollBack();
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }

    public function export()
    {
        $fileName = 'Data_GAP_Scoring_Assessments ' . date('d-m-y') . '.xlsx';
        return (new AssessmentsExport)->download($fileName);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $gap_scoring = GapScoring::find($id);
            $gap_scoring->delete();
            DB::commit();
         return redirect(route('gap.scoring_assessments'))->with(['status' => 'success', 'message' => 'Data berhasil dihapus']);
        } catch (Throwable $e) {
            DB::rollBack();
            return redirect(route('gap.scoring_assessments'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }
}