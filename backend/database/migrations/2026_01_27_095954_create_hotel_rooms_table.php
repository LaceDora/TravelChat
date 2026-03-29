<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('hotel_rooms', function (Blueprint $table) { 
            $table->id(); 

            $table->foreignId('hotel_id')
                ->constrained('hotels')
                ->onDelete('cascade'); 

            $table->string('name'); // Phòng đơn, Phòng đôi...

            // 💰 Giá
            $table->decimal('price_per_night', 12, 2);
            $table->integer('discount_percent')->default(0);

            // 👥 Sức chứa
            $table->integer('capacity')->default(2);
            $table->integer('quantity')->default(1);

            // 🛏 Thông tin thêm
            $table->string('bed_type')->nullable(); // giường đôi, king...
            $table->integer('area')->nullable();    // diện tích m2

            // 📊 Giá theo ngày (JSON)
            $table->json('dynamic_price')->nullable();

            // 📝 Mô tả
            $table->text('description')->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('hotel_rooms');
    }
};