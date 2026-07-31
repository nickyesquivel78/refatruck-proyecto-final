<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RefaccionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtenemos todas las refacciones de la base de datos
        $refacciones = \App\Models\Refaccion::all();
        
        // Las devolvemos en formato JSON
        return response()->json([
            'status' => 'success',
            'data' => $refacciones
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Guardamos la pieza directamente en la base de datos con lo que mandó React
        $nuevaRefaccion = \App\Models\Refaccion::create($request->all());
        
        // 2. Le respondemos a React que todo salió perfecto
        return response()->json([
            'status' => 'success',
            'message' => 'Pieza guardada correctamente',
            'data' => $nuevaRefaccion
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $refaccion = \App\Models\Refaccion::find($id);
        
        if (!$refaccion) {
            return response()->json(['message' => 'Pieza no encontrada'], 404);
        }

        $refaccion->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pieza actualizada correctamente'
        ]);
    }

    // Función para BORRAR una pieza
    public function destroy($id)
    {
        $refaccion = \App\Models\Refaccion::find($id);
        
        if (!$refaccion) {
            return response()->json(['message' => 'Pieza no encontrada'], 404);
        }

        $refaccion->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pieza eliminada correctamente'
        ]);
    }
}
