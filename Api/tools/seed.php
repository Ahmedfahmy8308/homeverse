<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

chdir(__DIR__ . '/..');
// ensure storage link exists so uploaded files are publicly accessible
$storageLink = __DIR__ . '/../public/storage';
$phpExec = escapeshellarg(PHP_BINARY);
if (!file_exists($storageLink)) {
    passthru($phpExec . ' -d display_startup_errors=0 -d display_errors=0 artisan storage:link', $linkExit);
    if ($linkExit !== 0) {
        fwrite(STDOUT, "storage:link may have failed (exit code: {$linkExit})\n");
    }
}

// run db:seed with suppressed PHP startup/display warnings
passthru($phpExec . ' -d display_startup_errors=0 -d display_errors=0 artisan db:seed --force', $exitCode);

if ($exitCode !== 0) {
    fwrite(STDERR, "artisan db:seed failed with exit code: {$exitCode}\n");
    exit(1);
}

fwrite(STDOUT, "artisan db:seed finished.\n");
