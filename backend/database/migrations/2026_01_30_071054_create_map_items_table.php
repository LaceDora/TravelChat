<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('map_items', function (Blueprint $table) {
            $table->id();

            // Tên hiển thị trên map
            $table->string('title');

            // location | hotel | restaurant
            $table->string('type');

            // mô tả ngắn
            $table->text('description')->nullable();

            // tọa độ
            $table->decimal('lat', 9, 6);
            $table->decimal('lng', 9, 6);

            // ảnh (nếu có)
            $table->string('image')->nullable();

            // liên kết bảng gốc (location, hotel...)
            $table->unsignedBigInteger('ref_id')->nullable();
            $table->string('ref_table')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_items');
    }
};

