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
       Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();

            $table->string('name');

            $table->decimal('rating', 2,1)->nullable();
            $table->integer('reviews_count')->default(0);
            $table->string('rating_text')->nullable();

            $table->decimal('min_price', 12,2)->nullable();
            $table->decimal('max_price', 12,2)->nullable();

            $table->integer('discount_percent')->default(0);
            $table->boolean('is_promotion')->default(false);
            $table->dateTime('promotion_end')->nullable();

            $table->text('description')->nullable();
            $table->json('menu')->nullable();
            $table->json('amenities')->nullable();

            $table->string('image_url')->nullable();

            $table->string('address')->nullable();

            // ✅ MAP (có rồi)
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();

            $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
