-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `profile_picture` TEXT NULL,
    `role_id` INTEGER NOT NULL,
    `password` LONGTEXT NOT NULL,
    `shift` VARCHAR(10) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `user_name_key`(`name`),
    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_role_id_idx`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `picture` LONGTEXT NULL,
    `price` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `max_age` INTEGER NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `product_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_ingredient` (
    `id` VARCHAR(191) NOT NULL,
    `report_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id` VARCHAR(191) NULL,

    UNIQUE INDEX `report_ingredient_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_report_ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredient_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `report_id` VARCHAR(191) NOT NULL,

    INDEX `detail_report_ingredient_report_id_ingredient_id_idx`(`report_id`, `ingredient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `price` INTEGER NULL,

    INDEX `ingredient_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `ingredient_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes_ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dose` INTEGER NOT NULL,
    `recipe_id` INTEGER NOT NULL,
    `ingredient_id` INTEGER NOT NULL,

    INDEX `recipes_ingredient_recipe_id_ingredient_id_idx`(`recipe_id`, `ingredient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `total_price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_finance` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `income` INTEGER NOT NULL,
    `cash` INTEGER NOT NULL,
    `report_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `report_finance_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `non_cash` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` VARCHAR(191) NOT NULL,
    `reciept` LONGTEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `amount` INTEGER NOT NULL,

    UNIQUE INDEX `non_cash_report_id_key`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `report_id` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,

    UNIQUE INDEX `expence_report_id_key`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_stock` (
    `id` VARCHAR(191) NOT NULL,
    `report_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `grand_total` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_stock_shift_1` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `values` JSON NOT NULL,

    UNIQUE INDEX `report_stock_shift_1_id_key`(`id`),
    UNIQUE INDEX `report_stock_shift_1_report_id_key`(`report_id`),
    UNIQUE INDEX `report_stock_shift_1_user_id_key`(`user_id`),
    INDEX `report_stock_shift_1_report_id_idx`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_stock_shift_2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `values` JSON NOT NULL,

    UNIQUE INDEX `report_stock_shift_2_id_key`(`id`),
    UNIQUE INDEX `report_stock_shift_2_report_id_key`(`report_id`),
    UNIQUE INDEX `report_stock_shift_2_user_id_key`(`user_id`),
    INDEX `report_stock_shift_2_report_id_idx`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expired_date` TIMESTAMP NOT NULL,
    `quantity` INTEGER NOT NULL,
    `production_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `user_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_ingredient` ADD CONSTRAINT `report_ingredient_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_report_ingredient` ADD CONSTRAINT `detail_report_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_report_ingredient` ADD CONSTRAINT `detail_report_ingredient_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report_ingredient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient` ADD CONSTRAINT `ingredient_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ingredient_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes_ingredient` ADD CONSTRAINT `recipes_ingredient_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes_ingredient` ADD CONSTRAINT `recipes_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_finance` ADD CONSTRAINT `report_finance_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `non_cash` ADD CONSTRAINT `non_cash_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report_finance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expence` ADD CONSTRAINT `expence_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report_finance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_stock_shift_1` ADD CONSTRAINT `report_stock_shift_1_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_stock_shift_1` ADD CONSTRAINT `report_stock_shift_1_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report_stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_stock_shift_2` ADD CONSTRAINT `report_stock_shift_2_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_stock_shift_2` ADD CONSTRAINT `report_stock_shift_2_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `report_stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
