<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('restaurant_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->integer('capacity');
            $table->integer('quantity')->default(1);

            $table->decimal('price', 12,2)->nullable();
            $table->integer('discount_percent')->default(0);

            $table->json('dynamic_price')->nullable();

            $table->text('note')->nullable();

            $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_tables');
    }
};
