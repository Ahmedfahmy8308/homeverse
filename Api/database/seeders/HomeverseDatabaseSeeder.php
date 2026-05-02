<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class HomeverseDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $seedPath = base_path('sql/seed.sql');
        if (file_exists($seedPath)) {
            $sql = file_get_contents($seedPath);
            if ($sql !== false) {
                \Illuminate\Support\Facades\DB::unprepared($sql);
            }
        }
    }
}
