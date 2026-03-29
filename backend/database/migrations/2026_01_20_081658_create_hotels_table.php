<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();

            $table->foreignId('location_id')
                ->nullable()
                ->constrained('locations')
                ->nullOnDelete();

            $table->string('name', 150);

            // ⭐ Đánh giá
            $table->decimal('rating', 2, 1)->nullable();
            $table->integer('reviews_count')->default(0);
            $table->string('rating_text')->nullable(); // "Rất tốt"

            // 💰 Giá + giảm giá
            $table->decimal('price_per_night', 12, 2);
            $table->integer('discount_percent')->default(0);
            $table->boolean('is_promotion')->default(false);
            $table->dateTime('promotion_end')->nullable();

            // 📝 Nội dung
            $table->longText('combo_content')->nullable();
            $table->text('description')->nullable();

            // 🏷 Tiện nghi (JSON)
            $table->json('amenities')->nullable();

            // 🖼 Ảnh
            $table->string('image_url')->nullable();

            // 📍 Địa chỉ + map
            $table->string('address')->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};