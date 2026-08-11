<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refaccion extends Model
{
    use HasFactory;

    protected $table = 'refacciones';

    // Agregamos 'descripcion' a la lista de permisos
    protected $fillable = ['nombre', 'numero_parte', 'precio', 'stock'];
}
