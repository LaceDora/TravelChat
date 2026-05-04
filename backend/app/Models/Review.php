<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewable_id',
        'reviewable_type',
        'rating',
        'comment',
        'is_approved',
    ];

    /**
     * Lấy model chủ quản (Hotel, Tour, hoặc Restaurant)
     */
    public function reviewable()
    {
        return $this->morphTo();
    }

    /**
     * Lấy thông tin người dùng đã viết đánh giá
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope để chỉ lấy những đánh giá đã được duyệt
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}