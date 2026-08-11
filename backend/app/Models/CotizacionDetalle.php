<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CotizacionDetalle extends Model
{
    use HasFactory;

    protected $table = 'cotizacion_detalles';

    // Permisos para cada pieza agregada al carrito
    protected $fillable = ['cotizacion_id', 'refaccion_id', 'cantidad', 'precio_unitario'];
}