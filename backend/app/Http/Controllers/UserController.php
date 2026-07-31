<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 

class UserController extends Controller
{
    // 1. Mostrar todos los usuarios registrados
    public function index()
    {
        // Traemos todos los usuarios excepto la contraseña por seguridad
        $usuarios = User::select('id', 'name', 'email', 'rol', 'telefono', 'created_at')->get();
        return response()->json($usuarios);
    }

    // 2. Cambiar el rol de un usuario (Ascender/Degradar)
    public function cambiarRol(Request $request, $id)
    {
        $request->validate([
            'rol' => 'required|in:admin,vendedor,cliente'
        ]);

        $usuario = User::findOrFail($id);
        
        // Evitar que el administrador principal se quite el rol por accidente
        if ($usuario->email === 'admin@refatruck.com' && $request->rol !== 'admin') {
            return response()->json(['message' => 'No puedes quitarle los permisos al Super Administrador.'], 403);
        }

        $usuario->rol = $request->rol;
        $usuario->save();

        return response()->json([
            'message' => 'Permisos actualizados correctamente.',
            'usuario' => $usuario
        ]);
    }
}