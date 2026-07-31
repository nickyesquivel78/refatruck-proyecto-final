<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Importamos la herramienta BCRYPT

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cuenta de Administrador (Tú)
        User::create([
            'name' => 'Nicky Admin',
            'email' => 'admin@refatruck.com',
            'password' => Hash::make('admin123'), // Aquí se aplica el algoritmo BCRYPT
            'rol' => 'admin',
            'telefono' => '4491234567'
        ]);

        // 2. Cuenta de Vendedor
        User::create([
            'name' => 'Juan Vendedor',
            'email' => 'ventas@refatruck.com',
            'password' => Hash::make('ventas123'),
            'rol' => 'vendedor',
            'telefono' => '4497654321'
        ]);

        // 3. Cuenta de Cliente
        User::create([
            'name' => 'Cliente Transportes',
            'email' => 'cliente@gmail.com',
            'password' => Hash::make('cliente123'),
            'rol' => 'cliente',
            'telefono' => '4490000000'
        ]);
    }
}