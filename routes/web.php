<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/employee', [EmployeeController::class, 'index']); // เส้นทางสำหรับแสดงรายการพนักงาน
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard'); // เส้นทางสำหรับแสดงแดชบอร์ด

Route::middleware('auth')->group(function () { // กลุ่มเส้นทางที่ต้องการการยืนยันตัวตน
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit'); // เส้นทางสำหรับแก้ไขโปรไฟล์
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update'); // เส้นทางสำหรับอัปเดตโปรไฟล์
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy'); // เส้นทางสำหรับลบโปรไฟล์
});

require __DIR__.'/auth.php'; // รวมเส้นทางการยืนยันตัวตน
