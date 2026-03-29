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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('booking_type'); // hotel | restaurant | tour
            $table->unsignedBigInteger('target_id');
            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->date('booking_date')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('total_amount', 12, 2)->nullable();
            $table->string('payment_type')->default('deposit');
            $table->string('status')->default('pending');
            $table->text('note')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
