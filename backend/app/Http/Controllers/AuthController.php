<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar que React nos envíe un correo y contraseña
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Buscar al usuario en la base de datos por su correo
        $user = User::where('email', $request->email)->first();

        // 3. Verificar que el usuario exista y que la contraseña coincida
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas. Verifica tus datos.'
            ], 401); // 401 significa "No autorizado"
        }

        // 4. Generar el Token de acceso seguro
        $token = $user->createToken('refatruck_token')->plainTextToken;

        // 5. Responder con el token y los datos del usuario (incluyendo su rol)
        return response()->json([
            'message' => 'Bienvenido a RefaTruck',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol' => $user->rol
            ]
        ]);
    }

    public function register(Request $request)
    {
        // 1. Validar los datos que envía React
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users|max:255', // unique evita correos duplicados
            'password' => 'required|string|min:6',
            'telefono' => 'nullable|string'
        ]);

        // 2. Crear al usuario en la base de datos
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptamos la contraseña con BCRYPT
            'rol' => 'cliente', // Por seguridad, todo nuevo registro externo es cliente
            'telefono' => $request->telefono
        ]);

        // 3. Generar su token para que inicie sesión automáticamente al registrarse
        $token = $user->createToken('refatruck_token')->plainTextToken;

        // 4. Responder con éxito
        return response()->json([
            'message' => '¡Cuenta creada con éxito!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol' => $user->rol
            ]
        ], 201); // 201 significa "Creado"
    }
}