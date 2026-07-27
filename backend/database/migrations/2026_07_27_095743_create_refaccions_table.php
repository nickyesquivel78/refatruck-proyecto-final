<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refaccions', function (Blueprint $table) {
            $table->id(); // Llave primaria automática
            $table->string('numero_parte')->unique();
            $table->string('nombre');
            $table->string('categoria');
            $table->decimal('precio', 10, 2);
            $table->integer('stock')->default(0);
            $table->timestamps(); // Crea automáticamente las columnas created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refaccions');
    }
};
