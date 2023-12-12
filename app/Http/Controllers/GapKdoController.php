<?php

namespace App\Http\Controllers;

use App\Exports\KDO\KdoExport;
use App\Exports\KDO\KdoMobilSheet;
use App\Exports\KDO\KdosExport;
use App\Helpers\PaginationHelper;
use App\Http\Resources\KdoMobilResource;
use App\Imports\KdoImport;
use App\Imports\KdoMobilImport;
use App\Models\Branch;
use App\Models\BranchType;
use App\Models\GapKdo;
use App\Models\GapKdoMobil;
use App\Models\KdoMobilBiayaSewa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class GapKdoController extends Controller
{
    public function index()
    {
        // $collections = GapKdo::with('biaya_sewas')->get();
        // $collections = $collections->groupBy('vendor')->map(function ($kdos, $vendor) {
        //     $biaya_sewa = $kdos->flatMap(function ($mobil) {
        //         return $mobil->biaya_sewas;
        //     })->groupBy('periode')->sortKeysDesc()->first();
        //     return [
        //         'vendor' => $vendor,
        //         'jumlah_kendaraan' => $biaya_sewa->where('value', '>', 0)->count(),
        //         'sewa_perbulan' => isset($biaya_sewa)  ? $biaya_sewa->sum('value')
        //             : 0,
        //         'akhir_sewa' => $kdos->sortBy('akhir_sewa')->first()->akhir_sewa
        //     ];
        // });
        // dd($collections);

        $branchesProps = Branch::get();
        return Inertia::render('GA/Procurement/KDO/Page', ['branches' => $branchesProps]);
    }

    public function kdo_mobil($branch_code)
    {
        $kdo_mobil = GapKdo::whereHas('branches', function ($query) use ($branch_code) {
            $query->where('branch_code', $branch_code);
        })->with(['branches', 'biaya_sewas'])->first();

        $currentYear = date('Y');
        $futureYears = range($currentYear, $currentYear + 10);
        $months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        return Inertia::render('GA/Procurement/KDO/Detail', [
            'kdo_mobil' => $kdo_mobil,
            'years' => $futureYears,
            'months' => $months
        ]);
    }

    public function kdo_mobil_store(Request $request, $id)
    {
        $branch = Branch::find($id);
        try {
            GapKdoMobil::create([
                'branch_id' => $request->branch_id,
                'gap_kdo_id' => $request->gap_kdo_id,
                'vendor' => $request->vendor,
                'nopol' => $request->nopol,
                'awal_sewa' => $request->awal_sewa,
                'akhir_sewa' => $request->akhir_sewa,
                'biaya_sewa' => [['periode' => Carbon::create($request->year, $request->month, 1), 'value' => $request->biaya_sewa]],
            ]);

            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'success', 'message' => 'Data Berhasil disimpan']);
        } catch (Throwable $e) {
            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }
    public function kdo_mobil_update(Request $request, $id)
    {
        $branch = Branch::find($request->branch_id);
        try {
            $gap_kdo_mobil = GapKdoMobil::find($id);
            $gap_kdo_mobil->update([
                'branch_id' => $request->branch_id,
                'gap_kdo_id' => $request->gap_kdo_id,
                'vendor' => $request->vendor,
                'nopol' => $request->nopol,
                'awal_sewa' => $request->awal_sewa,
                'akhir_sewa' => $request->akhir_sewa,
            ]);
            $periode = Carbon::createFromDate($request->year, $request->month, 1)->startOfDay();
            if (is_int($request->biaya_sewa)) {

                KdoMobilBiayaSewa::create([
                    'gap_kdo_mobil_id' => $gap_kdo_mobil->id,
                    'periode' => $periode->format('Y-m-d'),
                    'value' => $request->biaya_sewa
                ]);
            } else {
                $biaya_sewa = KdoMobilBiayaSewa::find($request->biaya_sewa['id']);
                if ($request->biaya_sewa['value'] > 0) {

                    $biaya_sewa->update(['value' => $request->biaya_sewa['value']]);
                } else {
                    $biaya_sewa->delete();
                }
            }

            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'success', 'message' => 'Data Berhasil disimpan']);
        } catch (Throwable $e) {
            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }


    public function kdo_mobil_destroy($branch_code, $id)
    {
        try {
            $kdo_mobil = GapKdoMobil::find($id);
            $kdo_mobil->delete();

            return redirect(route('gap.kdos.mobil', $branch_code))->with(['status' => 'success', 'message' => 'Data Berhasil dihapus']);
        } catch (Throwable $e) {
            return redirect(route('gap.kdos.mobil', $branch_code))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }


    public function import(Request $request)
    {
        try {
            (new KdoImport)->import($request->file('file'));

            return redirect(route('gap.kdos'))->with(['status' => 'success', 'message' => 'Import Berhasil']);
        } catch (Throwable $e) {
            dd($e);
            return redirect(route('gap.kdos'))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }
    public function kdo_mobil_import(Request $request)
    {

        $branch = Branch::find($request->branch_id);
        try {
            (new KdoMobilImport($request->branch_id, $request->gap_kdo_id))->import($request->file('file'));

            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'success', 'message' => 'Import Berhasil']);
        } catch (Throwable $e) {
            dd($e);
            return redirect(route('gap.kdos.mobil', $branch->branch_code))->with(['status' => 'failed', 'message' => $e->getMessage()]);
        }
    }

    public function export()
    {
        $fileName = 'Data_KDO_' . date('d-m-y') . '.xlsx';
        return (new KdosExport)->download($fileName);
    }

    public function kdo_mobil_export(Request $request)
    {

        $fileName = 'Template_Import_KDO_Mobil' . date('d-m-y') . '.xlsx';
        return (new KdoMobilSheet($request->gap_kdo_id))->download($fileName);
    }
}
