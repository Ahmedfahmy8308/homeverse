-- Copyright (c) 2025 Ahmed Fahmy
-- Developed at UFUQ TECH
-- Proprietary software. See LICENSE file in the project root for full license information.

-- ============================================================================
-- Homeverse canonical schema
-- Localized content is stored as JSON objects with `en` and `ar` keys.
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(60)  NOT NULL,
    last_name       VARCHAR(60)  NOT NULL,
    email           VARCHAR(190) NOT NULL,
    phone           VARCHAR(30)  NOT NULL DEFAULT '',
    password_hash   VARCHAR(255) NOT NULL,
    avatar          VARCHAR(500) NOT NULL DEFAULT '',
    role            ENUM('admin','user') NOT NULL DEFAULT 'user',
    location        VARCHAR(120) NOT NULL DEFAULT '',
    bio             TEXT         NOT NULL DEFAULT (''),
    dob             DATE         NULL,
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS api_tokens;
CREATE TABLE IF NOT EXISTS api_tokens (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    token       CHAR(64)     NOT NULL,
    expires_at  DATETIME     NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_api_tokens_token (token),
    INDEX idx_api_tokens_user_id (user_id),
    CONSTRAINT fk_api_tokens_users
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS agents;
CREATE TABLE IF NOT EXISTS agents (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NULL,
    name            JSON         NOT NULL,
    email           VARCHAR(190) NOT NULL DEFAULT '',
    phone           VARCHAR(30)  NOT NULL DEFAULT '',
    avatar          VARCHAR(500) NOT NULL DEFAULT '',
    bio             JSON         NULL,
    speciality      VARCHAR(120) NOT NULL DEFAULT 'Real Estate',
    properties_sold INT UNSIGNED NOT NULL DEFAULT 0,
    rating          DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_agents_user_id (user_id),
    CONSTRAINT fk_agents_users
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS property_categories;
CREATE TABLE IF NOT EXISTS property_categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        JSON         NOT NULL,
    slug        VARCHAR(80)  NOT NULL,
    icon        VARCHAR(60)  NOT NULL DEFAULT '',
    description JSON         NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_property_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS properties;
CREATE TABLE IF NOT EXISTS properties (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title           JSON         NOT NULL,
    description     JSON         NOT NULL,
    city            JSON         NOT NULL,
    address         JSON         NOT NULL,
    location_label  JSON         NOT NULL,
    latitude        DECIMAL(10,7) NULL,
    longitude       DECIMAL(10,7) NULL,
    price           DECIMAL(14,2) NOT NULL,
    currency        VARCHAR(10)  NOT NULL DEFAULT 'EGP',
    price_period    VARCHAR(40)  NOT NULL DEFAULT '',
    listing_type    ENUM('rent','sale') NOT NULL DEFAULT 'rent',
    category_id     INT UNSIGNED NULL,
    agent_id        INT UNSIGNED NULL,
    bedrooms        TINYINT UNSIGNED NOT NULL DEFAULT 0,
    bathrooms       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    area_sqft       INT UNSIGNED NOT NULL DEFAULT 0,
    floors          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    garage          TINYINT UNSIGNED NOT NULL DEFAULT 0,
    year_built      SMALLINT UNSIGNED NULL,
    is_featured     TINYINT(1)   NOT NULL DEFAULT 0,
    status          ENUM('active','pending','sold','rented','archived') NOT NULL DEFAULT 'active',
    views_count     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_properties_featured (is_featured),
    INDEX idx_properties_listing_type (listing_type),
    INDEX idx_properties_status (status),
    INDEX idx_properties_category (category_id),
    INDEX idx_properties_agent (agent_id),
    CONSTRAINT fk_properties_category
        FOREIGN KEY (category_id) REFERENCES property_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_agent
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS property_images;
CREATE TABLE IF NOT EXISTS property_images (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNSIGNED NOT NULL,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(200) NOT NULL DEFAULT '',
    sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_primary  TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_property_images_property (property_id),
    CONSTRAINT fk_property_images_property
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS amenities;
CREATE TABLE IF NOT EXISTS amenities (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        JSON         NOT NULL,
    slug        VARCHAR(100) NOT NULL,
    icon        VARCHAR(60)  NOT NULL DEFAULT '',
    description JSON         NOT NULL,
    image_url   VARCHAR(500) NOT NULL DEFAULT '',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_amenities_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS property_amenities;
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INT UNSIGNED NOT NULL,
    amenity_id  INT UNSIGNED NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT fk_pa_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_amenity  FOREIGN KEY (amenity_id)  REFERENCES amenities(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    property_id INT UNSIGNED NOT NULL,
    user_id     INT UNSIGNED NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL DEFAULT 5,
    comment     TEXT         NOT NULL DEFAULT (''),
    is_approved TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reviews_property (property_id),
    INDEX idx_reviews_user (user_id),
    CONSTRAINT fk_reviews_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS wishlists;
CREATE TABLE IF NOT EXISTS wishlists (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    property_id INT UNSIGNED NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wishlist_user_property (user_id, property_id),
    CONSTRAINT fk_wishlists_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
    CONSTRAINT fk_wishlists_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS contact_messages;
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(60)  NOT NULL,
    last_name   VARCHAR(60)  NOT NULL DEFAULT '',
    email       VARCHAR(190) NOT NULL,
    phone       VARCHAR(30)  NOT NULL DEFAULT '',
    subject     VARCHAR(200) NOT NULL DEFAULT '',
    message     TEXT         NOT NULL,
    property_id INT UNSIGNED NULL,
    agent_id    INT UNSIGNED NULL,
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_messages_read (is_read),
    CONSTRAINT fk_contact_messages_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    CONSTRAINT fk_contact_messages_agent    FOREIGN KEY (agent_id)    REFERENCES agents(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS blog_posts;
CREATE TABLE IF NOT EXISTS blog_posts (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title         JSON         NOT NULL,
    slug          VARCHAR(200) NOT NULL,
    excerpt       JSON         NOT NULL,
    content       JSON         NOT NULL,
    category      JSON         NOT NULL,
    tags          JSON         NOT NULL,
    image_url     VARCHAR(500) NOT NULL DEFAULT '',
    author_id     INT UNSIGNED NULL,
    author_name   JSON         NOT NULL,
    author_avatar VARCHAR(500) NOT NULL DEFAULT '',
    read_time     VARCHAR(20)  NOT NULL DEFAULT '5 min',
    is_published  TINYINT(1)   NOT NULL DEFAULT 0,
    published_at  DATE         NULL,
    views_count   INT UNSIGNED NOT NULL DEFAULT 0,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_blog_posts_slug (slug),
    INDEX idx_blog_posts_published (is_published, published_at),
    INDEX idx_blog_posts_author (author_id),
    CONSTRAINT fk_blog_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS newsletter_subscribers;
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(190) NOT NULL,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS site_settings;
CREATE TABLE IF NOT EXISTS site_settings (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key   VARCHAR(120) NOT NULL,
    setting_value TEXT         NOT NULL,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_site_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
