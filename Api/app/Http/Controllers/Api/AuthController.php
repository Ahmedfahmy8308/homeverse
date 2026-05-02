<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends BaseApiController
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = strtolower(trim((string) $data['email']));
        $password = (string) $data['password'];
        $user = repo_find_user_by_email($email);
        $passwordHash = (string) ($user['password_hash'] ?? '');

        if (!$user || $passwordHash === '' || !password_verify($password, $passwordHash)) {
            return $this->error('Invalid credentials.', 401);
        }

        $token = repo_create_token_for_user((int) $user['id']);

        return $this->success([
            'token' => $token,
            'user' => repo_sanitize_user($user),
        ], 'Login successful.');
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->all();
        $firstName = (string) ($data['firstName'] ?? $data['first_name'] ?? '');
        $lastName = (string) ($data['lastName'] ?? $data['last_name'] ?? '');
        $email = (string) ($data['email'] ?? '');
        $phone = (string) ($data['phone'] ?? '');
        $password = (string) ($data['password'] ?? '');
        $confirmPassword = (string) ($data['confirmPassword'] ?? $data['password_confirmation'] ?? '');

        if ($password !== $confirmPassword) {
            return $this->error('Password confirmation does not match.', 422);
        }

        try {
            $user = repo_create_user([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'phone' => $phone,
                'password' => $password,
            ]);
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        $token = repo_create_token_for_user((int) $user['id']);

        return $this->success([
            'token' => $token,
            'user' => repo_sanitize_user($user),
        ], 'Registration successful.', 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $token = $request->bearerToken();
        if ($token) {
            repo_delete_token($token);
        }

        return $this->success(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        return $this->success($user);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        $freshUser = repo_find_user_by_id((int) $user['id']);
        if ($freshUser === null) {
            return $this->error('Unauthorized.', 401);
        }

        $token = repo_create_token_for_user((int) $freshUser['id']);

        return $this->success(['token' => $token], 'Token refreshed.');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        return $this->success([
            'email' => strtolower(trim((string) $request->input('email'))),
        ], 'Password reset instructions were queued.');
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->requireAuth($request);
        if ($user instanceof JsonResponse) {
            return $user;
        }

        try {
            $updated = repo_update_user((int) $user['id'], $request->all());
        } catch (Throwable $exception) {
            return $this->error($exception->getMessage(), 422);
        }

        if ($updated === null) {
            return $this->error('User not found.', 404);
        }

        return $this->success(repo_sanitize_user($updated), 'Profile updated.');
    }
}
