CREATE TABLE recipe (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    prep_time_minutes INT,
    cook_time_minutes INT,
    category          VARCHAR(50),
    cuisine           VARCHAR(100),
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME NOT NULL
);

CREATE TABLE ingredient (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id  BIGINT NOT NULL,
    name       VARCHAR(255) NOT NULL,
    amount     DECIMAL(10, 3),
    unit       VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_ingredient_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE instruction_step (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id   BIGINT NOT NULL,
    step_number INT  NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_step_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE recipe_flavor_tag (
    recipe_id  BIGINT      NOT NULL,
    flavor_tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (recipe_id, flavor_tag),
    CONSTRAINT fk_flavor_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE recipe_image (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id         BIGINT       NOT NULL,
    file_path         VARCHAR(512) NOT NULL,
    original_filename VARCHAR(255),
    sort_order        INT NOT NULL DEFAULT 0,
    uploaded_at       DATETIME NOT NULL,
    CONSTRAINT fk_image_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE menu (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  DATETIME NOT NULL
);

CREATE TABLE menu_course (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_id         BIGINT     NOT NULL,
    recipe_id       BIGINT     NOT NULL,
    course_category VARCHAR(50) NOT NULL,
    course_order    INT        NOT NULL,
    CONSTRAINT fk_course_menu   FOREIGN KEY (menu_id)   REFERENCES menu   (id) ON DELETE CASCADE,
    CONSTRAINT fk_course_recipe FOREIGN KEY (recipe_id) REFERENCES recipe (id)
);
