<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RefaccionController; // Asegúrate de tener tu controlador importado
use App\Http\Controllers\UserController;

// --- RUTAS PÚBLICAS (No requieren Token) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/registro', [AuthController::class, 'register']);
Route::get('/refacciones', [RefaccionController::class, 'index']); // Todos pueden ver el catálogo

// --- RUTAS PROTEGIDAS (Requieren Token JWT) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // CRUD de Inventario protegido
    Route::post('/refacciones', [RefaccionController::class, 'store']);
    Route::put('/refacciones/{id}', [RefaccionController::class, 'update']);
    Route::delete('/refacciones/{id}', [RefaccionController::class, 'destroy']);
    
    // Ruta para cerrar sesión
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    });
    // Gestión de Usuarios (Exclusivo para el Admin)
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::put('/usuarios/{id}/rol', [UserController::class, 'cambiarRol']);    
});