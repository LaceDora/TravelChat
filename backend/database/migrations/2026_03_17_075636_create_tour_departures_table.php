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
        Schema::create('tour_departures', function (Blueprint $table) {
            $table->id();

            // Khóa ngoại liên kết với bảng tours
            $table->foreignId('tour_id')->constrained('tours')->onDelete('cascade');

            $table->date('departure_date');            // Ngày khởi hành
            $table->integer('capacity')->default(20);  // Tổng số chỗ
            $table->integer('booked')->default(0);     // Số đã đặt

            $table->decimal('price', 12, 2);           // Giá gốc
            $table->integer('discount_percent')->default(0); // % giảm giá

            $table->boolean('is_promotion')->default(false); // Có phải ưu đãi không
            $table->dateTime('promotion_end')->nullable();   // Thời gian hết ưu đãi

            $table->string('status', 50)->default('available'); // available / full / cancelled

            $table->timestamps(); // Tạo sẵn created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_departures');
    }
};