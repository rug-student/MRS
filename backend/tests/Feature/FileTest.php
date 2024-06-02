<?php

namespace Tests\Feature;

use App\Models\Report;
use App\Models\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Http\UploadedFile;
use App\Models\User;
use Tests\TestCase;

class FileTest extends TestCase
{

    use RefreshDatabase;


    /**
     * FT-FE1
     * Test uploading endpoint with no file.
     */
    public function test_upload_with_no_file(): void {

        $response = $this->json('post', '/api/files/upload');
        $response->assertUnprocessable();
    }

    /**
     * FT-FE2
     * Test uploading endpoint with csv file expecting 422 response as only images are allowed.
     */
    public function test_upload_with_csv_file(): void {

        $file = UploadedFile::fake()->createWithContent('customer.csv', 'id;name;group\n9999;Customer1;');
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file
        ]);
        $response->assertUnprocessable();
    }


    /**
     * FT-FE3
     * Test uploading endpoint with image but no report id.
     */
    public function test_upload_with_image_no_report_id(): void {

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file
        ]);
        $response->assertBadRequest();
        $response->assertSee("ERROR: passed non-existing report id");
    }

    /**
     * FT-FE4
     * Test uploading endpoint with image and invalid report id.
     */
    public function test_upload_with_image_and_invalid_report_id(): void {

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file,
            'report_id' => 1,
        ]);
        $response->assertBadRequest();
        $response->assertSee("ERROR: passed non-existing report id");
    }

    /**
     * FT-FE5
     * Test uploading endpoint with image and invalid report id.
     */
    public function test_upload_with_image_and_valid_report_id(): void {
        $report = Report::factory()->create();

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file,
            'report_id' => $report->id,
        ]);
        $response->assertOk();
    }

    /**
     * FT-FE6
     * Test download endpoint with invalid file id.
     */
    public function test_download_invalid_file_name(): void {
        Sanctum::actingAs(User::factory()->create());

        $report = Report::factory()->create();

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file,
            'report_id' => $report->id,
        ]);
        $response->assertOk();

        $fileID = json_decode($response->getContent())->file->id;
        $response = $this->json('get', '/api/files/'.($fileID+1).'/download');
        $response->assertNotFound();
    }

    /**
     * FT-FE7
     * Test download endpoint with valid file id.
     */
    public function test_download_valid_file_name(): void {
        Sanctum::actingAs(User::factory()->create());

        $report = Report::factory()->create();

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file,
            'report_id' => $report->id,
        ]);
        $response->assertOk();

        $fileID = json_decode($response->getContent())->file->id;
        $response = $this->json('get', '/api/files/'.$fileID.'/download');
        $response->assertOk();
    }

    /**
     * FT-FE8
     * Test download endpoint with invalid authentication.
     */
    public function test_download_with_invalid_authentication(): void {

        $report = Report::factory()->create();

        $file = UploadedFile::fake()->image("testImage.png");
        $response = $this->json('post', '/api/files/upload', [
            'file' => $file,
            'report_id' => $report->id,
        ]);
        $response->assertOk();

        $fileID = json_decode($response->getContent())->file->id;
        $response = $this->json('get', '/api/files/'.$fileID.'/download');
        $response->assertUnauthorized();
    }
}
