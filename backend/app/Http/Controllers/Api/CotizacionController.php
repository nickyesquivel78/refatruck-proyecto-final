<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use Illuminate\Support\Facades\DB;

class CotizacionController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validamos que React envíe el paquete correctamente
        $request->validate([
            'total' => 'required|numeric',
            'detalles' => 'required|array',
        ]);

        try {
            // Iniciamos la transacción segura
            DB::beginTransaction();

            // 2. Creamos el folio principal a nombre del cliente que inició sesión
            $cotizacion = Cotizacion::create([
                'user_id' => $request->user()->id, 
                'total' => $request->total,
                'estado' => 'Pendiente' 
            ]);

            // 3. Recorremos el carrito y guardamos pieza por pieza vinculadas al folio
            foreach ($request->detalles as $item) {
                CotizacionDetalle::create([
                    'cotizacion_id' => $cotizacion->id,
                    'refaccion_id' => $item['refaccion_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario']
                ]);
            }

            // Si todo salió perfecto, confirmamos la transacción
            DB::commit();

            return response()->json([
                'message' => 'Cotización creada exitosamente', 
                'cotizacion' => $cotizacion
            ], 201);

        } catch (\Exception $e) {
            // Si hubo cualquier error, cancelamos todo para proteger la base de datos
            DB::rollBack();
            return response()->json([
                'message' => 'Error al guardar la cotización', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Función para obtener las cotizaciones según el rol
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->rol === 'admin' || $user->rol === 'vendedor') {
            // El admin y el vendedor ven todas las cotizaciones con el nombre del cliente pegado
            $cotizaciones = Cotizacion::join('users', 'cotizaciones.user_id', '=', 'users.id')
                ->select('cotizaciones.*', 'users.name as cliente')
                ->orderBy('cotizaciones.id', 'desc')
                ->get();
        } else {
            // El cliente solo ve sus propias cotizaciones
            $cotizaciones = Cotizacion::where('user_id', $user->id)
                ->orderBy('id', 'desc')
                ->get();
        }
        
        return response()->json($cotizaciones);
    }

    // Función exclusiva del Admin para aprobar o rechazar
    public function updateEstado(Request $request, $id)
    {
        $user = $request->user();
        
        // El candado de seguridad backend: si un vendedor intenta hackear, se bloquea
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No tienes permisos para aprobar cotizaciones'], 403);
        }

        $request->validate(['estado' => 'required|string']);

        $cotizacion = Cotizacion::find($id);
        if (!$cotizacion) {
            return response()->json(['message' => 'Cotización no encontrada'], 404);
        }

        $cotizacion->estado = $request->estado;
        $cotizacion->save();

        return response()->json(['message' => 'La cotización fue ' . $request->estado . ' con éxito']);
    }

    // Función para ver los detalles de una cotización específica
    public function show($id)
    {
        $cotizacion = Cotizacion::find($id);
        
        if (!$cotizacion) {
            return response()->json(['message' => 'Cotización no encontrada'], 404);
        }

        // Unimos los detalles con la tabla de refacciones para sacar el nombre y número de parte
        $detalles = CotizacionDetalle::join('refacciones', 'cotizacion_detalles.refaccion_id', '=', 'refacciones.id')
            ->where('cotizacion_id', $id)
            ->select('cotizacion_detalles.*', 'refacciones.nombre', 'refacciones.numero_parte')
            ->get();

        return response()->json([
            'cotizacion' => $cotizacion,
            'detalles' => $detalles
        ]);
    }
}