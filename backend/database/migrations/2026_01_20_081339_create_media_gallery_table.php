<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('media_gallery', function (Blueprint $table) {
            $table->id(); // SERIAL PRIMARY KEY

            $table->string('target_type', 20); 
            // 'hotel', 'tour', 'place', 'restaurant'

            $table->integer('target_id');

            $table->text('image_path');

            $table->boolean('is_primary')->default(false);

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_gallery');
    }
};
