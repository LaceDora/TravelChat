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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Thông tin cơ bản & Đăng nhập
            $table->string('name');
            $table->string('email')->unique();
            $table->string('google_id')->nullable()->unique(); 
            $table->string('password')->nullable();

            // Thông tin hồ sơ (Profile)
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable(); // male | female | other
            $table->string('passport_number')->nullable()->unique();

            // Quốc tịch (Liên kết bảng countries)
            $table->foreignId('country_id')
                ->nullable()
                ->constrained('countries')
                ->nullOnDelete();

            // Phân quyền & Ảnh đại diện
            $table->string('role')->default('user');
            $table->string('avatar_url')->nullable();

            // Danh sách địa điểm yêu thích (Lưu dạng JSON)
            $table->json('favorite_location_ids')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};