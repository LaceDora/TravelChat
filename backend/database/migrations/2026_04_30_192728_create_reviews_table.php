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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // 👤 Người đánh giá
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // ⭐ Polymorphic: đánh giá cho hotel / restaurant / tour...
            $table->morphs('reviewable');
            // => sẽ tạo:
            // reviewable_id (BIGINT)
            // reviewable_type (STRING)

            // ⭐ Nội dung đánh giá
            $table->tinyInteger('rating'); // 1 -> 5 sao
            $table->text('comment')->nullable();
            $table->boolean('is_approved')->default(true);

            $table->timestamps();

            // 🚀 (Optional) tránh spam 1 user đánh giá nhiều lần cùng 1 đối tượng
            $table->unique(['user_id', 'reviewable_id', 'reviewable_type'], 'unique_review');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};