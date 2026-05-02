<?php
// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

declare(strict_types=1);

use App\Models\User;
use App\Models\ApiToken;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Agent;
use App\Models\Amenity;
use App\Models\Review;
use App\Models\PropertyCategory;
use App\Models\BlogPost;
use App\Models\Wishlist;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\SiteSetting;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

if (!function_exists('repo_find_user_by_email')) {
    function repo_find_user_by_email(string $email): ?array
    {
        $user = User::where('email', strtolower(trim($email)))->first();
        return $user ? $user->getAttributes() : null;
    }
}

if (!function_exists('repo_create_user')) {
    function repo_create_user(array $data): array
    {
        $password = (string) ($data['password'] ?? '');
        $avatar = $data['avatar'] ?? '';
        if ($avatar instanceof UploadedFile) {
            $avatar = $avatar->store('users', 'public');
        }
        $user = User::create([
            'first_name' => $data['first_name'] ?? $data['firstName'] ?? '',
            'last_name' => $data['last_name'] ?? $data['lastName'] ?? '',
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'phone' => $data['phone'] ?? '',
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'avatar' => $avatar,
            'role' => $data['role'] ?? 'user',
            'location' => $data['location'] ?? '',
            'bio' => $data['bio'] ?? '',
            'is_active' => $data['is_active'] ?? 1,
        ]);

        return $user->toArray();
    }
}

if (!function_exists('repo_find_user_by_id')) {
    function repo_find_user_by_id(int $id): ?array
    {
        $user = User::find($id);
        return $user ? $user->toArray() : null;
    }
}

if (!function_exists('repo_update_user')) {
    function repo_update_user(int $id, array $data): ?array
    {
        $user = User::find($id);
        if (!$user) {
            return null;
        }

        $update = [];
        foreach (['first_name','last_name','email','phone','avatar','role','location','bio','dob','is_active'] as $k) {
            if (array_key_exists($k, $data)) {
                $update[$k] = $data[$k] instanceof UploadedFile
                    ? $data[$k]->store('users', 'public')
                    : $data[$k];
            }
        }

        if (isset($data['password'])) {
            $update['password_hash'] = password_hash((string)$data['password'], PASSWORD_DEFAULT);
        }

        $user->update($update);
        return $user->toArray();
    }
}

if (!function_exists('repo_sanitize_user')) {
    function repo_sanitize_user(array $user): array
    {
        // Map user array to public shape expected by frontend
        return [
            'id' => (int) ($user['id'] ?? 0),
            'first_name' => $user['first_name'] ?? '',
            'last_name' => $user['last_name'] ?? '',
            'email' => $user['email'] ?? '',
            'phone' => $user['phone'] ?? '',
            'avatar' => $user['avatar'] ?? '',
            'role' => $user['role'] ?? 'user',
            'location' => $user['location'] ?? '',
            'bio' => $user['bio'] ?? '',
            'dob' => $user['dob'] ?? null,
            'is_active' => (bool) ($user['is_active'] ?? true),
            'created_at' => $user['created_at'] ?? null,
        ];
    }
}

if (!function_exists('repo_create_token_for_user')) {
    function repo_create_token_for_user(int $userId): string
    {
        $user = User::find($userId);
        if (!$user) {
            throw new \RuntimeException('User not found');
        }

        return ApiToken::createForUser($user);
    }
}

if (!function_exists('repo_delete_token')) {
    function repo_delete_token(string $token): void
    {
        ApiToken::where('token', $token)->delete();
    }
}

if (!function_exists('repo_find_user_by_token')) {
    function repo_find_user_by_token(string $token): ?array
    {
        $t = ApiToken::where('token', $token)->first();
        if (!$t) {
            return null;
        }
        $user = $t->user;
        return $user ? $user->toArray() : null;
    }
}

// Properties and related
if (!function_exists('repo_list_properties')) {
    function repo_list_properties(array $filters = []): array
    {
        $q = Property::query();
        if (!empty($filters['featured'])) {
            $q->where('is_featured', (int) $filters['featured']);
        }
        if (!empty($filters['listing_type'])) {
            $q->where('listing_type', $filters['listing_type']);
        }
        if (!empty($filters['city'])) {
            $q->where('city', $filters['city']);
        }
        if (!empty($filters['category_id'])) {
            $q->where('category_id', (int)$filters['category_id']);
        }
        if (!empty($filters['status'])) {
            $q->where('status', $filters['status']);
        }
        if (!empty($filters['search'])) {
            $search = '%' . trim((string) $filters['search']) . '%';
            $q->where(function($qq) use ($search) {
                $qq->where('title->en', 'like', $search)
                   ->orWhere('title->ar', 'like', $search)
                   ->orWhere('description->en', 'like', $search)
                   ->orWhere('description->ar', 'like', $search)
                   ->orWhere('city->en', 'like', $search)
                   ->orWhere('city->ar', 'like', $search)
                   ->orWhere('address->en', 'like', $search)
                   ->orWhere('address->ar', 'like', $search);
            });
        }
        if (!empty($filters['limit'])) {
            $q->limit((int)$filters['limit']);
        }
        if (!empty($filters['offset'])) {
            $q->offset((int)$filters['offset']);
        }

        return $q->with(['images','agent','amenities'])->get()->map(fn($p) => $p->toArray())->toArray();
    }
}

if (!function_exists('repo_get_property')) {
    function repo_get_property(int $id): ?array
    {
        $p = Property::with(['images','agent','amenities'])->find($id);
        return $p ? $p->toArray() : null;
    }

    if (!function_exists('repo_create_property')) {
        function repo_create_property(Request $request): array
        {
            $title = repo_normalize_localized_value($request->input('title', ''), '');
            $description = repo_normalize_localized_value($request->input('description', ''), '');

            $data = [
                'title' => $title,
                'description' => $description,
                'city' => repo_normalize_localized_value($request->input('city', ''), ''),
                'address' => repo_normalize_localized_value($request->input('address', ''), ''),
                'location_label' => repo_normalize_localized_value($request->input('location_label', ''), ''),
                'price' => $request->input('price', 0),
                'currency' => (string) $request->input('currency', 'EGP'),
                'price_period' => (string) $request->input('price_period', ''),
                'listing_type' => (string) $request->input('listing_type', 'sale'),
                'category_id' => $request->input('category_id') ? (int)$request->input('category_id') : null,
                'agent_id' => $request->input('agent_id') ? (int)$request->input('agent_id') : null,
                'bedrooms' => (int) $request->input('bedrooms', 0),
                'bathrooms' => (int) $request->input('bathrooms', 0),
                'area_sqft' => (int) $request->input('area_sqft', 0),
                'floors' => (int) $request->input('floors', 0),
                'garage' => (int) $request->input('garage', 0),
                'year_built' => (int) $request->input('year_built', 0),
                'is_featured' => (int) $request->boolean('is_featured', false),
                'status' => (string) $request->input('status', 'draft'),
                'views_count' => 0,
            ];

            $property = Property::create($data);

            // handle uploaded images (single or multiple)
            if ($request->hasFile('image_files')) {
                $files = $request->file('image_files');
                if (!is_array($files)) {
                    $files = [$files];
                }
                foreach ($files as $idx => $f) {
                    if ($f instanceof UploadedFile) {
                        $path = $f->store('properties', 'public');
                        PropertyImage::create([
                            'property_id' => $property->id,
                            'image_url' => $path,
                            'alt_text' => (string) $request->input("image_alt_texts.{$idx}", ''),
                            'sort_order' => $idx,
                            'is_primary' => $idx === 0 ? 1 : 0,
                        ]);
                    }
                }
            } elseif ($request->hasFile('image_file')) {
                $f = $request->file('image_file');
                if ($f instanceof UploadedFile) {
                    $path = $f->store('properties', 'public');
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'image_url' => $path,
                        'alt_text' => (string) $request->input('image_alt_text', ''),
                        'sort_order' => 0,
                        'is_primary' => 1,
                    ]);
                }
            }

            return $property->fresh()->toArray();
        }
    }

    if (!function_exists('repo_update_property')) {
        function repo_update_property(int $id, Request $request): ?array
        {
            $property = Property::find($id);
            if (!$property) return null;

            $update = [];
            if ($request->has('title')) $update['title'] = repo_normalize_localized_value($request->input('title', ''), '');
            if ($request->has('description')) $update['description'] = repo_normalize_localized_value($request->input('description', ''), '');
            if ($request->has('city')) $update['city'] = repo_normalize_localized_value($request->input('city', ''), '');
            if ($request->has('address')) $update['address'] = repo_normalize_localized_value($request->input('address', ''), '');
            if ($request->has('location_label')) $update['location_label'] = repo_normalize_localized_value($request->input('location_label', ''), '');
            foreach (['price','currency','price_period','listing_type','category_id','agent_id','bedrooms','bathrooms','area_sqft','floors','garage','year_built','is_featured','status'] as $k) {
                if ($request->has($k)) {
                    $update[$k] = $request->input($k);
                }
            }

            if (!empty($update)) {
                $property->update($update);
            }

            // handle additional uploaded images
            if ($request->hasFile('image_files')) {
                $files = $request->file('image_files');
                if (!is_array($files)) $files = [$files];
                foreach ($files as $idx => $f) {
                    if ($f instanceof UploadedFile) {
                        $path = $f->store('properties', 'public');
                        PropertyImage::create([
                            'property_id' => $property->id,
                            'image_url' => $path,
                            'alt_text' => (string) $request->input("image_alt_texts.{$idx}", ''),
                            'sort_order' => PropertyImage::where('property_id', $property->id)->count(),
                            'is_primary' => 0,
                        ]);
                    }
                }
            }

            return $property->fresh()->toArray();
        }
    }

    if (!function_exists('repo_delete_property')) {
        function repo_delete_property(int $id): bool
        {
            $p = Property::find($id);
            if (!$p) return false;
            // delete images records (files left on disk intentionally)
            PropertyImage::where('property_id', $p->id)->delete();
            $p->delete();
            return true;
        }
    }
}

if (!function_exists('repo_list_reviews')) {
    function repo_list_reviews(int $propertyId): array
    {
        return Review::where('property_id', $propertyId)->get()->map(fn($r) => $r->toArray())->toArray();
    }
}

if (!function_exists('repo_create_review')) {
    function repo_create_review(int $propertyId, int $userId, array $data): array
    {
        $review = Review::create([
            'property_id' => $propertyId,
            'user_id' => $userId,
            'rating' => $data['rating'] ?? 5,
            'comment' => $data['comment'] ?? '',
            'is_approved' => 0,
            'created_at' => now()->toDateTimeString(),
        ]);

        return $review->toArray();
    }
}

if (!function_exists('repo_list_agents')) {
    function repo_list_agents(): array
    {
        return Agent::all()->map(fn($a) => $a->toArray())->toArray();
    }
}

if (!function_exists('repo_create_agent')) {
    function repo_create_agent(Request $request): array
    {
        $name = repo_normalize_localized_value($request->input('name', ''), '');
        $avatar = (string) $request->input('avatar', '');

        if ($request->hasFile('avatar_file')) {
            $file = $request->file('avatar_file');
            if ($file instanceof UploadedFile) {
                $avatar = $file->store('agents', 'public');
            }
        }

        $agent = Agent::create([
            'user_id' => $request->input('user_id') ? (int) $request->input('user_id') : null,
            'name' => $name,
            'email' => (string) $request->input('email', ''),
            'phone' => (string) $request->input('phone', ''),
            'avatar' => $avatar,
            'bio' => repo_normalize_localized_value($request->input('bio', ''), ''),
            'speciality' => (string) $request->input('speciality', 'Real Estate'),
            'properties_sold' => (int) $request->input('properties_sold', 0),
            'rating' => (float) $request->input('rating', 0),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return $agent->toArray();
    }
}

if (!function_exists('repo_update_agent')) {
    function repo_update_agent(int $id, Request $request): ?array
    {
        $agent = Agent::find($id);
        if (!$agent) {
            return null;
        }

        $update = [];
        if ($request->has('name')) $update['name'] = repo_normalize_localized_value($request->input('name', ''), '');
        if ($request->has('bio')) $update['bio'] = repo_normalize_localized_value($request->input('bio', ''), '');
        foreach (['user_id','email','phone','speciality','properties_sold','rating','is_active'] as $key) {
            if ($request->has($key)) {
                $update[$key] = $request->input($key);
            }
        }

        if ($request->hasFile('avatar_file')) {
            $file = $request->file('avatar_file');
            if ($file instanceof UploadedFile) {
                $update['avatar'] = $file->store('agents', 'public');
            }
        } elseif ($request->has('avatar')) {
            $update['avatar'] = (string) $request->input('avatar', '');
        }

        $agent->update($update);
        return $agent->fresh()->toArray();
    }
}

if (!function_exists('repo_delete_agent')) {
    function repo_delete_agent(int $id): bool
    {
        $agent = Agent::find($id);
        if (!$agent) {
            return false;
        }

        $agent->delete();
        return true;
    }
}

if (!function_exists('repo_get_agent')) {
    function repo_get_agent(int $id): ?array
    {
        $a = Agent::find($id);
        return $a ? $a->toArray() : null;
    }
}

if (!function_exists('repo_list_amenities')) {
    function repo_list_amenities(): array
    {
        return Amenity::all()->map(fn($a) => $a->toArray())->toArray();
    }
}

if (!function_exists('repo_list_categories')) {
    function repo_list_categories(): array
    {
        return PropertyCategory::all()->map(fn($c) => $c->toArray())->toArray();
    }
}

// Blog
if (!function_exists('repo_list_blog_posts')) {
    function repo_list_blog_posts(array $filters = []): array
    {
        $q = BlogPost::query();
        if (!empty($filters['category'])) {
            $q->where(function ($query) use ($filters) {
                $query->where('category->en', $filters['category'])
                    ->orWhere('category->ar', $filters['category']);
            });
        }
        if (empty($filters['all'])) {
            $q->where('is_published', 1);
        }
        if (!empty($filters['limit'])) {
            $q->limit((int)$filters['limit']);
        }
        if (!empty($filters['search'])) {
            $search = '%' . trim((string) $filters['search']) . '%';
            $q->where(function ($query) use ($search) {
                $query->where('title->en', 'like', $search)
                    ->orWhere('title->ar', 'like', $search)
                    ->orWhere('excerpt->en', 'like', $search)
                    ->orWhere('excerpt->ar', 'like', $search);
            });
        }
        return $q->get()->map(fn($p) => $p->toArray())->toArray();
    }
}

if (!function_exists('repo_get_blog_post')) {
    function repo_get_blog_post(int $id): ?array
    {
        $p = BlogPost::find($id);
        return $p ? $p->toArray() : null;
    }
}

if (!function_exists('repo_get_blog_post_by_slug')) {
    function repo_get_blog_post_by_slug(string $slug): ?array
    {
        $p = BlogPost::where('slug', $slug)->first();
        return $p ? $p->toArray() : null;
    }
}

if (!function_exists('repo_normalize_localized_value')) {
    function repo_normalize_localized_value(mixed $value, string $fallback = ''): array
    {
        if (is_array($value)) {
            return [
                'en' => (string) ($value['en'] ?? $fallback),
                'ar' => (string) ($value['ar'] ?? ($value['en'] ?? $fallback)),
            ];
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return [
                    'en' => (string) ($decoded['en'] ?? $fallback),
                    'ar' => (string) ($decoded['ar'] ?? ($decoded['en'] ?? $fallback)),
                ];
            }

            return ['en' => $value, 'ar' => $value];
        }

        return ['en' => $fallback, 'ar' => $fallback];
    }
}

if (!function_exists('repo_normalize_localized_array')) {
    function repo_normalize_localized_array(mixed $value): array
    {
        if (is_array($value)) {
            return [
                'en' => array_values(array_map('strval', $value['en'] ?? [])),
                'ar' => array_values(array_map('strval', $value['ar'] ?? ($value['en'] ?? []))),
            ];
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return [
                    'en' => array_values(array_map('strval', $decoded['en'] ?? [])),
                    'ar' => array_values(array_map('strval', $decoded['ar'] ?? ($decoded['en'] ?? []))),
                ];
            }

            $parts = array_values(array_filter(array_map('trim', explode(',', $value))));
            return ['en' => $parts, 'ar' => $parts];
        }

        return ['en' => [], 'ar' => []];
    }
}

if (!function_exists('repo_store_blog_image')) {
    function repo_store_blog_image(?UploadedFile $file, ?string $existingPath = null): ?string
    {
        if ($file !== null) {
            return $file->store('blog-posts', 'public');
        }

        return $existingPath;
    }
}

if (!function_exists('repo_extract_blog_payload')) {
    function repo_extract_blog_payload(Request $request): array
    {
        $title = repo_normalize_localized_value($request->input('title'), '');
        $excerpt = repo_normalize_localized_value($request->input('excerpt'), '');
        $content = repo_normalize_localized_value($request->input('content'), '');
        $category = repo_normalize_localized_value($request->input('category'), 'General');
        $authorName = repo_normalize_localized_value($request->input('author_name'), 'Admin');
        $tags = repo_normalize_localized_array($request->input('tags'));

        $payload = [
            'title' => $title,
            'slug' => (string) $request->input('slug', ''),
            'excerpt' => $excerpt,
            'content' => $content,
            'category' => $category,
            'tags' => $tags,
            'author_name' => $authorName,
            'author_avatar' => (string) $request->input('author_avatar', ''),
            'read_time' => (string) $request->input('read_time', '5 min'),
            'is_published' => (bool) $request->boolean('is_published', false),
            'published_at' => $request->input('published_at'),
        ];

        if ($request->hasFile('image_file')) {
            $payload['image_url'] = $request->file('image_file')->store('blog-posts', 'public');
        } elseif ($request->filled('image_url')) {
            $payload['image_url'] = (string) $request->input('image_url');
        }

        if (empty($payload['slug'])) {
            $payload['slug'] = Str::slug($title['en'] ?: $title['ar'] ?: 'blog-post');
        }

        return $payload;
    }
}

if (!function_exists('repo_create_blog_post')) {
    function repo_create_blog_post(Request $request, ?int $authorId = null): array
    {
        $payload = repo_extract_blog_payload($request);
        $authorId = $authorId ?: null;

        $post = BlogPost::create([
            'title' => $payload['title'],
            'slug' => $payload['slug'],
            'excerpt' => $payload['excerpt'],
            'content' => $payload['content'],
            'category' => $payload['category'],
            'tags' => $payload['tags'],
            'image_url' => $payload['image_url'] ?? '',
            'author_id' => $authorId,
            'author_name' => $payload['author_name'],
            'author_avatar' => $payload['author_avatar'],
            'read_time' => $payload['read_time'],
            'is_published' => $payload['is_published'],
            'published_at' => $payload['published_at'],
            'views_count' => 0,
        ]);

        return $post->toArray();
    }
}

if (!function_exists('repo_update_blog_post')) {
    function repo_update_blog_post(int $id, Request $request): ?array
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return null;
        }

        $payload = repo_extract_blog_payload($request);
        $update = [];

        foreach (['title', 'slug', 'excerpt', 'content', 'category', 'tags', 'author_name', 'author_avatar', 'read_time', 'published_at'] as $key) {
            if ($request->has($key)) {
                $update[$key] = $payload[$key];
            }
        }

        if ($request->has('is_published')) {
            $update['is_published'] = $payload['is_published'];
        }

        if ($request->hasFile('image_file')) {
            $update['image_url'] = $payload['image_url'] ?? '';
        } elseif ($request->filled('image_url')) {
            $update['image_url'] = (string) $request->input('image_url');
        }

        $post->update($update);
        return $post->fresh()->toArray();
    }
}

if (!function_exists('repo_delete_blog_post')) {
    function repo_delete_blog_post(int $id): bool
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return false;
        }

        $post->delete();
        return true;
    }
}

// General actions
if (!function_exists('repo_create_contact')) {
    function repo_create_contact(array $data): array
    {
        $msg = ContactMessage::create([
            'first_name' => $data['first_name'] ?? '',
            'last_name' => $data['last_name'] ?? '',
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? '',
            'subject' => $data['subject'] ?? '',
            'message' => $data['message'] ?? '',
            'property_id' => $data['property_id'] ?? null,
            'agent_id' => $data['agent_id'] ?? null,
            'is_read' => 0,
            'created_at' => now()->toDateTimeString(),
        ]);

        return $msg->toArray();
    }
}

if (!function_exists('repo_subscribe_newsletter')) {
    function repo_subscribe_newsletter(string $email): array
    {
        $sub = NewsletterSubscriber::firstOrCreate(['email' => $email], ['is_active' => 1, 'created_at' => now()->toDateTimeString()]);
        return $sub->toArray();
    }
}

if (!function_exists('repo_get_wishlist')) {
    function repo_get_wishlist(int $userId): array
    {
        $ids = Wishlist::where('user_id', $userId)->pluck('property_id')->toArray();
        return Property::whereIn('id', $ids)->with('images')->get()->map(fn($p) => $p->toArray())->toArray();
    }
}

if (!function_exists('repo_toggle_wishlist')) {
    function repo_toggle_wishlist(int $userId, int $propertyId): array
    {
        $existing = Wishlist::where('user_id', $userId)->where('property_id', $propertyId)->first();
        if ($existing) {
            $existing->delete();
            return ['removed' => true];
        }
        Wishlist::create(['user_id' => $userId, 'property_id' => $propertyId, 'created_at' => now()->toDateTimeString()]);
        return ['added' => true];
    }
}

if (!function_exists('repo_get_settings_map')) {
    function repo_get_settings_map(): array
    {
        return SiteSetting::all()->mapWithKeys(fn($s) => [$s->setting_key => $s->setting_value])->toArray();
    }
}

if (!function_exists('repo_list_users')) {
    function repo_list_users(): array
    {
        return User::all()->map(fn($u) => $u->toArray())->toArray();
    }
}

if (!function_exists('repo_delete_user')) {
    function repo_delete_user(int $id): bool
    {
        $u = User::find($id);
        if (!$u) return false;
        $u->delete();
        return true;
    }
}

if (!function_exists('repo_admin_dashboard')) {
    function repo_admin_dashboard(): array
    {
        return [
            'totalUsers' => User::count(),
            'totalProperties' => Property::count(),
            'totalAgents' => Agent::count(),
        ];
    }
}

if (!function_exists('repo_list_contacts')) {
    function repo_list_contacts(bool $unreadOnly = false): array
    {
        $q = ContactMessage::query();
        if ($unreadOnly) {
            $q->where('is_read', 0);
        }
        return $q->get()->map(fn($c) => $c->toArray())->toArray();
    }
}

if (!function_exists('repo_mark_contact_read')) {
    function repo_mark_contact_read(int $id): void
    {
        $c = ContactMessage::find($id);
        if ($c) {
            $c->is_read = 1;
            $c->save();
        }
    }
}

if (!function_exists('repo_create_amenity')) {
    function repo_create_amenity(Request $request): array
    {
        $name = repo_normalize_localized_value($request->input('name', ''), '');
        $description = repo_normalize_localized_value($request->input('description', ''), '');
        $imageUrl = (string) $request->input('image_url', '');

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            if ($file instanceof UploadedFile) {
                $imageUrl = $file->store('amenities', 'public');
            }
        }

        $a = Amenity::create([
            'name' => $name,
            'slug' => (string) $request->input('slug', Str::slug($name['en'] ?? 'amenity')),
            'icon' => (string) $request->input('icon', ''),
            'description' => $description,
            'image_url' => $imageUrl,
        ]);
        return $a->toArray();
    }
}

if (!function_exists('repo_bulk_upsert_settings')) {
    function repo_bulk_upsert_settings(array $settings): void
    {
        foreach ($settings as $k => $v) {
            SiteSetting::updateOrCreate(['setting_key' => $k], ['setting_value' => is_string($v) ? $v : json_encode($v), 'updated_at' => now()->toDateTimeString()]);
        }
    }
}
