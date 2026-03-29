<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tour_schedules', function (Blueprint $table) {
            $table->id();

            // Khóa ngoại liên kết với bảng tours
            $table->foreignId('tour_id')->constrained('tours')->onDelete('cascade');

            $table->integer('day_number');           // Ngày thứ mấy (VD: 1, 2, 3...)
            $table->string('time')->nullable();      // Thêm cột thời gian (VD: 07:00 hoặc Sáng)
            $table->string('title');                // Tiêu đề/Địa điểm (VD: Ăn sáng tại khách sạn)
            $table->text('activity')->nullable();    // Nội dung chi tiết hoạt động

            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_schedules');
    }
};