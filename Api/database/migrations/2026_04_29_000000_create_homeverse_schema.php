<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $sqlPath = base_path('sql/schema.sql');
        if (file_exists($sqlPath)) {
            $sql = file_get_contents($sqlPath);
            if ($sql !== false) {
                DB::unprepared($sql);
            }
        }
    }

    public function down(): void
    {
        // Intentionally left blank. Use targeted down migrations if needed.
    }
};
