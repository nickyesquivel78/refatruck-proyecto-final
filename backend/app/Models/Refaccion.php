<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refaccion extends Model
{
    use HasFactory;

    // Especificamos el nombre exacto de la tabla en MySQL
    protected $table = 'refacciones';

    // Le damos permiso a estos 4 campos para que puedan guardar datos
    protected $fillable = ['nombre', 'numero_parte', 'precio', 'stock'];
}
