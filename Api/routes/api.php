<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\GeneralController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);

Route::controller(AuthController::class)->group(function () {
    Route::post('/auth/register', 'register');
    Route::post('/auth/login', 'login');
    Route::post('/auth/logout', 'logout')->middleware('auth.token');
    Route::get('/auth/me', 'me')->middleware('auth.token');
    Route::put('/auth/profile', 'updateProfile')->middleware('auth.token');
    Route::post('/auth/refresh', 'refreshToken')->middleware('auth.token');
    Route::post('/auth/forgot-password', 'forgotPassword');
});

Route::controller(PropertyController::class)->group(function () {
    Route::get('/properties', 'index');
    Route::get('/properties/{id}', 'show')->whereNumber('id');
    Route::get('/properties/{id}/reviews', 'reviews')->whereNumber('id');
    Route::post('/properties/{id}/reviews', 'submitReview')->whereNumber('id')->middleware('auth.token');
    Route::get('/agents', 'agents');
    Route::get('/agents/{id}', 'agent')->whereNumber('id');
    Route::get('/amenities', 'amenities');
    Route::get('/categories', 'categories');
});

Route::controller(BlogController::class)->group(function () {
    Route::get('/blog-posts', 'index');
    Route::get('/blog-posts/{id}', 'show')->whereNumber('id');
    Route::get('/blog-posts/slug/{slug}', 'showBySlug');
});

Route::controller(GeneralController::class)->group(function () {
    Route::post('/contact', 'submitContact');
    Route::post('/newsletter/subscribe', 'subscribeNewsletter');
    Route::get('/wishlist', 'wishlist')->middleware('auth.token');
    Route::post('/wishlist/{propertyId}', 'toggleWishlist')->whereNumber('propertyId')->middleware('auth.token');
    Route::get('/site-settings', 'siteSettings');
});

Route::prefix('admin')->middleware('auth.token')->controller(AdminController::class)->group(function () {
    Route::get('/dashboard', 'dashboard');

    Route::get('/users', 'users');
    Route::delete('/users/{id}', 'deleteUser')->whereNumber('id');

    Route::get('/properties', 'properties');
    Route::post('/properties', 'createProperty');
    Route::put('/properties/{id}', 'updateProperty')->whereNumber('id');
    Route::delete('/properties/{id}', 'deleteProperty')->whereNumber('id');

    Route::get('/agents', 'agents');
    Route::post('/agents', 'createAgent');
    Route::put('/agents/{id}', 'updateAgent')->whereNumber('id');
    Route::delete('/agents/{id}', 'deleteAgent')->whereNumber('id');

    Route::get('/blog-posts', 'blogPosts');
    Route::post('/blog-posts', 'createBlogPost');
    Route::put('/blog-posts/{id}', 'updateBlogPost')->whereNumber('id');
    Route::delete('/blog-posts/{id}', 'deleteBlogPost')->whereNumber('id');

    Route::get('/contacts', 'contacts');
    Route::put('/contacts/{id}/read', 'markContactRead')->whereNumber('id');

    Route::post('/amenities', 'createAmenity');
    Route::post('/site-settings', 'updateSiteSettings');
});
