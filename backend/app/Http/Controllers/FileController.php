<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FileController extends Controller
{
    // Receives a file upload
    public function upload(Request $request): JsonResponse
    {
        // Validate the incoming request
        $request->validate([
            'file' => 'required',
        ]);
        
        Log::channel('abuse')->info('upload file: report_id, ',
        [ 'report_id' => $request->get('report_id')]);

        $file = $request->file('file');
        $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
        $file->storeAs('uploads', $fileName);

        $newFile = File::create([
            'original_name' => $file->getClientOriginalName(),
            'generated_name' => $fileName,
        ]);

        $newFile->save();

        $report = Report::find($request->get('report_id'));
        $report->files()->save($newFile);
        
        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $newFile, 
        ]);
    }

    // Returns a list of previously uploaded files
    public function index(): JsonResponse
    {
        $files = File::all();
        return response()->json($files);
    }

    // Sends the requested file as a download, if found
    public function download(File $file)
    {
        $filePath = storage_path("app/uploads/{$file->generated_name}");

        if (file_exists($filePath)) {
            return response()->download($filePath, $file->original_name);
        } else {
            abort(404, 'File not found');
        }
    }

}