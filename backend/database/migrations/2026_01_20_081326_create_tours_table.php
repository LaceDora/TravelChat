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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();

            // Khóa ngoại liên kết với bảng locations (địa điểm)
            // Lưu ý: Bảng locations phải được tạo trước bảng này
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');

            $table->string('name');                      // Tên tour
            $table->string('slug')->unique()->nullable(); // SEO URL (duy nhất)
            $table->integer('days')->nullable();         // Số ngày (VD: 5)

            $table->string('transport')->nullable();     // Phương tiện
            $table->string('departure_location')->nullable(); // Nơi khởi hành

            $table->text('description')->nullable();     // Mô tả ngắn
            $table->longText('content')->nullable();     // Nội dung chi tiết
            $table->longText('combo_content')->nullable(); // Nội dung combo đi kèm

            $table->string('image_url')->nullable();     // Ảnh đại diện tour
            
            $table->boolean('is_active')->default(true); // Trạng thái bật/tắt tour

            $table->timestamps(); // Tạo created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};