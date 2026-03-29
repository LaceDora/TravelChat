<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');

            // Profile info
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable(); 
            // male | female | other

            $table->string('passport_number')->nullable()->unique();

            // Nationality
            $table->foreignId('country_id')
                ->nullable()
                ->constrained('countries')
                ->nullOnDelete();

            // Role & avatar
            $table->string('role')->default('user');
            $table->string('avatar_url')->nullable();

            // Favorite locations (❤️)
            $table->json('favorite_location_ids')->nullable();
            // Ví dụ: [1, 5, 12]

            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
